var barData = [30, 86, 168, 281, 303, 365];

d3.select(".simple-bar-chart")
  .selectAll("div")
    .data(barData)
  .enter().append("div")
    .style("width", function(d) { return d + "px"; })
    .text(function(d) { return d; });

console.log('Creating simple bar chart', barData);

d3.select("body")
  .append("p")
  .text("Hello there!")