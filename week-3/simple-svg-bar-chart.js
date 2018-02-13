var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 
               13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var width = 600;
var height = 300;
var barPadding = 1;

// var margin = {top: 30, right: 20, bottom: 30, left: 50},
// width = w - margin.left - margin.right,
// height = h - margin.top - margin.bottom;

// Add svg to DOM
var svg = d3.select(".bar-chart")
            .append("svg")
              .attr("width", width)
              .attr("height", height);

// Adding the bars
svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
    .attr("x", function(d, i) {
      return i * (width / dataset.length);
    })
    .attr("y", function(d){
      return height - d;
    })
    .attr("width", width / dataset.length - barPadding)
    .attr("height", function(d) {
      return d;
    })
    .attr("fill", function(d){
      return "rgb(0, 0, " + (d * 10) + ")";
    });

// Adding labels
svg.selectAll("text")
   .data(dataset)
   .enter()
   .append("text")
   .text(function(d) {
     return d;
   })
   .attr("x", function(d, i) {
     return i * (width / dataset.length) + (width / dataset.length - barPadding) / 2;
   })
   .attr("y", function(d) {
     return height - d + 14;
   })
   .attr("fill", "white")
   .attr("font-family", "sans-serif")
   .attr("font-size", "11px")
   .attr("text-anchor", "middle")
