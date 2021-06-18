
var storage=[];
var position=0;
var outputArray = [];

function mainCalc(userInput){
    storage = userInput;
    position=0;
    collectStockDataFromCSVCallBack(position, storage[position].stock)
};

var collectStockDataFromCSVCallBack = function (position, stockName, file_data){
    if (file_data == null){
        getStockDataFromCSV(stockName, position, collectStockDataFromCSVCallBack);
    }
    else {
        storage[position].data = file_data;
        position++;
        if (position < storage.length){
            getStockDataFromCSV(storage[position].stock, position, collectStockDataFromCSVCallBack);
        }
        else {
            
            AddPercentReturnToStorage();
            mergeStocks();
            // console.log(storage);
        }
    }
}

function getStockDataFromCSV(stockName, position, cb){
    //gets stock data from static csv file
    //Returns date and price data as array

    var datePrice = [];

    var csvPath = "data/" + stockName + ".csv";

    $.get(csvPath, function(response){
        splitResponse = response.split('\n');
        var length = splitResponse.length;
        for(var i = 0; i < length; i++){
            var dataRow = splitResponse[i];
            var splitDataRow = dataRow.split(',');
            var datePriceDict = {};
            var date = "";
            var price = 0;

            date = splitDataRow[0];
            if(date != ''){
                datePriceDict['date'] = date;
            };

            price = parseFloat(splitDataRow[1]);
            if(! isNaN(price)){
                datePriceDict['price'] = price;
            }

            //Push datePriceDict to datePriceArray if Dictionary isn't empty
            if(!Object.keys(datePriceDict).length == 0){
                datePrice.push(datePriceDict);
            }
        };
        cb(position,stockName, datePrice);
    })
};

function AddPercentReturnToStorage(){
    //Adds percent return to storage

    //iterate through stocks in storage
    for(var i = 0; i < storage.length; i++){
        stock = storage[i];
        dataLength = stock.data.length;
        startingPrice = stock.data[0].price;

        //iterate through data in stock
        for(var j = 0; j < dataLength; j++){
            newPrice = stock.data[j].price;
            stockName = storage[i].stock;
            // console.log(stockName);
            // console.log(newPrice);
            percentChange = ((newPrice-startingPrice)/startingPrice)*100;
            // console.log(percentChange);
            storage[i].data[j].percentReturn = percentChange;
            // console.log(storage[i].data[j]);
        }
    }
};

function mergeStocks(){//combine performance of stocks bassed on allocation
    

    storageLength = storage.length;
    storage[storageLength] = {stock:"combined", percentAllocation: 100};
    dataLength = storage[0].data.length;
    allDaysReturn = [];
    var dayTotalReturn = [];
    var dateString;

    for(var date = 0; date < dataLength; date++){
        dateString = storage[0].data[date].date;
        dayTotalReturn = [];
        for(var stock = 0; stock < storageLength; stock++){
            var percentReturn = storage[stock].data[date].percentReturn;
            stockAllocation = (storage[stock].percentAllocation);
            dayTotalReturn.push((percentReturn * stockAllocation)/100);
        }
        var totalReturnPerDay = 0;
        for(var s = 0; s < storageLength; s++){
            totalReturnPerDay+=dayTotalReturn[s];
        }
        allDaysReturn.push({"date": new Date(dateString),"value":totalReturnPerDay});
    }
    // console.log(allDaysReturn);
    storage[storageLength].data = allDaysReturn;
}
