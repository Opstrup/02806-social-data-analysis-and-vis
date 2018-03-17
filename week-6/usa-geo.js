//Width and height
var w = 700;
var h = 500;

//Define map projection
var projection = d3.geoAlbersUsa()
                   .translate([w/2, h/2])
                   .scale([900]);

//Define default path generator
var path = d3.geoPath()
             .projection(projection)

//Define quantize scale to sort data values into buckets of color
var color = d3.scaleQuantize()
              .range(colorbrewer.YlGn[5]); // Colors taken from colorbrewer.js

//Create SVG element
var svg = d3.select(".geo-path")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

//Load in agriculture data
d3.csv("us-ag-productivity-2004.csv", function(data) {

  //Set input domain for color scale
  color.domain([
    d3.min(data, function(d) { return d.value; }),
    d3.max(data, function(d) { return d.value; })
  ]);

  //Load in GeoJSON data
  d3.json('us-states.json', function(json) {

    //Merge the ag. data and GeoJSON
    //Loop through once for each ag. data value
    for (var i = 0; i < data.length; i++) {
      //Grab state name
      var dataState = data[i].state;
      //Grab data value, and convert from string to float
      var dataValue = parseFloat(data[i].value);
      //Find the corresponding state inside the GeoJSON
      for (var j = 0; j < json.features.length; j++) {
        var jsonState = json.features[j].properties.name;
        if (dataState == jsonState) {
          //Copy the data value into the JSON
          json.features[j].properties.value = dataValue;
          //Stop looking through the JSON
          break;
        }
      }
    }

    //Bind data and create one path per GeoJSON feature
    svg.selectAll('path')
      .data(json.features)
      .enter()
      .append('path')
      .attr('d', path)
      .style("fill", function(d) {
        return (d.properties.value) ? color(d.properties.value) : '#ccc';
      })
      .style("stroke", "white");

    //Load in cities data
    d3.csv("us-cities.csv", function(data) {
      svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
          return Math.sqrt(parseInt(d.population) * 0.00004);
        })
        .style("fill", "yellow")
        .style("opacity", 0.75);
    });
  });
});