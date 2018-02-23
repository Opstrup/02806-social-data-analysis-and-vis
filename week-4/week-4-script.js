var dataset = [5, 10, 20, 45, 6 , 25];
var pie = d3.pie();
var color = d3.scaleOrdinal(d3.schemeCategory10);
var pieDataset = pie(dataset);

var h = 300;
var w = 300;

var outerRadius = w / 2;
var innerRadius = 0;
var arc = d3.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

var svg = d3.select(".pie-chart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);

// Setting up groups for each arc
var arcs = svg.selectAll("g.arc")
              .data(pieDataset)
              .enter()
              .append("g")
              .attr("class", "arc")
              .attr("transform", "translate(" + outerRadius + ", " + outerRadius + ")");

// Drawing each arc path
arcs.append("path")
    .attr("fill", function(d, i) {
      return color(i);
    })
    .attr("d", arc);

// Add labels
arcs.append("text")
    .attr("transform", function(d) {
      return "translate(" + arc.centroid(d) + ")";
    })
    .attr("text-anchor", "middle")
    .attr("fill", "white")
    .text(function(d) {
      return d.value;
    });