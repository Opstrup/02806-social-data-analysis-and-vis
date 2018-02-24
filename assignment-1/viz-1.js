d3.select("#fresh-fruit").
  on("click", function() {
    d3.csv("fruts.csv", function(error, data){
      if (error) {
        console.log('Error with loading the cvs file', error);
      }
    
      var freshFruitsObj = data[0];
      delete freshFruitsObj.Index
      delete freshFruitsObj.Freshness
      delete freshFruitsObj.Category

      ds = Object.values(freshFruitsObj).map(function(x) { return Number(x)});

      var yScale = d3.scaleLinear()
                .domain([0, d3.max(ds, function(d) { 
                  return d; 
                })])
                .range([0, 250])

      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return height - yScale(d) - chartPadding;
        })
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("fill", function(d){
          return "rgb(0, 0, " + (d * 10) + ")";
        });
    })
  });

d3.select("#fresh-veg").
  on("click", function() {
    d3.csv("fruts.csv", function(error, data){
      if (error) {
        console.log('Error with loading the cvs file', error);
      }
    
      var freshVeg = data[2];
      delete freshVeg.Index
      delete freshVeg.Freshness
      delete freshVeg.Category

      ds = Object.values(freshVeg).map(function(x) { return Number(x)});
      var xScale = d3.scaleBand()
                .domain(d3.range(ds.length))
                .rangeRound([0, width], 0.05)

      var yScale = d3.scaleLinear()
                .domain([0, d3.max(ds, function(d) { 
                  return d; 
                })])
                .range([0, 250])

      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return height - yScale(d) - chartPadding;
        })
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("fill", function(d){
          return "rgb(0, 0, " + (d * 10) + ")";
        });
    })
  });

d3.select("#storage-fruit").
  on("click", function() {
    d3.csv("fruts.csv", function(error, data){
      if (error) {
        console.log('Error with loading the cvs file', error);
      }

      var storageFruits = data[1];
      delete storageFruits.Index
      delete storageFruits.Freshness
      delete storageFruits.Category
    
      ds = Object.values(storageFruits).map(function(x) { return Number(x)});
      var xScale = d3.scaleBand()
                .domain(d3.range(ds.length))
                .rangeRound([0, width], 0.05)

      var yScale = d3.scaleLinear()
                .domain([0, d3.max(ds, function(d) { 
                  return d; 
                })])
                .range([0, 250])
      
      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return height - yScale(d) - chartPadding;
        })
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("fill", function(d){
          return "rgb(0, 0, " + (d * 10) + ")";
        });
    })
  });

d3.select("#storage-veg").
  on("click", function() {
    d3.csv("fruts.csv", function(error, data){
      if (error) {
        console.log('Error with loading the cvs file', error);
      }
    
      var storageVeg = data[3];
      delete storageVeg.Index
      delete storageVeg.Freshness
      delete storageVeg.Category

      ds = Object.values(storageVeg).map(function(x) { return Number(x)});
      var xScale = d3.scaleBand()
                .domain(d3.range(ds.length))
                .rangeRound([0, width], 0.05)

      var yScale = d3.scaleLinear()
                .domain([0, d3.max(ds, function(d) { 
                  return d; 
                })])
                .range([0, 250])

      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return height - yScale(d) - chartPadding;
        })
        .attr("height", function(d) {
          return yScale(d);
        })
        .attr("fill", function(d){
          return "rgb(0, 0, " + (d * 10) + ")";
        });
    })
  });

var width = 600;
var height = 300;
var barPadding = 1;
var chartPadding = 20;

// Initial drawing of chart
d3.csv("fruts.csv", function(error, data){
  if (error) {
    console.log('Error with loading the cvs file', error);
  }

  var freshFruitsObj = data[0];
  delete freshFruitsObj.Index
  delete freshFruitsObj.Freshness
  delete freshFruitsObj.Category

  ds = Object.values(freshFruitsObj).map(function(x) { return Number(x)});

  var xScale = d3.scaleBand()
                .domain(d3.range(ds.length))
                .rangeRound([0, width], 0.1)

  var yScale = d3.scaleLinear()
                .domain([0, d3.max(ds, function(d) { 
                  return d; 
                })])
                .rangeRound([height - chartPadding, chartPadding])

  // Setting up axis
  var dateScale = d3.scaleTime()
                    .domain([new Date(2018, 0, 1), new Date(2018, 11, 31)])
                    .range([chartPadding, width - chartPadding]);

  var xAxis = d3.axisBottom()
                .scale(dateScale)
                .tickFormat(d3.timeFormat("%b"));

  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(5);

  // Add svg to DOM
  var svg = d3.select("#viz-1")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  // Adding the bars
  svg.selectAll("rect")
    .data(ds)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return xScale(i);
    })
    .attr("y", function(d){
      return yScale(d) - chartPadding;
    })
    .attr("width", width / ds.length - barPadding)
    .attr("height", function(d) {
      return height - yScale(d);
    })
    .attr("fill", function(d){
      return "rgb(0, 0, " + (d * 10) + ")";
    });

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - chartPadding) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(" + chartPadding + ", 0)")
    .call(yAxis);
});