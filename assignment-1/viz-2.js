var margin = {top: 20, right:20, bottom: 50, left: 30};
var height2 = 500 - margin.top - margin.bottom;
var width2 = 800 - margin.right - margin.left;

var svg2 = d3.select("#viz-2")
            .append("svg")
            .attr("width", width2 + margin.left + margin.right)
            .attr("height", height2 + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

var both = function() {
  d3.queue()
    .defer(d3.csv, 'men.csv')
    .defer(d3.csv, 'women.csv')
    .await(function(error, ds1, ds2) {
      if (error) {
        console.log('Error with loading the cvs files', error);
      }

      var convertedDs1 = ds1
        .filter(function(x) { if (x.Time != "TBD") return x; })
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
  
      var convertedDs2 = ds2
        .filter(function(x) { if (x.Time != "TBD") return x; })
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
          .attr('class', 'dpoint men');
          
      svg2.selectAll('path')
          .data(convertedDs2)
          .enter()
          .append('path')
          .attr('d', d3.symbol().type(d3.symbols[1]))
          .attr('transform', function(d) {
            return 'translate(' + xScale2(d.Year) + ',' + yScale2(d.Time) + ')';
          })
          .attr('class', 'dpoint women');

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

    var ds = data
      .filter(function(x) { if (x.Time != "TBD") return x; })
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

d3.selectAll('button')
  .on('click', function() {
    if (this.id == 'both') {
      both();
    } else {
      maleOrFemale(this);
    }
  })

// Draw both datasets as default
var initDrawing = true;
both();