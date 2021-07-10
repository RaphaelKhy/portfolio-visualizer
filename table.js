function hideInfoTable() {
  $("#infoTable").hide();
}

function showInfoTable() {
  $("#infoTable").show();
  createTableRows();
}

function tableToggle() {
  if (document.getElementsByClassName("cv__table_toggle")[0].checked) {
    showInfoTable();
  } else {
    hideInfoTable();
  }
}

function createTableRows(){
  //clear table
  const myTableNode = document.getElementById("tableBody");
  myTableNode.innerHTML = '';


  for(var i = 0; i < storage.length; i++){
    $('#tableBody').append(createTableRow(storage[i]));
  }
}

function createTableRow(stock){
  var newRow = document.createElement('tr');

  //Asset
  var stockName = stock.stock;
  var stockNameColumn = document.createElement('td');
  stockNameColumn.innerHTML = stockName;
  newRow.appendChild(stockNameColumn);

  //allocation
  var allocation = stock.percentAllocation
  var allocationColumn = document.createElement('td');
  allocationColumn.innerHTML = allocation + "%";
  newRow.appendChild(allocationColumn);

  //Total Return
  var totalReturn = stock.data[stock.data.length-1].percentReturn;
  var totalReturnColumn = document.createElement('td');
  totalReturnColumn.innerHTML = totalReturn.toFixed(2) + "%";
  newRow.appendChild(totalReturnColumn);

  //Max Drawdown
  var drawdown = stock.minValue;
  var drawdownColumn = document.createElement('td');
  drawdownColumn.innerHTML = drawdown.toFixed(2) + "%";
  newRow.appendChild(drawdownColumn);
  return newRow;
}