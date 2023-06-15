// https://bankofgeorgia.ge/en/currencies

let tl = 0;

// get default data
chrome.storage.local.get(["lari_in_lira"]).then((result) => {
    tl = result.lari_in_lira;
});

// get input from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(!sender.tab) {
            tl = request.greeting;
            $('.new-price').remove();
            addCurrency();
        }
    }
);

// loop
setInterval(function(){ addCurrency(); }, 1000);

// convert TL to LARI
function addCurrency() {

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
