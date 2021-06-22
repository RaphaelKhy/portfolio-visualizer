var storage=[];

async function mainCalc(userInput){
    storage = userInput;
    for(var position = 0; position < storage.length; position++){
        stockName = storage[position].stock;
        var data = await getStockDataFromCSV(stockName);
        storage[position].data = data;
    }
    AddPercentReturnToStorage();
    mergeStocks();
}

async function getStockDataFromCSV(stockName){//gets stock data from static csv file
    var stockDatePrice = [];
    var csvPath = "data/" + stockName + ".csv";

    await $.get(csvPath, function(response){
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
                stockDatePrice.push(datePriceDict);
            }
        };
    })
    return stockDatePrice;
};

function AddPercentReturnToStorage(){//Adds percent return to each stock in storage
    
    //iterate through stocks in storage
    for(var i = 0; i < storage.length; i++){
        stock = storage[i];
        dataLength = stock.data.length;
        startingPrice = stock.data[0].price;

        //iterate through data in stock
        for(var j = 0; j < dataLength; j++){
            newPrice = stock.data[j].price;
            stockName = storage[i].stock;
            percentChange = ((newPrice-startingPrice)/startingPrice)*100;
            storage[i].data[j].percentReturn = percentChange;
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
    storage[storageLength].data = allDaysReturn;
}