//Requires D3

var chartRequested = false;
var acceptedStocks = ['AAPL', 'BA', 'BABA', 'BAC', 'GLD', 'GME', 'IWM', 'QQQ', 'SLV', 'SPY', 'T', 'TSLA', 'XOM'];
var stockDict ={};

$(window).on("resize", function () {
  if (chartRequested) {
    removeChart();
    paintChart();
    paintChart();
  };
});

function chartButtonClick() {
  ValidateInputData();
  if(isInputValid){
    $('.toast').toast('hide');
    removeChart();
    removeChart();
    inputData = collectData();
    mainCalc(inputData);
    // console.log(storage);
    // paintChartTest();
    setTimeout(paintChart,200);
    chartRequested = true;
  };
  
};

function ValidateInputData(){
  inputChange();

  var totalPercent=0;

  $('div[id^="stockRow"]').each(function(){
    divRow = $(this)[0];
    stock = $(divRow).children().eq(0).children().eq(0)[0].value;
    percent = parseFloat($(divRow).children().eq(1).children().eq(0)[0].value);
    
    if(!isValidStock(stock)){    //test that each stock is valid
      console.log("Invalid stock");
      var toast = $('.toast-body')[0];
      toast.innerText = "Invalid Stock";
      $('.toast').toast('show');
      isInputValid = false;
      return false;
    }
    totalPercent += percent;
  });
  
  if(isInputValid===false){
    return;
  }else if(true && totalPercent!=100){    //test if total percent = 100
    var toast = $('.toast-body')[0];
    toast.innerText = "Total percent must be equal to 100";
    $('.toast').toast('show');
    isInputValid = false;
    return;
  }

  console.log("valid data: " + isInputValid);


};

function collectData(){

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

function paintChart(){
  containerWidth = document.getElementById('chartContainer').getBoundingClientRect().width
  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
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

  buildChart(storage[storage.length-1].data);

  function buildChart(data) {
    // console.log(data);
    // Add X axis --> it is a date format
    var x = d3.scaleTime()
      .domain(d3.extent(data, function (d) { return d.date; }))
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis

    // get minimum y value
    var minYValue = 0;
    for(var day = 0; day < data.length; day++){
      value = data[day].value;
      if(value < minYValue){
        minYValue = value;
      };
    };
    // console.log(data);
    // console.log(minYValue);
    var y = d3.scaleLinear()
      .domain([minYValue, d3.max(data, function (d) { return +d.value; })])
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
            "translate(" + (width/2) + " ," + 
                          (height + margin.top + 20) + ")")
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
      .text("% Return"); 
      
    };
}

function removeChart() {
  d3.select("svg").remove();
}

function paintChartTest() {
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