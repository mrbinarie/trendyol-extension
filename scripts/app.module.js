// https://bankofgeorgia.ge/en/currencies

let tl = 0;

// 
$.getJSON("https://www.floatrates.com/daily/try.json", function(currencies) {
    // console.log(currencies.gel.rate)
    tl = currencies.gel.rate;
});

// get input from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(!sender.tab) {
        tl = request.greeting;
        // console.log(request.greeting)
        $('.new-price').remove();
        currency();
    }
});

// loop
setInterval(function(){ currency(); }, 1000);

// convert TL to LARI
function currency() {

    // main page
    let priceBox = $(document).find('.prc-box-dscntd > font > font, .price-box > font > font');
    $.each(priceBox, function(key, element) {
        let price = $(element).text().replaceAll(',','');
        let isPrice = $(element).find('.new-price');
        if(isPrice.length == 0 && $.isNumeric(price)) {
            $(element).append('<font class="new-price">(' + (parseInt(price) * tl).toFixed(0) + ' GEL)</font>');
        }
    });

    // detail page
    let detailPriceBox = $(document).find('.prc-dsc > font > font');
    let price = detailPriceBox.text().replaceAll(' TL','');
    let isPrice = $(detailPriceBox).find('.new-price');
    if(isPrice.length == 0 && $.isNumeric(price)) {
        $(detailPriceBox).append('<font class="new-price">(' + (parseInt(price) * tl).toFixed(0) + ' GEL)</font>');
    }

    // console.log('done')
}
