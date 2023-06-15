
let currency = $('[name="currency"]').val();

if(currency.length == 0) {
    chrome.storage.local.get(["lari_in_lira"]).then((result) => {
        $('[name="currency"]').val(result.lari_in_lira);
        sendCurrencyToApp();
    });
}

$('#btn').on('click', function() {
    sendCurrencyToApp();
    let lari_in_lira = $('[name="currency"]').val()
    chrome.storage.local.set({ lari_in_lira: lari_in_lira }).then(() => {
        console.log("Value is set");
    });
});

function chromeTabs(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
        value: $('[name="currency"]').val()
    }, function(response) {
        // alert(response.farewell);
    });
}

function sendCurrencyToApp() {
    chrome.tabs.query({active: false, currentWindow: true}, function(tabs) {
        chromeTabs(tabs);
    });
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chromeTabs(tabs);
    });
}