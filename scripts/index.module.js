
let currency = $('[name="currency"]').val();

if(currency.length == 0) {
    chrome.storage.local.get(["lari_in_lira"]).then((result) => {
        $('[name="currency"]').val(result.lari_in_lira);
        sendCurrencyToApp();
    });
}

$('#btn').on('click', function() {
    sendCurrencyToApp();
    let value = $('[name="currency"]').val()
    chrome.storage.local.set({ lari_in_lira: value }).then(() => {
        console.log("Value is set");
    });
    window.close();
});

function sendCurrencyToApp() {
    chrome.tabs.query({active: false, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            greeting: $('[name="currency"]').val()
        }, function(response) {
            // alert(response.farewell);
        });
    });
}