var chartRequested = false;
const acceptedStocks = ['AAPL', 'BA', 'BABA', 'BAC', 'GLD', 'GME', 'IWM', 'QQQ', 'SLV', 'SPY', 'T', 'TSLA', 'XOM'];

$(window).on("resize", function () {
  if (chartRequested) {
    removeChart();
    displayChart();
  };
});

async function chartButtonClick() {
  ValidateInputData();
  if(isInputValid){
    await  removeChart();
    inputData = collectData();
    await mainCalc(inputData);
    displayChart();
    chartRequested = true;
  };
};

function ValidateInputData(){//additional input validation when plot chart button clicked
  inputChange();
  var totalPercent=0;
  if(!isInputValid){
    return;
  }else{
    $('div[id^="stockRow"]').each(function() {
      divRow = $(this)[0];
      stock = $(divRow).children().eq(0).children().eq(0)[0].value.toUpperCase();
      percent = parseFloat($(divRow).children().eq(1).children().eq(0)[0].value);

      if(isNaN(percent) || stock ===''){
        displayToast("Invalid Input");
        isInputValid = false;
        return;
      }else{
        totalPercent+=percent;
      }

    });
    if(totalPercent!=100 && isInputValid){//test if total percent = 100
      displayToast("Total percent must be equal to 100");
      isInputValid = false;
    }
  }
};

function collectData(){ //collects user input after validation

  var data = [];

  $('div[id^="stockRow"]').each(function(){
    divRow = $(this)[0];
    stock = $(divRow).children().eq(0).children().eq(0)[0].value;
    percent = parseFloat($(divRow).children().eq(1).children().eq(0)[0].value);
    
    var rowDict = {};
    rowDict.stock = stock;
    rowDict.percentAllocation = percent;
    data.push(rowDict);

  });
  return data;
  

}

function displayChart(){ //builds and shows chart
  containerWidth = document.getElementById('chartContainer').getBoundingClientRect().width; //get width from container
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 40, bottom: 30, left: 60 },
    width = (containerWidth) - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")");

  buildChart(storage[storage.length-1].data);

  function buildChart(data) {
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.date; }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("id", "svg-elem")
      .call(d3.axisBottom(x));
    
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([getMinYValue(), d3.max(data, function (d) { return +d.value; })])
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

    
    // Add the x Axis
    svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

    // text label for the x axis
    svg.append("text")             
      .attr("transform",
            "translate(" + (width/2) + " ," + (height + margin.top + 20) + ")")
      .style("text-anchor", "middle")
      .text("Date");

    // Add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

    // text label for the y axis
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Percent Return"); 
    };
}

async function removeChart() { //deletes chart
  await d3.select("svg").remove();
}

function testDisplayChart() { //display chart for testing
  containerWidth = document.getElementById('chartContainer').getBoundingClientRect().width; //get width of container
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
  csvPath2 = "data/test.csv"
  d3.csv(csvPath2,

    // When reading the csv, I must format variables:
    function (d) {
      // console.log(d);
      var g = { date: d3.timeParse("%m/%d/%Y")(d.date), value: d.value };
      // console.log(g);
      return g;
    },

    // Now I can use this dataset:
    function (data) {
      // console.log(data);
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

function getMinYValue(){ //gets minimum percent return from mergeStocks stock data
  var minYValue = 0;
  data = storage[storage.length-1].data;
  for(var day = 0; day < data.length; day++){
    value = data[day].value;
    if(value < minYValue){
      minYValue = value;
    };
  };
  return minYValue;
}