
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

    var csvPath = "data/" + stockName.toLowerCase() + ".csv";

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

function mergeStocks(){
    //combine performance of stocks bassed on allocation

    //create combined stock
    storageLength = storage.length;
    storage[storageLength] = {stock:"combined", percentAllocation: 100};
    dataLength = storage[0].data.length;
    CombinedDataArray = [];

    for(var i = 0; i < dataLength; i++){
        var totalWeightedPercentReturn = 0;
        for(var j = 0; j < storageLength; j++){
            var percentR = storage[j].data[i].percentReturn;
            // console.log(storage[j].stock, i);
            // console.log("total return:" , percentR);
            stockAllocation = (storage[j].percentAllocation);
            stockWeightedPercentReturn = (percentR * stockAllocation)/100
            // console.log("weighted return:" , stockWeightedPercentReturn);
            totalWeightedPercentReturn += stockWeightedPercentReturn;
            // console.log("Total Weighted Return: ", totalWeightedPercentReturn);
            CombinedDataArray.push({date:storage[j].data[i].date, value:totalWeightedPercentReturn});
        }
    }
    // console.log(CombinedDataArray);
    storage[storageLength].data = CombinedDataArray;
}

// mainCalc([
//     {stock:'TSLA',percentAllocation:40},
//     {stock:'SPY',percentAllocation:40},
//     {stock:'AAPL',percentAllocation:20}
// ]);