var ds = [
  { apples: 5, oranges: 10, grapes: 22 },
  { apples: 4, oranges: 12, grapes: 28 },
  { apples: 2, oranges: 19, grapes: 32 },
  { apples: 7, oranges: 23, grapes: 35 },
  { apples: 23, oranges: 17, grapes: 43 },
];

/** 
 * Preparing the dataset
 */
var stack = d3.stack()
              .keys(["apples", "oranges", "grapes"]);

var stackedDs = stack(ds);

var stackedH = 500;
var stackedW = 400;
var padding = 40;
var color = d3.scaleOrdinal(d3.schemeCategory10);

/** 
 * Setting up scales
 */
var xScale = d3.scaleBand()
               .domain(d3.range(ds.length))
               .rangeRound([padding, stackedW - padding], 0.5);

var yScale = d3.scaleLinear()
               .domain([0, d3.max(stackedDs, function(d) { 
                    return d3.max(d, function(d) {
                      return d[0] + d[1];
                    }); 
                  })
                ])
                .rangeRound([ stackedH - padding, padding ]);

/**
 * Setting up axis
 */
var xAxis = d3.axisBottom()
              .scale(xScale);

var yAxis = d3.axisLeft()
              .scale(yScale)
              .ticks(5);

/**
 * Creating the svg element
 */
var stackedSvg = d3.select(".stacked-bar")
            .append("svg")
            .attr("width", stackedW)
            .attr("height", stackedH);

/**
 * Making groups for each category
 */
var groups = stackedSvg.selectAll("g")
                       .data(stackedDs)
                       .enter()
                       .append("g")
                       .style("fill", function(d, i) {
                         return color(i);
                       });

/**
 * Drawing each rect
 */
var rects = groups.selectAll("rect")
                  .data(function(d) { return d; })
                  .enter()
                  .append("rect")
                  .attr("x", function(d, i) {
                    return xScale(i);
                  })
                  .attr("y", function(d) {
                    return stackedH - yScale(d[0]);
                  })
                  .attr("height", function(d) {
                    return yScale(d[1]) - padding;
                  })
                  .attr("width", xScale.bandwidth() - 5);

/**
 * Drawing axis
 */
stackedSvg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + (stackedH - padding) + ")")
          .call(xAxis);

stackedSvg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(" + padding + ", 0)")
          .call(yAxis);