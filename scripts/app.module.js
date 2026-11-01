// https://bankofgeorgia.ge/en/currencies

class App {
    tl = 0;

    constructor() {
        let _this = this;
        chrome.storage.local.get(["lari_in_lira"]).then((result) => {
            _this.tl = result.lari_in_lira;
            _this.observePageChanges();
            _this.addCurrency();
        });

        chrome.runtime.onMessage.addListener(function(request, sender) {
            if(!sender.tab) {
                _this.tl = request.greeting;
                $('.converted-price').remove();
                _this.addCurrency();
            }
        });

        console.log('Trendyol Converter Activated...');
    }

    addCurrency(root = document) {
        let _this = this;
        const hasCurrency = element => /TL/.test(element.textContent || '');
        let scanRoot = $(root);
        let priceBox = scanRoot.find('*').addBack().filter(function() {
            return hasCurrency(this) && !Array.from(this.children).some(hasCurrency);
        });
        $.each(priceBox, function(key, element) {
            let priceElement = $(element);
            let price = _this.priceConverter(element.innerText || '');
            if(price === null) {
                return;
            }
            if(priceElement.find('.converted-price').length === 0) {
                priceElement.append('<font class="converted-price">(' + price + ' GEL)</font>');
            }

            priceElement.parents().filter(function() {
                return priceBox.filter((_, candidate) => this.contains(candidate)).length === 1 &&
                    $(this).find('.converted-price').length > 1;
            }).first().each(function() {
                const seenPrices = new Set();
                $(this).find('.converted-price').each(function() {
                    const convertedText = $(this).text().trim();
                    if(seenPrices.has(convertedText)) {
                        $(this).remove();
                    } else {
                        seenPrices.add(convertedText);
                    }
                });
            });
        });
    }

    priceConverter(price) {
        let _this = this;
        const priceMatch = price.match(/\d[\d.,]*/);
        const exchangeRate = Number(_this.tl);
        if(!priceMatch || !/TL/.test(price) || !Number.isFinite(exchangeRate) || exchangeRate <= 0) {
            return null;
        }
        let toLari = priceMatch[0].replace(/[\.,](?=\d{3})/g, '');
        toLari = parseFloat(toLari);
        if(!Number.isFinite(toLari) || toLari <= 0) {
            return null;
        }
        toLari *= exchangeRate;
        return toLari.toFixed(0);
    }

    observePageChanges() {
        let pendingRoots = new Set();
        let scanScheduled = false;
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const changedNodes = mutation.type === 'characterData'
                    ? [mutation.target.parentElement]
                    : Array.from(mutation.addedNodes);

                changedNodes.forEach((node) => {
                    const root = node && node.nodeType === Node.ELEMENT_NODE
                        ? node
                        : node && node.parentElement;
                    if(!root || root.classList.contains('converted-price')) {
                        return;
                    }

                    const hasPendingAncestor = Array.from(pendingRoots).some((pendingRoot) => pendingRoot.contains(root));
                    if(hasPendingAncestor) {
                        return;
                    }
                    pendingRoots.forEach((pendingRoot) => {
                        if(root.contains(pendingRoot)) {
                            pendingRoots.delete(pendingRoot);
                        }
                    });
                    pendingRoots.add(root);
                });
            });

            if(pendingRoots.size === 0 || scanScheduled) {
                return;
            }

            scanScheduled = true;
            setTimeout(() => {
                scanScheduled = false;
                const roots = Array.from(pendingRoots);
                pendingRoots.clear();
                roots.forEach((root) => {
                    if(document.documentElement.contains(root)) {
                        this.addCurrency(root);
                    }
                });
            }, 250);
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }
}

let app = new App();