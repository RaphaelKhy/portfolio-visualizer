var selectedTime = "Max Available"
var chartRequested = false;
var showAll = false;
const acceptedStocks = [
  "AAPL",
  "ABBV",
  "BA",
  "BABA",
  "BAC",
  "CAT",
  "DUK",
  "GLD",
  "GS",
  "IWM",
  "K",
  "MCD",
  "MMM",
  "QQQ",
  "SLV",
  "SPY",
  "T",
  "TSLA",
  "XOM",
];

$(window).on("resize", function () {
  if (chartRequested) {
    removeChart();
    adjustChartOnResize();
  }
});

async function chartButtonClick() {
  ValidateInputData();
  if (isInputValid) {

    //hide table to avoid screen jump
    hideInfoTable();

    await removeChart();
    inputData = collectData();
    await calculateReturn(inputData);
    if(darkMode === true){
      displayChartDarkMode();
    }else{
      displayChart();
    }
    //toggle settings only on first chart plot
    if(!chartRequested){
      console.log(chartRequested);
      document.getElementsByClassName("cv__table_toggle")[0].checked = true;
      document.getElementById("cv__show_chart_toggle").checked = true;
      showInfoTable();
      chartRequested = true;
    }

    //show table if table toggle is checked
    tableToggle();
  }
}

function ValidateInputData() {
  //additional input validation when plot chart button clicked
  inputChange();
  var stockList = [];
  var totalPercent = 0;
  if (!isInputValid) {
    return;
  } else {
    $('div[id^="stockRow"]').each(function () {
      divRow = $(this)[0];
      stock = $(divRow)
        .children()
        .eq(0)
        .children()
        .eq(0)[0]
        .value.toUpperCase();
      percent = parseFloat(
        $(divRow).children().eq(1).children()[0].children[0].value
      );

      if ((isNaN(percent) || stock === "") && isInputValid) {
        displayToast("Invalid Input");
        isInputValid = false;
        return;
      } else {
        totalPercent += percent;
      }

      //check if there are duplicate stocks
      if (stockList.includes(stock) && isInputValid) {
        displayToast("Duplicate Stock: " + stock);
        isInputValid = false;
        return;
      } else {
        stockList.push(stock);
      }
    });
    if (totalPercent != 100 && isInputValid) {
      //check if total percent = 100
      displayToast("Total percent must be equal to 100");
      isInputValid = false;
    }
  }
}

function collectData() {
  //collects user input after validation
  var data = [];

  $('div[id^="stockRow"]').each(function () {
    divRow = $(this)[0];
    stock = $(divRow).children().eq(0).children().eq(0)[0].value;
    percent = parseFloat($(divRow).children().eq(1).children()[0].children[0].value);

    var rowDict = {};
    rowDict.stock = stock;
    rowDict.percentAllocation = percent;
    data.push(rowDict);
  });
  return data;
}

async function removeChart() {
  //deletes chart
  await d3.select("svg").remove();
}

function getMinYValue() {
  //gets minimum percent return from mergeStocks stock data
  var minYValue = 0;
  data = storage[storage.length - 1].data;
  for (var day = 0; day < data.length; day++) {
    percentReturn = data[day].percentReturn;
    if (percentReturn < minYValue) {
      minYValue = percentReturn;
    }
  }
  return minYValue;
}

function displayChart() {
  var minYValue = storage.reduce((prev, curr) =>
    prev.minValue < curr.minValue ? prev : curr
  ).minValue;
  var maxYValue = storage.reduce((prev, curr) =>
    prev.maxValue > curr.maxValue ? prev : curr
  ).maxValue;

  chartWidth = Math.min(document.body.clientWidth * 0.99, 1000);

  inputHeight = document.getElementsByClassName("sv__ui_block")[0].clientHeight;
  scrollHeight = document.documentElement.scrollHeight;
  chartHeight = Math.min(chartWidth * 0.5, scrollHeight - inputHeight);

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 50, left: 60},
    axisWidth = chartWidth - margin.left - margin.right,
    chartWidth = chartWidth - margin.left - margin.right - 70,
    height = chartHeight - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", axisWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(storage[0].data, function (d) {
        return d.date;
      })
    )
    .range([0, chartWidth]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3.scaleLinear().domain([minYValue, maxYValue]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // color palette
  var stockList = [];
  for (var i = 0; i < storage.length - 1; i++) {
    stockList.push(storage[i].stock);
  }
  //add storage to beginning of stockList
  stockList.unshift(storage[storage.length - 1].stock);
  var color = d3
    .scaleOrdinal()
    .domain(stockList)
    .range([
      "#000000",
      "#0B84A5",
      "#F6C85F",
      "#9DD866",
      "#CA472F",
      "#8DDDD0",
      "#4F3D7A",
      "#FDAE61",
      "#F46D43",
      "#D53E4F",
      "#9E0142",
    ]);

  // Draw the line
  if (showAll === false) {
    svg
      .append("path")
      .datum(storage[storage.length - 1].data)
      .attr("fill", "none")
      .attr("stroke", "#000000")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.percentReturn);
          })
      );
  } else {
    svg
      .selectAll(".line")
      .data(storage)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d.stock);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(+d.percentReturn);
          })(d.data);
      });
  }

  //show chart if multiple stocks
  if (showAll === true) {
    //add the legend
    var stockLegend = svg
      .selectAll(".lineLegend")
      .data(stockList)
      .enter()
      .append("g")
      .attr("class", "lineLegend")
      .attr("transform", function (d, i) {
        return "translate(" + chartWidth + "," + i * 20 + ")";
      });

    stockLegend
      .append("text")
      .text(function (d) {
        return d;
      })
      .attr("transform", "translate(15,9)"); //align texts with boxes

    stockLegend
      .append("rect")
      .attr("fill", function (d, i) {
        return color(d);
      })
      .attr("width", 10)
      .attr("height", 10);
  }

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("% Return");
}

