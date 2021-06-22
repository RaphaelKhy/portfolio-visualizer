var rowNum = 0;
var isInputValid = true;

$(document).ready(function() { 
    addRow(); //when document loads add one row
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
    dataList.id="tickers";

    for(var i = 0; i < acceptedStocks.length; i++){//add options to dataList from acceptedStocks
        var option = document.createElement('option');
        option.value = acceptedStocks[i];
        dataList.appendChild(option);
    }

    newDiv.appendChild(input);
    input.appendChild(dataList);
    return newDiv;
}

function createPercentInputElement(){
    var newdiv = document.createElement('div');
    newdiv.className = "col-4";
    var input = document.createElement('input');
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
    var newdiv = document.createElement('div');
    newdiv.className = "col-4";
    var button = document.createElement('button');
    button.className = "btn btn-danger btn-sm";
    button.setAttribute("onclick", "this.parentNode.parentNode.remove(); inputChange();"); //delete row on click
    button.innerHTML='Delete';
    newdiv.appendChild(button);
    return newdiv;
}

function inputChange(){ //Preliminary input validation
    isInputValid = true;
    var totalPercent=0;
    $('#total').text(totalPercent); //set total percent to 0

    $('div[id^="stockRow"]').each(function() { //iterate through row inputs
        divRow = $(this)[0];
        stock = $(divRow).children().eq(0).children().eq(0)[0].value.toUpperCase();
        percent = parseFloat($(divRow).children().eq(1).children().eq(0)[0].value);
        
        if(!isNaN(parseFloat(percent))){ // Update totalPercent
            totalPercent += parseFloat(percent);
            $('#total').text(totalPercent);
        }

        //test for invalid stock
        if(stock.length > 0){
            if(!isValidStock(stock)){ 
            displayToast("Invalid Stock: ", stock);
            isInputValid = false;
            return false;
            }
        }

        //test for negative percent
        if(percent<0){ 
            displayToast("Negative Percent");
            isInputValid = false;
            return false;
        }

        //test for totalPercent greater than 100
        if(totalPercent > 100){
            displayToast("Percent greater that 100");
            isInputValid = false;
            return false;
        }
    });
};

function isValidStock(stock){
    return acceptedStocks.includes(stock);
}

function keyUpUpperCase(obj) {
    obj.value = obj.value.toUpperCase();
}

function displayToast(message, stock){
    var toast = $('.toast-body')[0];
    if(typeof stock != 'undefined'){
        toast.innerText = message + stock;
    }
    else{
        toast.innerText = message;
    }
    $('.toast').toast('show');
}