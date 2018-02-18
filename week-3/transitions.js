var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var width = 600;
var height = 300;
var barPadding = 1;

// Add svg to DOM
var svg = d3.select(".transition-bar-chart")
            .append("svg")
              .attr("width", width)
              .attr("height", height);

// Generates an array of numbers from 0-9
var myRange = d3.range(10)

// The domain is the "classes" for the plot. Here because we don't have
// any "classes", we just use an array with numbers from 0 - dataset.length
// The rangeRoundBands smooth out the width of each bar to have the 
// same width (think of flex-boxes). The second parameter (0.05), is
// spacing in between bars. 5% spacing.

var xScale = d3.scaleBand()
               .domain(d3.range(dataset.length))
               .rangeRound([0, width], 0.05)

var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset)])
               .range([0, 250])

// Adding the bars
svg.selectAll("rect")
  .data(dataset)
  .enter()
  .append("rect")
  .attr("x", function(d, i) {
    return xScale(i);
  })
  .attr("y", function(d){
    return height - yScale(d);
  })
  .attr("width", width / dataset.length - barPadding)
  .attr("height", function(d) {
    return yScale(d);
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

d3.select("#bar-chart-trigger")
  .on("click", function(){
    // dataset = [ 11, 12, 15, 20, 18, 17, 16, 18, 23, 25,
    //   5, 10, 13, 19, 21, 25, 22, 18, 15, 13 ];
    
    //New values for dataset
    var numValues = dataset.length; //Count original length of dataset
    dataset = []; //Initialize empty array
    for (var i = 0; i < numValues; i++) { //Loop numValues times
      var newNumber = Math.floor(Math.random() * 25); //New random integer (0-24)
      dataset.push(newNumber); //Add new number to array 
    }

    // updating scale domain for y-axis/scale
    // this is done so new data does not exceed the height of the svg
    yScale.domain([0, d3.max(dataset)]);

    // .each can be used to execute a transition or change and the beginning of
    // a transition or at the end of a transition. Here each bar gets the color
    // magenta before it gets updated and after it turns black.

    d3.select(".transition-bar-chart")
      .selectAll("rect")
       .data(dataset)
       .transition()
      //  .delay(600)
       .delay(function(d, i) {
         return i * 400;
       })
       .duration(1000)
      //  .each("start", function() {
      //    d3.select(this)
      //       .arrt("fill", "magenta");
      //  })
      //  .ease(d3.easeCircle)
       .attr("y", function(d){
        return height - yScale(d); 
       })
       .attr("height", function(d) {
        return yScale(d);
       })
      //  .each("end", function() {
      //   d3.select(this)
      //   .arrt("fill", "black");
      //  })
       .attr("fill", function(d){
        return "rgb(0, 0, " + (d * 10) + ")";
       });

      svg.selectAll("text")
         .data(dataset)
         .text(function(d) {
           return d;
         })
         .attr("x", function(d, i) {
           return xScale(i) + xScale.bandwidth() / 2;
         })
         .attr("y", function(d) {
           return height - yScale(d) + 14;
         });
  });