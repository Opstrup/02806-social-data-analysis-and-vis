//Width and height
var width = 900;
var height = 700;
var boroughsColors = colorbrewer.YlGnBu[5];
var barPadding = 15;
var chartPadding = 50;

var timelineChart = timeSeriesChart()
  .x(function (d) { return d.key; })
  .y(function (d) { return d.value; })
  .width(1000)
  .height(150);

//Date formatter function
//date example: 12/31/2015
var dateFmt = d3.timeParse('%m/%d/%Y');

//Define map projection
var projection = d3.geoMercator()
                   .center([-73.94, 40.70])
                   .scale(70000)
                   .translate([width/2, height/2]);

// Setting up scalers
var yScale = d3.scaleLinear()
               .rangeRound([height - chartPadding, chartPadding])

var xScale = d3.scaleBand()
               .rangeRound([chartPadding, width - chartPadding]);

// Setting up axis
var xAxis = d3.axisBottom()
              .scale(xScale);

var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(10);

//Define default path generator
var nycPath = d3.geoPath()
                .projection(projection);

//Create SVG element
var svg = d3.select('#boroughs')
               .append('svg')
               .attr('width', width)
               .attr('height', height);

//Load in boroughs map data
d3.json('boroughs.json', function(json) {

  //Drawing boroughs
  svg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', nycPath)
        .style('fill', function(d, i) {
          return boroughsColors[i];
        })
        .style('stroke', 'white');

  //Writing borough names
  svg.selectAll('text')
        .data(json.features)
        .enter()
        .append('text')
        .attr('transform', function (d) { return 'translate(' + nycPath.centroid(d) + ')'; })
        .style("text-anchor", "middle")
        .style("font-weight", "bold")
        .text(function (d) { return d.properties.BoroName; });

  //Load nyc_murders data
  d3.csv('nyc_murders.csv',
    function(d){
      d.RPT_DT = dateFmt(d.RPT_DT);
      return d;
    },
    function(data){

      var csData = crossfilter(data);
      csData.dimTime = csData.dimension(function (d) { return d.RPT_DT })
      csData.dimCoord = csData.dimension(function (d) { return [d.Longitude, d.Latitude] })
      csData.timeDate = csData.dimTime.group(d3.timeHour);

      timelineChart.onBrushed(function (selected) {
        csData.dimTime.filter(selected);
        update();
      });

      function update() {
        //Trying to remove old dots
        d3.select('#boroughs').selectAll('circle').remove()
        //Adding dots for murders
        svg.selectAll('circle')
              .data(csData.dimCoord.top(Infinity))
              .enter()
              .append('circle')
              .attr('cx', function(d) {
                return projection([d.Longitude, d.Latitude])[0];
              })
              .attr('cy', function(d) {
                return projection([d.Longitude, d.Latitude])[1];
              })
              .attr('r', '3')
              .style('fill', 'red')
              .style('opacity', 0.75);
  
        //Adding timeline
        d3.select('#timeline')
          .datum(csData.timeDate.all())
          .call(timelineChart);
      }

      update();
  });
});
