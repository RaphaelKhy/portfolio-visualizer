//Requires D3

var chartRequested = false;
var acceptedStocks = ['AAPL', 'BABA', 'SPY', 'TSLA']

$(window).on("resize", function () {
  if (chartRequested) {
    removeChart();
    paintChart();
  };
});

function paintChart() {
  containerWidth = document.getElementById('chartContainer').getBoundingClientRect().width
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 30 },
    width = (containerWidth * 0.9) - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  //Read the data
  csvPath2 = "data/tsla.csv"
  d3.csv(csvPath2,

    // When reading the csv, I must format variables:
    function (d) {
      return { date: d3.timeParse("%m/%d/%Y")(d.date), value: d.value }
    },

    // Now I can use this dataset:
    function (data) {

      // Add X axis --> it is a date format
      var x = d3.scaleTime()
        .domain(d3.extent(data, function (d) { return d.date; }))
        .range([0, width]);
      svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.value; })])
        .range([height, 0]);
      svg.append("g")
        .call(d3.axisLeft(y));

      // Add the line
      svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
          .x(function (d) { return x(d.date) })
          .y(function (d) { return y(d.value) }))
    })
}

function removeChart() {
  d3.select("svg").remove();
}

function chartButtonClick() {
  removeChart();
  paintChart();
  chartRequested = true;

  var percentSum = 0;
  var stockDict ={};

  $('div[id^="stock-row"]').each(function(index) {
    divRow = $(this)[0];
    tickerSymbol = $(divRow).children().eq(0).children().eq(0)[0].value;
    percentValue = parseInt($(divRow).children().eq(1).children().eq(0)[0].value);

    //pushes tickerSymbol and percentValue to Dictionary
    if (!isNaN(percentValue) && acceptedStocks.includes(tickerSymbol)){

      //Sum duplicate tickers percentages
      if(tickerSymbol in stockDict){
        percentSum = stockDict[tickerSymbol] + percentValue;
        console.log("duplicate found: " + tickerSymbol + "\nNew Sum: " + percentSum);
        stockDict[tickerSymbol] = percentSum;
      }
      else{
         stockDict[tickerSymbol] = percentValue;
      }
    }
     console.log(stockDict);
    if (!isNaN(percentValue)){
      percentSum += percentValue;
    }
    console.log(percentSum);
    if(percentSum === 100){
      console.log("percentSum is 100");
    }
  });

};