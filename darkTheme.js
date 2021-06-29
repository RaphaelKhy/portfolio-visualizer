var darkMode = false;

function darkThemeToggle() {
  if (document.getElementsByClassName("cv__dark_theme_toggle")[0].checked) {
    darkMode = true;
    document.body.style.background = "rgb(0,0,0)";
    document.body.style.color = "white";
    if (chartRequested === true) {
      removeChart();
      displayChartDarkMode();
    }
  } else {
    darkMode = false;
    document.body.style.background = "white";
    document.body.style.color = "black";
    if (chartRequested === true) {
        removeChart();
        displayChart();
      }
  }
}
document.querySelector("#\\30 ")