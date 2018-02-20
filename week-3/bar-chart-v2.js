var datasetLenght = 20;
var maxValue = 25;
var datasetV2 = genRandomData(datasetLenght, maxValue);

var width = 600;
var height = 300;
var barPadding = 1;

var xScaleV2 = d3.scaleBand()
               .domain(d3.range(datasetV2.length))
               .rangeRound([0, width], 0.05)

var yScaleV2 = d3.scaleLinear()
               .domain([0, d3.max(datasetV2)])
               .range([0, 250])

// Add svg to DOM
var svgV2 = d3.select(".bar-chart-v2")
            .append("svg")
              .attr("width", width)
              .attr("height", height);

// Adding the bars
svgV2.selectAll("rect")
  .data(datasetV2)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScaleV2(i);
  })
  .attr("y", function(d){
    return height - yScaleV2(d);
  })
  .attr("width", width / datasetV2.length - barPadding)
  .attr("height", function(d) {
    return yScaleV2(d);
  })
  .attr("fill", function(d){
    return "rgb(0, 0, " + (d * 10) + ")";
  });

d3.select("#bar-chart-new-data")
  .on("click", function() {
    // Create new random ds
    datasetV2 = genRandomData(datasetV2.length, maxValue);

    // Updating scale domain for y-axis/scale
    // This is done so new data does not exceed the height of the svg
    yScaleV2.domain([0, d3.max(datasetV2)]);

    // Update all the rects
    d3.select(".bar-chart-v2")
      .selectAll("rect")
      .data(datasetV2)
      .transition()
      .duration(1000)
      .attr("y", function(d){
        return height - yScaleV2(d);
      })
      .attr("height", function(d) {
        return yScaleV2(d);
      })
      .attr("fill", function(d){
        return "rgb(0, 0, " + (d * 10) + ")";
      });
  });

d3.select("#bar-chart-remove-obs")
  .on("click", function() {
    // Remove first observation for ds
    datasetV2.shift()

    // Update input range of x-axis
    xScaleV2.domain(d3.range(datasetV2.length));

    // Grab update selection
    var bars = svgV2.selectAll("rect")
      .data(datasetV2);
  });

d3.select("#bar-chart-new-obs")
  .on("click", function() {
    // Create one new random value
    var newNumber = Math.floor(Math.random() * maxValue);

    // Add one observation to ds
    datasetV2.push(newNumber);

    // Update input range of x-axis
    xScaleV2.domain(d3.range(datasetV2.length));

    // Grab update selection
    var bars = svgV2.selectAll("rect")
      .data(datasetV2);

    // Width the reference to the bars selection, when we use .enter()
    // we only address the new DOM element, without touching all the exsisting
    // elements. #performance
    bars.enter()
        .append("rect")
        .attr("x", width)
        .attr("y", function(d){
          return height - yScaleV2(d);
        })
        .attr("width", width / datasetV2.length - barPadding)
        .attr("height", function(d) {
          return yScaleV2(d);
        })
        .attr("fill", function(d){
          return "rgb(0, 0, " + (d * 10) + ")";
        });

    // Some transition for the new added datapoint
    bars.transition()
        .duration(500)
        .attr("x", function(d, i) {
          return xScaleV2(i);
        })
        .attr("y", function(d) {
          return height - yScaleV2(d)
        })
        .attr("width", xScaleV2.bandwidth() - barPadding)
        .attr("height", function(d) {
          return yScaleV2(d);
        });
  });