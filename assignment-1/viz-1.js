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
                     .rangeRound([height - chartPadding, chartPadding])

      var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(10);

      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return yScale(d);
        })
        .attr("height", function(d) {
          return height - yScale(d) - chartPadding;
        })
        .attr("fill", "#ed4630");

      // Update y-axis
      d3.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);
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

      var yScale = d3.scaleLinear()
                     .domain([0, d3.max(ds, function(d) { 
                       return d; 
                     })])
                     .rangeRound([height - chartPadding, chartPadding])

      var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(10);

      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return yScale(d);
        })
        .attr("height", function(d) {
          return height - yScale(d) - chartPadding;
        })
        .attr("fill", "#438e17");

      // Update y-axis
      d3.select(".y-axis")
      .transition()
      .duration(500)
      .call(yAxis);
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

      var yScale = d3.scaleLinear()
                     .domain([0, d3.max(ds, function(d) { 
                       return d; 
                     })])
                     .rangeRound([height - chartPadding, chartPadding])

      var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(10);

      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return yScale(d);
        })
        .attr("height", function(d) {
          return height - yScale(d) - chartPadding;
        })
        .attr("fill", "#f39ca0");

      // Update y-axis
      d3.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);
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

      var yScale = d3.scaleLinear()
                     .domain([0, d3.max(ds, function(d) { 
                       return d; 
                     })])
                     .rangeRound([height - chartPadding, chartPadding])

      var yAxis = d3.axisLeft()
                    .scale(yScale)
                    .ticks(10);

      // Update all the rects
      d3.select("#viz-1")
        .selectAll("rect")
        .data(ds)
        .transition()
        .duration(1000)
        .attr("y", function(d){
          return yScale(d);
        })
        .attr("height", function(d) {
          return height - yScale(d) - chartPadding;
        })
        .attr("fill", "#e0e8ca");

      // Update y-axis
      d3.select(".y-axis")
        .transition()
        .duration(500)
        .call(yAxis);
    })
  });

var width = 800;
var height = 500;
var barPadding = 15;
var chartPadding = 50;
var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
              'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// Initial drawing of chart
d3.csv("fruts.csv", function(error, data){
  if (error) {
    console.log('Error with loading the cvs file', error);
  }

  var initObj = data[0];
  delete initObj.Index
  delete initObj.Freshness
  delete initObj.Category

  ds = Object.values(initObj).map(function(x) { return Number(x)});

  // Setting up scalers
  var yScale = d3.scaleLinear()
                .domain([0, d3.max(ds, function(d) { 
                  return d; 
                })])
                .rangeRound([height - chartPadding, chartPadding])

  // Setting up axis
  var dScale = d3.scaleBand()
                 .domain(months)
                 .rangeRound([chartPadding, width - chartPadding]);

  var xAxis = d3.axisBottom()
                .scale(dScale);

  var yAxis = d3.axisLeft()
                .scale(yScale)
                .ticks(10);

  // gridlines in y axis function
  function make_y_gridlines() {
    return d3.axisLeft(yScale)
             .ticks(5);
  }

  // Add svg to DOM
  var svg = d3.select("#viz-1")
              .append("svg")
              .attr("width", width)
              .attr("height", height);

  // add the Y gridlines
  svg.append("g")
    .attr("class", "grid")
    .attr("transform", "translate(" + chartPadding + ", 0)")
    .call(make_y_gridlines()
      .tickSize(-(width - (chartPadding * 2)))
      .tickFormat(""))

  // Adding the bars
  svg.selectAll("rect")
    .data(ds)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {
      return dScale(months[i]) + (barPadding / 2);
    })
    .attr("y", function(d){
      return yScale(d);
    })
    .attr("height", function(d) {
      return height - yScale(d) - chartPadding;
    })
    .attr("width", width / ds.length - barPadding)
    .attr("fill", "#ed4630")
    .on("mouseover", function(d) {
      showToolTip(this, d);
    })
    .on("mouseout", function() {
      hideToolTip();
    });

  svg.append("g")
    .attr("class", "axis")
    .attr("transform", "translate(0," + (height - chartPadding) + ")")
    .call(xAxis);

  svg.append("g")
    .attr("class", "axis y-axis")
    .attr("transform", "translate(" + chartPadding + ", 0)")
    .transition()
    .duration(500)
    .call(yAxis);

  svg.append("text")
     .attr("transform", "translate(" + (width / 2) + ",15)")
     .style("text-anchor", "middle")
     .style("font-weight", "bold")
     .text("NYC Green Markets - Unique Produce Types");

  svg.append("text")
     .attr("transform", "translate(" + (width / 2) + "," + (height - 10) + ")")
     .style("text-anchor", "middle")
     .text("Months");

  svg.append("text")
     .attr("x", -(height / 2))
     .attr("y", 10)
     .attr("transform", "rotate(-90)")
     .style("text-anchor", "middle")
     .text("# of unique kinds of produce");

  // Tooltip functions
  var showToolTip = function(self, d) {
    var xPos = parseFloat(d3.select(self).attr("x")) + dScale.bandwidth() / 2;
    var yPos = parseFloat(d3.select(self).attr("y")) / 2 + height / 2;

    d3.select("#tooltip")
      .style("left", xPos + "px")
      .style("top", yPos + "px")
      .select("#value")
      .text(d);

    d3.select("#tooltip").classed("invisible", false);
  }

  var hideToolTip = function() {
    d3.select("#tooltip").classed("invisible", true);
  }
});
