var margin = {top: 20, right:20, bottom: 80, left: 50};
var height2 = 500 - margin.top - margin.bottom;
var width2 = 800 - margin.right - margin.left;

// Draw svg
var svg2 = d3.select("#viz-2")
            .append("svg")
            .attr("width", width2 + margin.left + margin.right)
            .attr("height", height2 + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Draw axes labels
svg2.append("text")
  .attr("transform", "translate(" + (width2 / 2) + ",0)")
  .style("text-anchor", "middle")
  .style("font-weight", "bold")
  .text("Boston Marathon winning times");

svg2.append("text")
  .attr("transform", "translate(" + (width2 / 2) + "," + (height2 + 35) + ")")
  .style("text-anchor", "middle")
  .text("Years");

svg2.append("text")
  .attr("x", -(height2 / 2))
  .attr("y", -30)
  .attr("transform", "rotate(-90)")
  .style("text-anchor", "middle")
  .text("Time in minutes");

// Setting up scalers
var yScale2 = d3.scaleLinear()
                .rangeRound([height2, 0])

var xScale2 = d3.scaleLinear()
                .rangeRound([0, width2]);

// Setting up axis
var xAxis2 = d3.axisBottom()
              .scale(xScale2);

var yAxis2 = d3.axisLeft()
               .scale(yScale2)
               .ticks(10);

// Tooltip functions
var showToolTip2 = function(self, d) {
  d3.select("#tooltip2")
    .select("#year")
    .text(d.Year);
  
  d3.select("#tooltip2")
    .select("#time")
    .text(d.Time);
  
  d3.select("#tooltip2")
    .select("#name")
    .text(d.Athlete);

  d3.select("#tooltip2").classed("invisible", false);
}
var hideToolTip2 = function() {
  d3.select("#tooltip2").classed("invisible", true);
}

var cleanData = function(ds) {
  return ds.filter(function(x) { if (x.Time != "TBD") return x; })
           .map(function(x) {
             var hour = Number(x.Time.substring(0,1));
             var min = Number(x.Time.substring(2,4));
             for (i = 0; i < hour; i++) {
               min += 60;
             }
             x.Time = min;
             x.Year = Number(x.Year);
             return x;
           });
}

var drawPath = function() {
  if (togglePath) {
    togglePath = !togglePath;
    activeDataset.forEach(function(data) {
      d3.csv(data, function(error, data) {
        var ds = cleanData(data);
        var line = d3.line()
                      .x(function(d) { return xScale2(d.Year) })
                      .y(function(d) { return yScale2(d.Time) })
      
          svg2.append('path')
              .datum(ds)
              .attr('fill', 'none')
              .attr('stroke', 'steelblue')
              .attr('stroke-linejoin', 'round')
              .attr('stroke-linecap', 'round')
              .attr('stroke-width', 1.5)
              .attr('d', line)
              .attr('class', 'c-line');
      })
    })
  } else {
    togglePath = !togglePath;
    d3.selectAll('.c-line')
      .remove();
  }
}

var drawStraightLine = function() {
  if (toggleStraightLine) {
    toggleStraightLine = !toggleStraightLine;
    activeDataset.forEach(function(data) {
      var sex = data;
      d3.csv(data, function(error, data) {
        var ds = cleanData(data);

        // get the x and y values for least squares
        var xLabels = ds.map(function(d) { return d.Year });
        var xSeries = d3.range(1, xLabels.length + 1);
        var ySeries = ds.map(function(d) { return parseFloat(d.Time); });
        
        var leastSquaresCoeff = leastSquares(xSeries, ySeries);
        
        // apply the reults of the least squares regression
        var x1 = xLabels[0];
        var y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
        var x2 = xLabels[xLabels.length - 1];
        var y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
        var trendData = [[x1,y1,x2,y2]];
        
        var trendline = svg2.selectAll(".trendline." + sex)
          .data(trendData);
          
        trendline.enter()
          .append("line")
          .attr("class", "trendline " + sex)
          .attr("x1", function(d) { return xScale2(d[0]); })
          .attr("y1", function(d) { return yScale2(d[1]); })
          .attr("x2", function(d) { return xScale2(d[2]); })
          .attr("y2", function(d) { return yScale2(d[3]); })
          .attr("stroke", "black")
          .attr("stroke-width", 1);
      })
    })
  } else {
    toggleStraightLine = !toggleStraightLine;
    d3.selectAll('.trendline')
      .remove();
  }
}

// returns slope, intercept and r-square of the line
var leastSquares = function(xSeries, ySeries) {
  var reduceSumFunc = function(prev, cur) { return prev + cur; };
  
  var xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
  var yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;

  var ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
    .reduce(reduceSumFunc);
  
  var ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
    .reduce(reduceSumFunc);
    
  var ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
    .reduce(reduceSumFunc);
    
  var slope = ssXY / ssXX;
  var intercept = yBar - (xBar * slope);
  var rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
  
  return [slope, intercept, rSquare];
}

var both = function() {
  d3.queue()
    .defer(d3.csv, 'men.csv')
    .defer(d3.csv, 'women.csv')
    .await(function(error, ds1, ds2) {
      if (error) {
        console.log('Error with loading the cvs files', error);
      }

      var convertedDs1 = cleanData(ds1);
      var convertedDs2 = cleanData(ds2);

      // Updating domain for scales
      yScale2.domain(d3.extent(convertedDs1, function(d) { return d.Time }))
      xScale2.domain(d3.extent(convertedDs1, function(d) { return d.Year }))

      svg2.selectAll('circle')
          .data(convertedDs1)
          .enter()
          .append('circle')
          .attr('cx', function(d) { return xScale2(d.Year); })
          .attr('cy', function(d) { return yScale2(d.Time); })
          .attr('r', function(d) { return 3; })
          .attr('class', 'dpoint men')
          .on("mouseover", function(d) {
            showToolTip2(this, d);
          })
          .on("mouseout", function() {
            hideToolTip2();
          });
          
      svg2.selectAll('path')
          .data(convertedDs2)
          .enter()
          .append('path')
          .attr('d', d3.symbol().type(d3.symbols[1]))
          .attr('transform', function(d) {
            return 'translate(' + xScale2(d.Year) + ',' + yScale2(d.Time) + ')';
          })
          .attr('class', 'dpoint women')
          .on("mouseover", function(d) {
            showToolTip2(this, d);
          })
          .on("mouseout", function() {
            hideToolTip2();
          });

      if (initDrawing) {
        initDrawing = false;
        // Draw axis
        svg2.append("g")
        .attr("class", "axis2")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxis2);
    
        svg2.append("g")
          .attr("class", "axis y-axis2")
          .attr("transform", "translate(0,0)")
          .call(yAxis2);
      } else {
        // Update y-axis
        d3.select(".y-axis2")
          .transition()
          .duration(500)
          .call(yAxis2);
      }
    })
}

