d3.csv("data.csv", function(error, data){
  if (error) {
    console.log('Error with loading the cvs file', error);
  }

  console.log('Got the data');
  console.log(data);
  
  // Using slice to only get the first 5 elements
  data.slice(0, 5).forEach(function(dp){
    $('.data-from-csv ul').append('<li>' + dp.date + '</li>');
  })

})
