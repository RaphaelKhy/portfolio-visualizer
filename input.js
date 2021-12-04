var rowNum = 0;
var isInputValid = true;

function addRow() {
  inputRow = createInputRow();
  $("#stockList").append(inputRow);
  rowNum++;
}

function createInputRow() {
  var newdiv = document.createElement("div");
  newdiv.className = "row sv__bottom_buffer";
  newdiv.id = "stockRow" + rowNum;
  // var stockInput = createStockInputElement();
  var stockInput = createStockSelectElement();
  var percentInput = createPercentInputElement();
  var deleteButton = createDeleteButtonIcon();
  newdiv.appendChild(stockInput);
  newdiv.appendChild(percentInput);
  newdiv.appendChild(deleteButton);
  return newdiv;
}

function createStockSelectElement() {
  var newDiv = document.createElement("div");
  newDiv.className = "col-4";
  var select = document.createElement("select");
  select.id = rowNum;
  select.className = "form-control sv__input_padding stock_input";
  select.setAttribute("onchange", "inputChange();");
  select.appendChild(document.createElement("option")); //add a blank option
  for (const stock of acceptedStocks) {
    var option = document.createElement("option");
    option.value = stock;
    var text = document.createTextNode(stock);
    option.appendChild(text);
    select.appendChild(option);
  }

  newDiv.appendChild(select);
  $(document).ready(function () {
    $(".stock_input").select2({
      placeholder: "Select stock",
      allowClear: true,
    });
  });
  return newDiv;
}

$(document).ready(function () {
  addRow();
});

function createPercentInputElement() {
  var newdiv = document.createElement("div");
  newdiv.className = "col-3";

  var inputDiv = document.createElement("div");
  inputDiv.className = "input-group";

  var input = document.createElement("input");
  input.type = "number";
  input.min = "0";
  input.max = "100";
  input.className = "form-control percent sv__input_padding";
  input.setAttribute("onchange", "inputChange();");
  inputDiv.appendChild(input);

  var percentSymbol = document.createElement("span");
  percentSymbol.className = "input-group-text sv__input_padding";
  percentSymbol.innerHTML = "%";

  inputDiv.appendChild(percentSymbol);

  newdiv.appendChild(inputDiv);

  return newdiv;
}

function createDeleteButton() {
  var newdiv = document.createElement("div");
  newdiv.className = "col-5";
  var button = document.createElement("button");
  button.className = "btn btn-outline-danger btn-sm";
  button.setAttribute(
    "onclick",
    "this.parentNode.parentNode.remove(); updateTotalPercent();"
  ); //delete row on click
  button.innerHTML = "×";
  newdiv.appendChild(button);
  return newdiv;
}

function createDeleteButtonIcon() {
  var newdiv = document.createElement("i");
  newdiv.className = "col-5";
  var button = document.createElement("button");
  button.className = "btn btn-outline-danger btn-sm bi bi-trash";
  button.setAttribute(
    "onclick",
    "this.parentNode.parentNode.remove(); updateTotalPercent();"
  );
  // button.innerHTML = "delete";
  newdiv.appendChild(button);
  return newdiv;
}

function inputChange() {
  //Preliminary input validation
  totalPercent = updateTotalPercent();
  isInputValid = true;
  $('div[id^="stockRow"]').each(function () {
    //iterate through row inputs
    divRow = $(this)[0];
    stock = $(divRow).children().eq(0).children().eq(0)[0].value.toUpperCase();
    percent = parseFloat(
      $(divRow).children().eq(1).children()[0].children[0].value
    );

    //test for invalid stock
    if (stock.length > 0) {
      if (!isValidStock(stock)) {
        displayToast("Invalid Stock: " + stock);
        isInputValid = false;
        return false;
      }
    }

    //test for negative percent
    if (percent < 0) {
      displayToast("Negative Percent");
      isInputValid = false;
      return false;
    }

    //test for totalPercent greater than 100
    if (totalPercent > 100) {
      displayToast("Percent greater that 100");
      isInputValid = false;
      return false;
    }
  });
}

function isValidStock(stock) {
  return acceptedStocks.includes(stock);
}

// function keyUpUpperCase(obj) {
//     obj.value = obj.value.toUpperCase();
// };

function displayToast(message) {
  Toastify({
    text: message,
    duration: 1500,
    newWindow: true,
    gravity: "bottom",
    position: "right",
    close: true,
    backgroundColor: "#DB3549",
  }).showToast();
}

async function updateTotalPercent() {
  //updates and returns total percent
  var totalPercent = 0;
  document.getElementById("totalPercent").value = totalPercent;
  $('div[id^="stockRow"]').each(function () {
    divRow = $(this)[0];
    stock = $(divRow).children().eq(0).children().eq(0)[0].value.toUpperCase();
    percent = parseFloat(
      $(divRow).children().eq(1).children()[0].children[0].value
    );

    if (!isNaN(parseFloat(percent))) {
      // Update totalPercent
      totalPercent += parseFloat(percent);
    }
  });
  document.getElementById("totalPercent").value = totalPercent;
  return totalPercent;
}

async function randomButtonClick() {
  var rowCount = getRowCount();

  //test if number of rows exceeds available stocks
  if (rowCount > acceptedStocks.length) {
    displayToast("Too many stocks requested");
    return;
  }

  //generate random data as input
  var percentList = randomPercentList(rowCount, 100);
  var stockList = randomStockList(rowCount);
  var percentListIndex = 0;
  var stockListIndex = 0;

  //insert random data into input fields
  $('div[id^="stockRow"]').each(function () {
    var divRow = $(this)[0];
    var stock = stockList[stockListIndex];
    stockListIndex++;
    $(divRow).children().eq(0).children().eq(0)[0].value = stock;
    percent = percentList[percentListIndex];
    percentListIndex++;
    $(divRow).children().eq(1).children()[0].children[0].value = percent;
  });
  await updateTotalPercent();
  await chartButtonClick();
  setTableToSelectedMode();
  $(document).ready(function () {
    $(".stock_input").select2({
      placeholder: "Select stock",
      allowClear: true,
    });
  });
}

function getRowCount() {
  //returns number of input rows
  var numRows = 0;
  $('div[id^="stockRow"]').each(function () {
    numRows++;
  });
  return numRows;
}

function randomPercentList(quantity, sum) {
  //returns array with random values greater than 0
  // every element is initialized to 1
  let arr = new Array(quantity);
  for (let i = 0; i < arr.length; i++) {
    arr[i] = 1;
    sum--;
  }

  for (let i = 0; i < sum; i++) {
    // Increment any random element
    // from the array by 1
    arr[Math.floor(Math.random() * sum) % quantity]++;
  }
  return arr;
}

function randomStockList(quantity) {
  //returns unique random stocks
  var randomStocks = [];
  var randStocksIndex = 0;
  acceptedStockLength = acceptedStocks.length;

  while (randStocksIndex < quantity) {
    var index = Math.floor(Math.random() * acceptedStockLength);
    stockName = acceptedStocks[index];
    if (!randomStocks.includes(stockName)) {
      randomStocks[randStocksIndex] = stockName;
      randStocksIndex++;
    }
  }
  return randomStocks;
}
