var datasetLenght = 20;
var maxValue = 25;
var datasetV2 = genRandomKeyMappedData(datasetLenght, maxValue);

var width = 600;
var height = 300;
var barPadding = 1;

var xScaleV2 = d3.scaleBand()
               .domain(d3.range(datasetV2.length))
               .rangeRound([0, width], 0.05)

var yScaleV2 = d3.scaleLinear()
               .domain([0, d3.max(datasetV2, function(d) { return d.value; })])
               .range([0, 250])

// Key function to get the keys out of the data
var key = function(d) { return d.key; };

// Add svg to DOM
var svgV2 = d3.select(".bar-chart-v2")
            .append("svg")
              .attr("width", width)
              .attr("height", height);

// Adding the bars
svgV2.selectAll("rect")
  .data(datasetV2, key)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScaleV2(i);
  })
  .attr("y", function(d){
    return height - yScaleV2(d.value);
  })
  .attr("width", width / datasetV2.length - barPadding)
  .attr("height", function(d) {
    return yScaleV2(d.value);
  })
  .attr("fill", function(d){
    return "rgb(0, 0, " + (d.value * 10) + ")";
  })
  .on("mouseover", function(d) {
    showToolTip(this, d);
  })
  .on("mouseout", function() {
    hideToolTip();
  });

// Create new random observations
d3.select("#bar-chart-new-data")
  .on("click", function() {
    // Create new random ds
    datasetV2 = genRandomKeyMappedData(datasetV2.length, maxValue);

    // Updating scale domain for y-axis/scale
    // This is done so new data does not exceed the height of the svg
    yScaleV2.domain([0, d3.max(datasetV2, function(d) { return d.value; })]);

    // Update all the rects
    d3.select(".bar-chart-v2")
      .selectAll("rect")
      .data(datasetV2, key)
      .transition()
      .duration(1000)
      .attr("y", function(d){
        return height - yScaleV2(d.value);
      })
      .attr("height", function(d) {
        return yScaleV2(d.value);
      })
      .attr("fill", function(d){
        return "rgb(0, 0, " + (d.value * 10) + ")";
      });
  });

// Remove observation
d3.select("#bar-chart-remove-obs")
  .on("click", function() {
    // Remove first observation for ds
    datasetV2.shift()

    // Update input range of x-axis
    xScaleV2.domain(d3.range(datasetV2.length));

    // Grab update selection
    var bars = svgV2.selectAll("rect")
      .data(datasetV2, key);

    // Exit the chart
    bars.exit()
        .transition()
        .duration(500)
        .attr("x", -xScaleV2.bandwidth())
        .remove();

    d3.select("#bar-chart-new-obs")
      .selectAll("rect")
      .data(datasetV2, key)
      .enter()
      .append("rect")
      .attr("x", function(d, i) {
        return xScaleV2(i);
      })
      .attr("width", width / datasetV2.length - barPadding)
  });

// Add random observation
d3.select("#bar-chart-new-obs")
  .on("click", function() {
    // Create one new random key mapped value
    var newRandomKeyMappedValue = { 'key': (dataset[dataset.length - 1].key + 1) }
    newRandomKeyMappedValue.value = Math.floor(Math.random() * maxValue) + 1;

    // Add the observation to ds
    datasetV2.push(newRandomKeyMappedValue);

    // Update input range of x-axis
    xScaleV2.domain(d3.range(datasetV2.length));

    // Grab update selection
    var bars = svgV2.selectAll("rect")
      .data(datasetV2, key);

    // Width the reference to the bars selection, when we use .enter()
    // we only address the new DOM element, without touching all the exsisting
    // elements. #performance
    bars.enter()
        .append("rect")
        .attr("x", width)
        .attr("y", function(d){
          return height - yScaleV2(d.value);
        })
        .attr("width", width / datasetV2.length - barPadding)
        .attr("height", function(d) {
          return yScaleV2(d.value);
        })
        .attr("fill", function(d){
          return "rgb(0, 0, " + (d.value * 10) + ")";
        });

    // Some transition for the new added datapoint
    bars.transition()
        .duration(500)
        .attr("x", function(d, i) {
          return xScaleV2(i);
        })
        .attr("y", function(d) {
          return height - yScaleV2(d.value)
        })
        .attr("width", xScaleV2.bandwidth() - barPadding)
        .attr("height", function(d) {
          return yScaleV2(d.value);
        });
  });

d3.select("#sort-data")
  .on("click", function() {
    sortBars();
  });

var sortOrder = false;

var sortBars = function() {

  //Flip value of sortOrder
  sortOrder = !sortOrder;

  svgV2.selectAll("rect")
       .sort(function(a, b) {
         return (sortOrder) ? d3.ascending(a.value, b.value) : d3.descending(a.value, b.value);
       })
       .transition()
       .duration(1000)
       .attr("x", function(d, i) {
         return xScaleV2(i);
       });
}

var showToolTip = function(self, d) {
  var xPos = parseFloat(d3.select(self).attr("x")) + xScaleV2.bandwidth() / 2;
  var yPos = parseFloat(d3.select(self).attr("y")) / 2 + height / 2;

  d3.select("#tooltip")
    .style("left", xPos + "px")
    .style("top", yPos + "px")
    .select("#value")
    .text(d.value);

  d3.select("#tooltip").classed("invisible", false);
}

var hideToolTip = function() {
  d3.select("#tooltip").classed("invisible", true);
}