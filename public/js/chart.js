fetch('/emotionRates').then(respone => {
  return respone.json()
}).then(jsonArray => {
  // creating the date labels
  let labels = []
  for(let i = 0; i < jsonArray.length; i++){
    labels.push(jsonArray[i].date)
  }

  
  //creating the data array
  let dataArray = []
  for(let i = 0; i< jsonArray.length; i++){
    dataArray.push(jsonArray[i].rate)
  }


  //creating the chart
  var ctx = document.getElementById('myChart').getContext('2d');
  var chart = new Chart(ctx, {
      // The type of chart we want to create
      type: 'line',

      // The data for our dataset
      data: {
          labels,
          datasets: [{
              label: 'How I am generally feeling',
              backgroundColor: 'rgb(255, 99, 132)',
              borderColor: 'rgb(255, 99, 132)',
              data: dataArray,
          }]
      },

      // Configuration options go here
      options: { tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
            label: function(tooltipItems, data) { 
                // return tooltipItems.yLabel + ' : ' + tooltipItems.xLabel + " Files";
                console.log(tooltipItems)
                console.log(data)
                return 'Hello world'
            }
        }
    }}
  });


}).catch(e => {
  console.log(e)
})

