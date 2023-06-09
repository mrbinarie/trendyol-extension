let tl = 0;

// get input from popup
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if(!sender.tab) {
        tl = request.greeting;
        // console.log(request.greeting)
        $('.new-price').remove();
        currency();
        
        // console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension: " + request.greeting);
        // if (request.greeting == "hello1")
        //     sendResponse({farewell: "goodbye"});
    }
});

// loop
setInterval(function(){ currency(); }, 1000);

// convert TL to LARI
function currency() {

    let priceBox = $(document).find('.prc-box-dscntd > font > font');
    $.each(priceBox, function(key, element) {
        let price = $(element).text().replaceAll(',','');
        let isPrice = $(element).find('.new-price');
        if(isPrice.length == 0 && $.isNumeric(price)) {
            $(element).append('<font class="new-price">(' + (parseInt(price) * tl).toFixed(0) + ' GEL)</font>');
        }
    });
    
    let detailPriceBox = $(document).find('.prc-dsc > font > font');
    let price = detailPriceBox.text().replaceAll(' TL','');
    let isPrice = $(detailPriceBox).find('.new-price');
    if(isPrice.length == 0 && $.isNumeric(price)) {
        $(detailPriceBox).append('<font class="new-price">(' + (parseInt(price) * tl).toFixed(0) + ' GEL)</font>');
    }

    console.log('done')
}
