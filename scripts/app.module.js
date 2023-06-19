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
console.log('asd')
    // main page
    let priceBox = $(document).find('.prc-box-dscntd font font, .price-box font font');
    $.each(priceBox, function(key, element) {
        let price = $(element).text().replaceAll(',','');
        let isPrice = $(element).closest('div').find('.new-price');
        if(isPrice.length == 0 && $.isNumeric(price)) {
            $(element).closest('div').append('<font class="new-price"> (' + (parseInt(price) * tl).toFixed(0) + ' GEL)</font>');
        }
    });

    // detail page
    let detailPriceBox = $(document).find('.prc-dsc font font, .pb-summary-total-price font font, .pb-basket-item-price > font font');
    $.each(detailPriceBox, function(key, element) {
        let detailPrice = $(element).text().replaceAll(' TL','');
        let isDetailPrice = $(element).closest('div').find('.new-price');
        if(isDetailPrice.length == 0 && $.isNumeric(detailPrice)) {
            $(element).append('<font class="new-price"> (' + (parseInt(detailPrice) * tl).toFixed(0) + ' GEL)</font>');
        }
    });

    // console.log('done')
}
