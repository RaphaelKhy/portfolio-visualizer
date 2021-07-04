var darkMode = false;

function darkThemeToggle() {
  if (document.getElementsByClassName("cv__dark_theme_toggle")[0].checked) {
    darkMode = true;
    document.body.style.background = "black";
    document.body.style.color = "white";
    document.getElementById("settings__ui").style.background = "black";
    if (chartRequested === true) {
      removeChart();
      displayChartDarkMode();
    }
  } else {
    darkMode = false;
    document.body.style.background = "white";
    document.body.style.color = "black";
    document.getElementById("settings__ui").style.background = "rgb(230, 230, 230)";
    if (chartRequested === true) {
        removeChart();
        displayChart();
      }
  }
}