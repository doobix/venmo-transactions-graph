var url = '/json';
var chart;

$.get(url, function(json) {
  var data = formatJSON(json);
  chart = c3.generate({
    data: {
      json: data,
      x: 'date',
      keys: {
        x: 'date',
        value: ['transactions']
      },
      type: 'bar'
    },
    axis: {
      x: {
        type: 'timeseries',
        tick: {
          format: '%Y-%m'
        }
      },
      y: {
        label: 'Transactions'
      }
    }
  });
});

function formatJSON(data) {
  var data = JSON.parse(data);
  var graphData = [];
  var dateReg = /\d\d\d\d-\d\d/;
  // Set up first month
  var currentDate = dateReg.exec(data.data[0].date_created)[0]+'-01';
  var transactions = 1;
  for (var i=1; i < data.data.length; i++) {
    var date = dateReg.exec(data.data[i].date_created)[0]+'-01';
    if (date === currentDate) {
      // Count transactions for the current month
      transactions++;
    } else {
      // Push data into array
      graphData.push({
        date: currentDate,
        transactions: transactions
      });

      // Set up next month and new transaction
      currentDate = date;
      transactions = 1;
    }
  }
  // Push the last month to array
  graphData.push({
    date: currentDate,
    transactions: transactions
  });
  return graphData.reverse();
}
