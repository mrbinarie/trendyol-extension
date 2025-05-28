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
                    $('.converted-price').remove();
                    _this.addCurrency();
                }
            }
        );
        console.log('Trendyol Converter Activated...')
        // loop
        setInterval(() => _this.addCurrency(), 100);

        _this.loadTranslatedWords();
        setInterval(() => _this.CategoriesTranslator(), 100);
    }
    addCurrency()
    {
        let _this =  this;
        // main page
        let priceBox = $(document).find('.price-item');
        $.each(priceBox, function(key, element) {
            let price = _this.priceConverter( $(element).text() );
            let isPrice = $(element).closest('div').find('.converted-price');
            if(isPrice.length == 0) {
                $(element).closest('div').append('<font class="converted-price"> (' + price + ' GEL)</font>');
            }
        });
    
        // detail page
        let detailPriceBox = $(document).find('.prc-dsc font font, .pb-summary-total-price font font, .pb-basket-item-price > font font');
        $.each(detailPriceBox, function(key, element) {
            let detailPrice = _this.priceConverter( $(element).text().replace(' TL', '') );
            let isDetailPrice = $(element).closest('div').find('.converted-price');
            if(isDetailPrice.length == 0 && !isNaN(detailPrice)) {
                $(element).append('<font class="converted-price"> (' + detailPrice + ' GEL)</font>');
            }
        });
    
        // Cart page
        let totalPriceBox = $(document).find('.pb-summary-total-price font font');
        $.each(totalPriceBox, function(key, element) {
            let totalPrice = _this.priceConverter( $(element).text().replace(' TL', '') );
            let isDetailPrice = $(element).closest('font').find('.converted-price');
            if(isDetailPrice.length == 0 && !isNaN(totalPrice)) {
                $(element).append('<font class="converted-price"> (' + totalPrice + ' GEL)</font>');
            }
        });
        
    
        // Buy page
        totalPriceBox = $(document).find('span.ty-font-price font font');
        $.each(totalPriceBox, function(key, element) {
            let totalPrice = _this.priceConverter( $(element).text().replace(' TL', '') );
            let isDetailPrice = $(element).closest('span').find('.converted-price');
            if(isDetailPrice.length == 0 && !isNaN(totalPrice)) {
                $(element).append('<font class="converted-price"> (' + totalPrice + ' GEL)</font>');
            }
        });

    }

    priceConverter(price) {
        let _this =  this;
        const pattern = /[\.,](?=\d{3})/g;
        let toLari = price.replace(pattern, '');

        toLari = parseFloat(toLari) * _this.tl;
        return toLari.toFixed(0);
    }

    loadTranslatedWords() {
        let _this = this;
        _this.translatedWords = [];
        fetch(chrome.runtime.getURL('lang/english.json'))
            .then((response) => response.json())
            .then((data) => {
                _this.translatedWords = data;
            })
            .catch((error) => console.error("Error loading JSON:", error));
    }

    CategoriesTranslator() {
        let _this = this;
        let categoryList = $('.categories-wrapper');
        
        if(categoryList.length > 0) {
            let categoriesLink = $(categoryList).find('a');
            $.each(categoriesLink, function(key, li) {
                $.each(_this.translatedWords, function(keyj, translateWord) {
                    if($(li).text().trim() === translateWord.name_tr) {
                        $(li).text(translateWord.name_en);
                    }
                })
            });

        }
    }
}

let app = new App();