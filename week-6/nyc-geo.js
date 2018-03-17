//Width and height
var nycWidth = 700;
var nycHeight = 500;

//Define map projection
var nycProjection = d3.geoMercator()
                      .center([-73.94, 40.70])
                      .scale(50000)
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
        .style("fill", "steelblue")
        .style("stroke", "white");

});
