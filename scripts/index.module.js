
let currency = $('[name="currency"]').val();

if(currency.length == 0) {
    $.getJSON("currency.txt", function(currency) {
        $('[name="currency"]').val(currency);
        sendCurrencyToApp();
    });
}

$('#btn').on('click', function() {
    sendCurrencyToApp();
});

function sendCurrencyToApp() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            greeting: $('[name="currency"]').val()
        }, function(response) {
            // alert(response.farewell);
        });
    });
}