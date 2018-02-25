d3.selectAll('button.viz-1')
  .on('click', function() {
    var self = this.id;
    d3.csv("fruts.csv", function(error, data){
      if (error) {
        console.log('Error with loading the cvs file', error);
      }

      var dsObj, barColor, stack;
      var drawStacked = false;
      switch (self) {
        case 'fresh-fruit':
          dsObj = data[0];
          barColor = '#ed4630';
          break;
        case 'fresh-veg':
          dsObj = data[2];
          barColor = '#438e17';
          break;
        case 'storage-fruit':
          dsObj = data[1];
          barColor = '#f39ca0';
          break;
        case 'storage-veg':
          dsObj = data[3];
          barColor = '#e0e8ca';
          break;
        case 'stack':
          drawStacked = true;

          // prepare dataset
          dsObj = data.filter(function(x) {
            delete x.Index;
            delete x.Freshness;
            delete x.Category;
            return x;
          })
          .map(function(x) {
            return Object.values(x).map(function(y) { return Number(y) });
          });

          res = [];
          for (i = 0; i < dsObj[0].length; i++) {
            res.push({
              'Harvest fruits': dsObj[0][i],
              'Storage fruits': dsObj[1][i],
              'Harvest vegetables': dsObj[2][i],
              'Storage vegetables': dsObj[3][i]
            })
          }

          barColor = '#e0e8ca';

          stack = d3.stack()
                    .keys(['Harvest fruits', 'Storage fruits',
                           'Harvest vegetables', 'Storage vegetables']);
          ds = stack(res);
          break;
      }
      if (drawStacked) {
        console.log('Stack that shit!', ds);
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var yScale = d3.scaleLinear()
                  .domain([0, d3.max(ds, function(d) { 
                      return d3.max(d, function(d) {
                        return d[0] + d[1];
                      }); 
                    })
                  ])
                  .rangeRound([height - chartPadding, chartPadding]);

        d3.select('#viz-1 svg')
          .selectAll("g")
          .data(ds)
          .enter()
          .append("g")
          .style("fill", function(d, i) { return color(i); })
            .selectAll("rect")
            .data(function(d) { 
              // TODO: check d here and pass the correct value
              console.log(d);
              return d; })
            .enter()
            .append("rect")
            .attr("y", function(d) { return yScale(d[0]); })
            .attr("height", function(d) {
              return height - (yScale(d[0]) - yScale(d[1])) - padding;
            });

      } else {
        delete dsObj.Index;
        delete dsObj.Freshness;
        delete dsObj.Category;
  
        ds = Object.values(dsObj).map(function(x) { return Number(x) });
  
        var yScale = d3.scaleLinear()
                       .domain([0, d3.max(ds, function(d) { 
                         return d; 
                       })])
                       .rangeRound([height - chartPadding, chartPadding]);
  
        var yAxis = d3.axisLeft()
                      .scale(yScale)
                      .ticks(10);
  
        function make_y_gridlines() {
          return d3.axisLeft(yScale)
                    .ticks(5);
        }
  
        // Update Y gridlines
        d3.select(".grid")
          .transition()
          .duration(500)
          .call(make_y_gridlines()
            .tickSize(-(width - (chartPadding * 2)))
            .tickFormat(""))
  
        // Update all the rects
        d3.select("#viz-1")
          .selectAll("rect")
          .data(ds)
          .transition()
          .duration(1000)
          .attr("y", function(d){
            return yScale(d);
          })
          .attr("height", function(d) {
            return height - yScale(d) - chartPadding;
          })
          .attr("fill", barColor);
  
        // Update y-axis
        d3.select(".y-axis")
          .transition()
          .duration(500)
          .call(yAxis);
      }
    });
  });

var width = 800;
var height = 500;
var barPadding = 15;
var chartPadding = 50;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Initial drawing of chart
d3.csv("fruts.csv", function(error, data){
  if (error) {
    console.log('Error with loading the cvs file', error);
  }

  var initObj = data[0];
  delete initObj.Index
  delete initObj.Freshness
  delete initObj.Category

  ds = Object.values(initObj).map(function(x) { return Number(x) });

  // Setting up scalers
  var yScale = d3.scaleLinear()
                .domain([0, d3.max(ds, function(d) { 
                  return d; 
                })])
                .rangeRound([height - chartPadding, chartPadding])

  // Setting up axis
  var dScale = d3.scaleBand()
                 .domain(months)
                 .rangeRound([chartPadding, width - chartPadding]);

  var xAxis = d3.axisBottom()
                .scale(dScale);

  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10);

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale)
             .ticks(5);
  }

  // Add svg to DOM
  var svg = d3.select("#viz-1")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  // add the Y gridlines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + chartPadding + ", 0)")
    .call(make_y_gridlines()
      .tickSize(-(width - (chartPadding * 2)))
      .tickFormat(""))

  // Adding the bars
  svg.selectAll("rect")
    .data(ds)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return dScale(months[i]) + (barPadding / 2);
    })
    .attr("y", function(d){
      return yScale(d);
    })
    .attr("height", function(d) {
      return height - yScale(d) - chartPadding;
    })
    .attr("width", width / ds.length - barPadding)
    .attr("fill", "#ed4630")
    .on("mouseover", function(d) {
      showToolTip(this, d);
    })
    .on("mouseout", function() {
      hideToolTip();
    });

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - chartPadding) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + chartPadding + ", 0)")
    .transition()
    .duration(500)
    .call(yAxis);

  svg.append("text")
     .attr("transform", "translate(" + (width / 2) + ",15)")
     .style("text-anchor", "middle")
     .style("font-weight", "bold")
     .text("NYC Green Markets - Unique Produce Types");

  svg.append("text")
     .attr("transform", "translate(" + (width / 2) + "," + (height - 10) + ")")
     .style("text-anchor", "middle")
     .text("Months");

  svg.append("text")
     .attr("x", -(height / 2))
     .attr("y", 10)
     .attr("transform", "rotate(-90)")
     .style("text-anchor", "middle")
     .text("# of unique kinds of produce");

  // Tooltip functions
  var showToolTip = function(self, d) {
    var xPos = parseFloat(d3.select(self).attr("x")) + dScale.bandwidth() / 2;
    var yPos = parseFloat(d3.select(self).attr("y")) / 2 + height / 2;

    d3.select("#tooltip")
      .style("left", xPos + "px")
      .style("top", yPos + "px")
      .select("#value")
      .text(d);

    d3.select("#tooltip").classed("invisible", false);
  }

  var hideToolTip = function() {
    d3.select("#tooltip").classed("invisible", true);
  }
});
