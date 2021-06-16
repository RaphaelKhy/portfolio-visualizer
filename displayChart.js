//Requires Chart.js and Moment.js

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: chartDateLabels,
    datasets: [{
      label: '# of Votes',
      data: chartPriceData,
      borderWidth: 1
    }]
  },
  options: {}
});

var selected_stocks = []
var chartPriceData = []
var chartDateLabels = [];

function formatDate(date){
    var timestamp = Date.parse(date);
    var dateObject = new Date(timestamp);
    var formattedDateObject = moment(dateObject).format('YYYY-MM-DD');
    console.log(formattedDateObject);
    return(formattedDateObject);
};

function updateSelectedStocks() {
    var stock;
    selected_stocks = []
    $(".stock_input").each(function () {
        stock = $(this).val()
        if (selected_stocks.indexOf(stock) === -1) {
            selected_stocks.push(stock);
        };
    });
    parseCSV();
};

function parseCSV() {
    $.get("tsla.csv", function (response) {
        var result = $.csv.toArrays(response);
        result.forEach(function (element, index) {
            var date = formatDate(element[0]);
            var price = parseFloat(element[1]);
            addChartData(myChart,date,price)
        });
    });
}

function addChartData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeChartData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}
