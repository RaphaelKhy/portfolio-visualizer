var rowNum = 0;
var isInputValid = true;

$(document).ready(function () {
    addRow(); //when document loads add one row
    $(function() {
        $('input[name="startDate"]').daterangepicker({
          singleDatePicker: true,
          showDropdowns: true,
          minYear: 2000,
          maxYear: parseInt(moment().format('YYYY'),10)
        }, 
        function(start, end, label) {
          console.log(start, end)
        });
      });
});

function addRow() {
    inputRow = createInputRow();
    $('#stockList').append(inputRow);
    rowNum++;
};

function createInputRow() {
    var newdiv = document.createElement('div'); //create div
    newdiv.className = "row";
    newdiv.id = "stockRow" + rowNum;
    var stockInput = createStockInputElement();
    var percentInput = createPercentInputElement();
    var deleteButton = createDeleteButton();
    newdiv.appendChild(stockInput);
    newdiv.appendChild(percentInput);
    newdiv.appendChild(deleteButton);
    return newdiv;
};

function createStockInputElement() {
    var newDiv = document.createElement('div');
    newDiv.className = "col-4";
    var input = document.createElement('input');
    input.id = rowNum;
    input.type = "text";
    input.className = "form-control"
    input.setAttribute("list", "tickers");
    input.setAttribute("onchange", "inputChange();");
    input.setAttribute('onkeyup', "keyUpUpperCase(this);");

    var dataList = document.createElement('datalist');
    dataList.id = "tickers";

    for (var i = 0; i < acceptedStocks.length; i++) {//add options to dataList from acceptedStocks
        var option = document.createElement('option');
        option.value = acceptedStocks[i];
        dataList.appendChild(option);
    }

    newDiv.appendChild(input);
    input.appendChild(dataList);
    return newDiv;
};

function createPercentInputElement() {
    var newdiv = document.createElement('div');
    newdiv.className = "col-4";
    var input = document.createElement('input');
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.placeholder = "%";
    input.className = "form-control percent";
    input.setAttribute("onchange", "inputChange();");

    newdiv.appendChild(input);
    return newdiv;
};

function createDeleteButton() {
    var newdiv = document.createElement('div');
    newdiv.className = "col-4";
    var button = document.createElement('button');
    button.className = "btn btn-danger btn-sm";
    button.setAttribute("onclick", "this.parentNode.parentNode.remove(); updateTotalPercent();"); //delete row on click
    button.innerHTML = 'Delete';
    newdiv.appendChild(button);
    return newdiv;
};

function inputChange() { //Preliminary input validation
    totalPercent = updateTotalPercent();
    isInputValid = true;
    $('div[id^="stockRow"]').each(function () { //iterate through row inputs
        divRow = $(this)[0];
        stock = $(divRow).children().eq(0).children().eq(0)[0].value.toUpperCase();
        percent = parseFloat($(divRow).children().eq(1).children().eq(0)[0].value);

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
};

function isValidStock(stock) {
    return acceptedStocks.includes(stock);
};

function keyUpUpperCase(obj) {
    obj.value = obj.value.toUpperCase();
};

function displayToast(message) {
    //find x offset
    var windowWidth = document.body.clientWidth;
    var containerWidth = document.getElementById('inputContainer').getBoundingClientRect().width;
    xOffset = (windowWidth - containerWidth) / 2;

    Toastify({
        text: message,
        duration: 1500,
        newWindow: true,
        gravity: "bottom",
        position: 'right',
        close: true,
        backgroundColor: "#DB3549",
        offset: { x: xOffset },

    }).showToast();
};

function updateTotalPercent() {//updates and returns total percent
    var totalPercent = 0;
    $('#total').text(totalPercent);
    $('div[id^="stockRow"]').each(function () {
        divRow = $(this)[0];
        stock = $(divRow).children().eq(0).children().eq(0)[0].value.toUpperCase();
        percent = parseFloat($(divRow).children().eq(1).children().eq(0)[0].value);

        if (!isNaN(parseFloat(percent))) { // Update totalPercent
            totalPercent += parseFloat(percent);
        };
    });
    $('#total').text(totalPercent);
    return totalPercent;
};

function randomButtonClick() {
    var rowCount = getRowCount();
    var percentList = randomPercentList(rowCount, 100);
    var stockList = randomStockList(rowCount);
    var percentListIndex = 0;
    var stockListIndex = 0;

    $('div[id^="stockRow"]').each(function () {
        var divRow = $(this)[0];
        var stock = stockList[stockListIndex];
        stockListIndex++;
        $(divRow).children().eq(0).children().eq(0)[0].value = stock;
        percent = percentList[percentListIndex];
        percentListIndex++;
        $(divRow).children().eq(1).children().eq(0)[0].value = percent;
    });
    updateTotalPercent();
    chartButtonClick();
}

function getRowCount() { //returns number of input rows
    var numRows = 0;
    $('div[id^="stockRow"]').each(function () {
        numRows++;
    });
    return numRows;
}

function randomPercentList(quantity, sum) { //returns array with random values > 0
    // every element is initialized to 1
    let arr = new Array(quantity);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = 1;
        sum--;
    }

    for (let i = 0; i < sum; i++) {

        // Increment any random element
        // from the array by 1
        arr[(Math.floor((Math.random() * sum)) % quantity)]++;
    }
    return arr;
}

function randomStockList(quantity){ //returns unique random stocks
    var randomStocks = [];
    var randStocksIndex = 0;
    acceptedStockLength = acceptedStocks.length;

    while(randStocksIndex < quantity){
        var index = Math.floor(Math.random() * acceptedStockLength);
        stockName = acceptedStocks[index];
        if(! randomStocks.includes(stockName)){
            randomStocks[randStocksIndex] = stockName;
            randStocksIndex++
        }
    }
    return randomStocks;
}