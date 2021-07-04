function hideInfoTable() {
  $("#infoTable").hide();
}

function showInfoTable() {
  $("#infoTable").show();
}

function tableToggle() {
  if (document.getElementsByClassName("cv__table_toggle")[0].checked) {
    showInfoTable();
  } else {
    hideInfoTable();
  }
}
