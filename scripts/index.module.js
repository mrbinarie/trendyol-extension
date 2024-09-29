
let currency = $('[name="currency"]').val();

if(currency.length == 0) {
    chrome.storage.local.get(["lari_in_lira"]).then((result) => {
        $('[name="currency"]').val(result.lari_in_lira);
        sendCurrencyToApp();
    });
}

$('#generate-button').on('click', function() {
    setCashSell();
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

function setCashSell() {
    let currency = $('[name="currency"]').val();
    $('[name="currency"]').val(currency);
    sendCurrencyToApp();
    let value = $('[name="currency"]').val()
    chrome.storage.local.set({ lari_in_lira: value }).then(() => {
        console.log("Value is set");
    });
    window.close();
    //

    // const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
    // const targetUrl = 'https://api.businessonline.ge/api/rates/commercial/try';
    
    // fetch(proxyUrl + targetUrl, {
    //     headers: {
    //         'Origin': '*',  // Replace with your actual domain
    //         'X-Requested-With': 'XMLHttpRequest'
    //     }
    // })
    // .then(response => response.json())
    // .then(data => {
    //     // console.log('Success:', data);
    //     $('[name="currency"]').val(data.Sell);
    //     //
    //     sendCurrencyToApp();
    //     let value = $('[name="currency"]').val()
    //     chrome.storage.local.set({ lari_in_lira: value }).then(() => {
    //         console.log("Value is set");
    //     });
    //     window.close();
    //     //
    // })
    // .catch(error => {
    //     console.error('Error:', error);
    // });
}