//Width and height
var nycWidth = 900;
var nycHeight = 700;
var boroughsColors = colorbrewer.YlGn[5];

//Define map projection
var nycProjection = d3.geoMercator()
                      .center([-73.94, 40.70])
                      .scale(70000)
                      .translate([nycWidth/2, nycHeight/2]);

//Define default path generator
var nycPath = d3.geoPath()
                .projection(nycProjection);

//Create SVG element
var nycSvg = d3.select(".nyc-geo")
               .append("svg")
               .attr("width", nycWidth)
               .attr("height", nycHeight);

//Load in boroughs map data
d3.json("boroughs.json", function(json) {

  nycSvg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', nycPath)
        .style("fill", function(d, i) {
          return boroughsColors[i];
        })
        .style("stroke", "white");

  //Load nyc_murders data
  d3.csv('nyc_murders.csv', function(data){

    nycSvg.selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', function(d) {
            return nycProjection([d.Longitude, d.Latitude])[0];
          })
          .attr('cy', function(d) {
            return nycProjection([d.Longitude, d.Latitude])[1];
          })
          .attr('r', '3')
          .style('fill', 'red')
          .style("opacity", 0.75);
  });
});
