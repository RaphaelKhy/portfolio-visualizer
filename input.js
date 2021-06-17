var rowNum = 0;
var isInputValid = true;

$(document).ready(function() { //when document loads add one row
    addRow();
});

function addRow(){
    inputRow = createInputRow();
    $('#stockList').append(inputRow);
    rowNum++;
}
function createInputRow(){
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
}

function createStockInputElement(){
    var newDiv = document.createElement('div'); //create div
    newDiv.className = "col-4";
    var input = document.createElement('input'); //create input
    input.id = rowNum;
    input.type = "text";
    input.className = "form-control"
    input.setAttribute("list", "tickers");
    input.setAttribute("onchange", "inputChange();");

    var dataList = document.createElement('datalist'); //create datalist
    dataList.id="tickers";

    for(var i = 0; i < acceptedStocks.length; i++){    //add options to dataList from acceptedStocks
        var option = document.createElement('option');
        option.value = acceptedStocks[i];
        dataList.appendChild(option);
    }

    newDiv.appendChild(input);
    input.appendChild(dataList);
    return newDiv;
}

function createPercentInputElement(){
    var newdiv = document.createElement('div'); //create div
    newdiv.className = "col-4";
    var input = document.createElement('input'); //create input
    input.type = "number";
    input.min = "0";
    input.max = "100";
    input.placeholder ="%";
    input.className = "form-control percent";
    input.setAttribute("onchange", "inputChange();");

    newdiv.appendChild(input);
    return newdiv;
}

function createDeleteButton(){
    var newdiv = document.createElement('div'); //create div
    newdiv.className = "col-4";
    var button = document.createElement('button'); //create button
    button.className = "btn btn-danger btn-sm";
    button.setAttribute("onclick", "this.parentNode.parentNode.remove(); inputChange();"); //delete row on click
    button.innerHTML='Delete';
    newdiv.appendChild(button);
    return newdiv;
}

function inputChange(){
    isInputValid = true;
    var totalPercent=0;
    $('#total').text(totalPercent); //set total percent to 0

    $('div[id^="stockRow"]').each(function() { //iterate through row inputs
        divRow = $(this)[0];
        stock = $(divRow).children().eq(0).children().eq(0)[0].value;
        percent = parseFloat($(divRow).children().eq(1).children().eq(0)[0].value);
        // console.log("stock: ", stock);
        // console.log("percent: ", percent)
        
        if(!isNaN(parseFloat(percent))){ // Update Total
            totalPercent += parseFloat(percent);
            $('#total').text(totalPercent);
        }
        if(percent<0){ //test if percent is negative
            var toast = $('.toast-body')[0];
            toast.innerText = "Negtive Percent";
            $('.toast').toast('show');
            isInputValid = false;
            return false;
        }
        if(totalPercent > 100){ //test if totalPercent > 100
            var toast = $('.toast-body')[0];
            toast.innerText = "Percent greater that 100";
            $('.toast').toast('show');
            isInputValid = false;
            return false;
        }
        if(stock.length > 0){  //test if invalid stock
            if(!isValidStock(stock)){ 
            var toast = $('.toast-body')[0];
            toast.innerText = "Invalid Stock: " + stock;
            $('.toast').toast('show');
            isInputValid = false;
            return false;
            }
        }
    });
};

function isValidStock(stock){
    return acceptedStocks.includes(stock);
}


