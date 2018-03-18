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
var nycSvg = d3.select('.nyc-geo')
               .append('svg')
               .attr('width', nycWidth)
               .attr('height', nycHeight);

//Load in boroughs map data
d3.json('boroughs.json', function(json) {

  //Drawing boroughs
  nycSvg.selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('d', nycPath)
        .style('fill', function(d, i) {
          return boroughsColors[i];
        })
        .style('stroke', 'white');

  //Writing borough names
  nycSvg.selectAll('text')
        .data(json.features)
        .enter()
        .append('text')
        .attr('transform', function (d) { return 'translate(' + nycPath.centroid(d) + ')'; })
        .attr('dx', '0')
        .attr('dy', '0.35em')
        .text(function (d) { return d.properties.BoroName; });

  //Load nyc_murders data
  d3.csv('nyc_murders.csv', function(data){

    //Adding donts for murders
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
          .style('opacity', 0.75);
  });
});
