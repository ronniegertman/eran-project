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
      type: 'bar',

      // The data for our dataset
      data: {
          labels,
          datasets: [{
              label: 'מצב הרוח שלי היום',
              backgroundColor: function(context){
                const index = context.dataIndex;
                const value = context.dataset.data[index];
                if(value <= 3){
                  return 'rgba(232, 44, 44, 1)'
                } else if(value > 3 && value < 6){
                  return 'rgba(251, 197, 172, 1)'
                }else{
                  return 'rgba(202, 240, 143, 1)'
                }
              },
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
    }, scales:{
      yAxis: {
        max: 7,
        ticks: {
          // Include a dollar sign in the ticks
          callback: function(value, index, ticks) {
              let dict = { 0: 'אני במצוקה', 1: 'זוועה', 2: "על הפנים", 3: 'לא משהו', 4: 'בסדר', 5: 'סבבה', 6: 'מעולה'}
              return dict[value]
          }
        }
      }
    }}
  });


}).catch(e => {
  console.log(e)
})

