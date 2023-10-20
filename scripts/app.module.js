// https://bankofgeorgia.ge/en/currencies

class App {
    
    tl = 0;

    constructor() {

        let _this =  this;
        // get default data
        chrome.storage.local.get(["lari_in_lira"]).then((result) => {
            _this.tl = result.lari_in_lira;
        });
        
        // get input from popup
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if(!sender.tab) {
                    _this.tl = request.greeting;
                    $('.new-price').remove();
                    _this.addCurrency();
                }
            }
        );
        
        // loop
        setInterval(function(){ _this.addCurrency(); }, 1000);
    }
    addCurrency()
    {
        let _this =  this;
        // main page
        let priceBox = $(document).find('.prc-box-dscntd font font, .price-box font font');
        $.each(priceBox, function(key, element) {
            let price = _this.priceConverter( $(element).text() );
            let isPrice = $(element).closest('div').find('.new-price');
            if(isPrice.length == 0) {
                $(element).closest('div').append('<font class="new-price"> (' + price + ' GEL)</font>');
            }
        });
    
        // detail page
        let detailPriceBox = $(document).find('.prc-dsc font font, .pb-summary-total-price font font, .pb-basket-item-price > font font');
        $.each(detailPriceBox, function(key, element) {
            let detailPrice = _this.priceConverter( $(element).text() );
            let isDetailPrice = $(element).closest('div').find('.new-price');
            if(isDetailPrice.length == 0) {
                $(element).append('<font class="new-price"> (' + detailPrice + ' GEL)</font>');
            }
        });
            // console.log('done')
    }

    priceConverter(price) {
        let _this =  this;
        const pattern = /[\.,](?=\d{3})/g;
        let toLari = price.replace(pattern, '');
        
        toLari = parseFloat(toLari) * _this.tl;
        return toLari.toFixed(0);
    }
}

let app = new App();