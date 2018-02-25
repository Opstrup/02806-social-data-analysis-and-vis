var margin = {top: 20, right:20, bottom: 50, left: 20};
var height2 = 500 - margin.top - margin.bottom;
var width2 = 800 - margin.right - margin.left;

var svg2 = d3.select("#viz-2")
            .append("svg")
            .attr("width", width2 + margin.left + margin.right)
            .attr("height", height2 + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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

    // Setting up scalers
    var yScale2 = d3.scaleLinear()
                    .domain(d3.extent(convertedDs1, function(d) { return d.Time }))
                   .rangeRound([height2, 0])

    var xScale2 = d3.scaleLinear()
                  .domain(d3.extent(convertedDs1, function(d) { return d.Year }))
                  .rangeRound([0, width2]);

    // Setting up axis
    var xAxis2 = d3.axisBottom()
                  .scale(xScale2);

    var yAxis2 = d3.axisLeft()
                .scale(yScale2)
                .ticks(10);

    svg2.selectAll('.dpoint')
        .data(convertedDs1)
        .enter()
        .append('circle')
        .attr('cx', function(d) { return xScale2(d.Year); })
        .attr('cy', function(d) { return yScale2(d.Time); })
        .attr('r', function(d) { return 2; })
        .style('fill', '#ed4630')
        
    svg2.selectAll('.dpoint')
        .data(convertedDs2)
        .enter()
        .append('path')
        .attr('d', d3.symbol().type(d3.symbols[1]))
        .attr('transform', function(d) {
          return 'translate(' + xScale2(d.Year) + ',' + yScale2(d.Time) + ')';
        })
        .style('fill', '#438e17')

    svg2.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + height2 + ")")
    .call(xAxis2);

    svg2.append("g")
      .attr("class", "axis y-axis")
      .attr("transform", "translate(0,0)")
      .call(yAxis2);
  })