async function adjustChartOnResize() {
  if (chartRequested === true) {
    await removeChart();
    if(darkMode === true){
      displayChartDarkMode();
    }else{
      displayChart();
    }
  }
}

function allAssetToggle() {
  if (document.getElementsByClassName("cv__chart_toggle")[0].checked) {
    showAll = true;
    document.getElementById("cv__show_chart_toggle").checked = true;
  } else {
    showAll = false;
  }
  chartButtonClick();
}

function displayChartDarkMode() {
  var minYValue = storage.reduce((prev, curr) =>
    prev.minValue < curr.minValue ? prev : curr
  ).minValue;
  var maxYValue = storage.reduce((prev, curr) =>
    prev.maxValue > curr.maxValue ? prev : curr
  ).maxValue;

  documentWidth = Math.min(document.body.clientWidth * 0.99, 1000);

  inputHeight = document.getElementsByClassName("sv__ui_block")[0].clientHeight;

  documentHeight = document.documentElement.scrollHeight;
  chartHeight = Math.min(documentWidth * 0.5, documentHeight - inputHeight);

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 50, left: 60 },
    axisWidth = documentWidth - margin.left - margin.right,
    chartWidth = documentWidth - margin.left - margin.right - 70,
    height = chartHeight - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", axisWidth + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  var x = d3
    .scaleTime()
    .domain(
      d3.extent(storage[0].data, function (d) {
        return d.date;
      })
    )
    .range([0, chartWidth]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(5));

  // Add Y axis
  var y = d3.scaleLinear().domain([minYValue, maxYValue]).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // color palette
  var stockList = [];
  for (var i = 0; i < storage.length - 1; i++) {
    stockList.push(storage[i].stock);
  }
  //add storage to beginning of stockList
  stockList.unshift(storage[storage.length - 1].stock);
  var color = d3
    .scaleOrdinal()
    .domain(stockList)
    .range([
      "#FFFFFF",
      "#0B84A5",
      "#F6C85F",
      "#9DD866",
      "#CA472F",
      "#8DDDD0",
      "#4F3D7A",
      "#FDAE61",
      "#F46D43",
      "#D53E4F",
      "#9E0142",
    ]);

  // Draw the line
  if (showAll === false) {
    svg
      .append("path")
      .datum(storage[storage.length - 1].data)
      .attr("fill", "none")
      .attr("stroke", "#FFFFFF")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(d.percentReturn);
          })
      );
  } else {
    svg
      .selectAll(".line")
      .data(storage)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", function (d) {
        return color(d.stock);
      })
      .attr("stroke-width", 1.5)
      .attr("d", function (d) {
        return d3
          .line()
          .x(function (d) {
            return x(d.date);
          })
          .y(function (d) {
            return y(+d.percentReturn);
          })(d.data);
      });
  }

  //show chart if multiple stocks
  if (showAll === true) {
    //add the legend
    var stockLegend = svg
      .selectAll(".lineLegend")
      .data(stockList)
      .enter()
      .append("g")
      .style("fill", "white")
      .attr("class", "lineLegend")
      .attr("transform", function (d, i) {
        return "translate(" + chartWidth + "," + i * 20 + ")";
      });

    stockLegend
      .append("text")
      .text(function (d) {
        return d;
      })
      .attr("transform", "translate(15,9)"); //align texts with boxes

    stockLegend
      .append("rect")
      .attr("fill", function (d, i) {
        return color(d);
      })
      .attr("width", 10)
      .attr("height", 10);
  }

  svg
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("% Return");

  svg
    .selectAll("text")
    .styles({ fill: "#FFFFFF" });
  svg
  .selectAll("line")
  .styles({ stroke: "#FFFFFF" });

  //set axis to white
  document.querySelector("#my_dataviz > svg > g > g:nth-child(1) > path").style.stroke = "white";
  document.querySelector("#my_dataviz > svg > g > g:nth-child(2) > path").style.stroke = "white";
}

function timeChange(){
  var updatedTime = $('#Time option:selected').text();
  if(updatedTime != selectedTime){
    selectedTime = updatedTime;
    chartButtonClick();
  }
}

function showChartToggle(){
  var chartToggle = document.getElementById("cv__show_chart_toggle");
  var chart = document.getElementById("my_dataviz");
  if (chartToggle.checked) {
    chartButtonClick();
  } else {
    removeChart();
    document.getElementsByClassName("cv__chart_toggle")[0].checked = false;
    showAll = false;
  }
}