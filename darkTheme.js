var darkMode = false;

function darkThemeToggle() {
  if (document.getElementsByClassName("cv__dark_theme_toggle")[0].checked) {
    darkMode = true;
    document.body.style.background = "#121212";
    document.body.style.color = "white";
    document.getElementById("settings__ui").style.background = "#242424";

    //check if chart toggle is on before displaying chart
    var chartToggle = document.getElementById("cv__show_chart_toggle");
    if (chartRequested === true && chartToggle.checked) {
      removeChart();
      displayChartDarkMode();
    }
  } else {
    darkMode = false;
    document.body.style.background = "white";
    document.body.style.color = "black";
    document.getElementById("settings__ui").style.background =
      "rgb(230, 230, 230)";

    //check if chart toggle is on before displaying chart
    var chartToggle = document.getElementById("cv__show_chart_toggle");
    if (chartRequested === true && chartToggle.checked) {
      removeChart();
      displayChart();
    }
  }
  
  setTableToSelectedMode();
}

function setTableHeadersToDarkMode() {
  var tableHeaders = document.getElementsByClassName("tableHeader");
  for (var i = 0; i < tableHeaders.length; i++) {
    tableHeaders[i].style.color = "white";
  }
}

function setTableHeadersToLightMode() {
  var tableHeaders = document.getElementsByClassName("tableHeader");
  for (var i = 0; i < tableHeaders.length; i++) {
    tableHeaders[i].style.color = "black";
  }
}

function setTableRowsToDarkMode(){
  var tableBody = document.getElementById("tableBody").childNodes;
  for(var i = 0; i < tableBody.length; i++){
    tableBody[i].style.color = "white";
  }
}

function setTableRowsToLightMode(){
  var tableBody = document.getElementById("tableBody").childNodes;
  for(var i = 0; i < tableBody.length; i++){
    tableBody[i].style.color = "black";
  }
}

function setTableToSelectedMode(){
  if(document.getElementsByClassName("cv__table_toggle")[0].checked){
    if(document.getElementsByClassName("cv__dark_theme_toggle")[0].checked){
      setTableHeadersToDarkMode();
      setTableRowsToDarkMode();
    }else{
      setTableHeadersToLightMode();
      setTableRowsToLightMode();
    }
  }
}
