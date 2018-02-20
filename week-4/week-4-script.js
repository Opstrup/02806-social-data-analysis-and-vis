// Scales
// Domain is input for scales and range is what range the output should be in
// between.
var dataset = [
  [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
  [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
 ];

var myScale = d3.scaleLinear()
                .domain([100, 500])
                .range([10, 350])

console.log('Input 100 to scaler', myScale(100))
console.log('Input 300 to scaler', myScale(300))
console.log('Input 500 to scaler', myScale(500))

// loops through the dataset and returns the max value of the dataset (x axis)
d3.max(dataset, function(d){ 
  return d[0]; 
})

d3.min(dataset, function(d){
  return d[0];
})

// The first element in each array in the dataset is the x value and the second
// is the y value

// Padding pushes all the elements inside the SVG so they don't get cut at the 
// edges
var padding = 20;

// Setting up x-axis scale
var xScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, function(d){ return d[0]; })])
               .range([padding, 350 - padding])

// Setting up y-axis scale
// Reversing the range for y-axis because the svg element has reversed values
// high y-values is low in the svg (not like a regular coordinate sys)
var yScale = d3.scaleLinear()
               .domain([0, d3.max(dataset, function(d){ return d[1]; })])
               .range([350 - padding, padding])


// Axis
// Axis can be Top, Left, Bottom and Right
var xAxis = d3.axisBottom(xScale).ticks(5);
var yAxis = d3.axisLeft(yScale).ticks(5);

// Use formatter to convert data to different formats
var myFormat = d3.format(".1%");
console.log('0.54321 formatted with myFormat is:', myFormat(0.54321));

