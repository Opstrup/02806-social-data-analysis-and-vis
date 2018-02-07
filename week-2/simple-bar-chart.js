var barData = [
  {name: "Locke",    value:  4},
  {name: "Reyes",    value:  8},
  {name: "Ford",     value: 15},
  {name: "Jarrah",   value: 16},
  {name: "Shephard", value: 23},
  {name: "Kwon",     value: 42}
];

// Scaling the bar to between 0 and 420
var x = d3.scaleLinear()
    .domain([0, d3.max(barData)])
    .range([0, 420]);

d3.select(".simple-bar-chart")
  .selectAll("div")
    .data(barData)
  .enter().append("div")
    .style("width", function(d) {
      console.log(x(d.value));
      return (d.value * 10) + "px"; 
    })
    .text(function(d) { return d.name; });
