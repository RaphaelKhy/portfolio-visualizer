var num_row = 0;
var stock_selection = '<div class="col-4"><input type="text" list="tickers" class="form-control stock_input" id=' + num_row + 'placeholder="Stock Symbol"><datalist id="tickers"><option>TSLA</option><option>AAPL</option><option>BABA</option><option>SPY</option></datalist></input></div>'
var percent_allocation =  '<div class="col-4"><input type="number" min="0" max="100" placeholder="%" class="form-control percent" onchange="percent_change() "></div>'

function addRow() {
    html = '<div class="row" id="stock-row' + num_row + '">';
        html += stock_selection;
        html += percent_allocation;
        html += '<div class="col-4"><button type="button" class="btn btn-danger btn-sm" onclick="$(\'#stock-row' + num_row + '\').remove();percent_change();">Delete</button> </div>';
        html += '</div>'
    $('#stock_list').append(html);
    num_row++;
}

$( document ).ready(function() {
    addRow();
});

function percent_change(){
    var total_percent=0;
    $('#total').text(total_percent);
    $(".percent").each(function(index) {
        
        var percent = $(this).val();
        if (Number.isInteger(parseInt(percent))){
            total_percent += parseInt(percent);
        };
        $('#total').text(total_percent + " %");
      });
  };