var maleOrFemale = function(self) {
  var csv = self.id + '.csv';
  d3.csv(csv, function(error, data){

    var sex;
    if (csv == 'men.csv') {
      sex = 'men';
    } else {
      sex = 'women';
    }

    var ds = cleanData(data);

    // Updating domain for scales
    yScale2.domain(d3.extent(ds, function(d) { return d.Time }))
    xScale2.domain(d3.extent(ds, function(d) { return d.Year }))

    var datapoint = svg2.selectAll('.dpoint').data(ds);

    datapoint.enter()
      .append('circle')
      .attr('cx', width2)
      .attr('cy', function(d) { return yScale2(d.Time); })
      .attr('r', function(d) { return 3; })
      .merge(datapoint)
      .transition()
      .duration(1000)
      .attr('cx', function(d) { return xScale2(d.Year); })
      .attr('cy', function(d) { return yScale2(d.Time); })
      .attr('r', function(d) { return 3; })
      .attr('class', 'dpoint ' + sex);

    datapoint
      .exit()
      .transition()
      .duration(500)
      .attr('cx', width2 + 50)
      .remove();

    // Update y-axis
    d3.select(".y-axis2")
      .transition()
      .duration(500)
      .call(yAxis2);
  });
}

d3.selectAll('button.viz-2')
  .on('click', function() {
    switch (this.id) {
      case 'both':
        activeDataset = ['men.csv', 'women.csv']
        both();
        break;
      case 'men': 
        activeDataset = ['men.csv']
        maleOrFemale(this);
        break;
      case 'women':
        activeDataset = ['women.csv']
        maleOrFemale(this);
        break;
      case 'path':
        drawPath();
        break;
      case 'fit':
        drawStraightLine();
        break;
    }
  })

// Draw both datasets as default
var activeDataset = ['men.csv', 'women.csv']
var initDrawing = true;
var togglePath = true;
var toggleStraightLine = true;
both();