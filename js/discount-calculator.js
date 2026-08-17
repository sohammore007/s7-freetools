document.addEventListener('DOMContentLoaded', () => {
    const originalPrice = document.getElementById('originalPrice');
    const discountPercent = document.getElementById('discountPercent');
    const finalPriceInput = document.getElementById('finalPriceInput');
    
    const discountGroup = document.getElementById('discountGroup');
    const finalPriceGroup = document.getElementById('finalPriceGroup');
    
    const resSaved = document.getElementById('resSaved');
    const resPrimary = document.getElementById('resPrimary');
    const resPrimaryLabel = document.getElementById('resPrimaryLabel');
    const resultsSection = document.getElementById('resultsSection');
    
    const calcModeRadios = document.querySelectorAll('input[name="calcMode"]');
    const calculateBtn = document.getElementById('calculateBtn');
    const copyResultBtn = document.getElementById('copyResultBtn');
    
    let currentMode = 'normal';
    
    function updateMode() {
        currentMode = document.querySelector('input[name="calcMode"]:checked').value;
        if (currentMode === 'normal') {
            discountGroup.style.display = 'block';
            finalPriceGroup.style.display = 'none';
            resPrimaryLabel.textContent = 'Final Price';
        } else {
            discountGroup.style.display = 'none';
            finalPriceGroup.style.display = 'block';
            resPrimaryLabel.textContent = 'Discount %';
        }
        calculate();
    }
    
    calcModeRadios.forEach(r => r.addEventListener('change', updateMode));
    
    const currencySelector = document.getElementById('currencySelector');
    let currentSymbol = localStorage.getItem('preferredCurrencySymbol') || '';
    if (currencySelector) {
        currencySelector.value = currentSymbol;
        currencySelector.addEventListener('change', () => {
            currentSymbol = currencySelector.value;
            localStorage.setItem('preferredCurrencySymbol', currentSymbol);
            calculate();
        });
    }

    function formatMoney(amount) {
        return currentSymbol + amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    function calculate() {
        const p = parseFloat(originalPrice.value);
        if (isNaN(p) || p <= 0) {
            resultsSection.style.display = 'none';
            return;
        }
        
        if (currentMode === 'normal') {
            const d = parseFloat(discountPercent.value);
            if (isNaN(d) || d < 0) {
                resultsSection.style.display = 'none';
                return;
            }
            const saved = p * (d / 100);
            const final = p - saved;
            
            resSaved.textContent = formatMoney(saved);
            resPrimary.textContent = formatMoney(final);
            resultsSection.style.display = 'block';
        } else {
            const f = parseFloat(finalPriceInput.value);
            if (isNaN(f) || f < 0 || f > p) {
                resultsSection.style.display = 'none';
                return;
            }
            const saved = p - f;
            const d = (saved / p) * 100;
            
            resSaved.textContent = formatMoney(saved);
            resPrimary.textContent = d.toLocaleString(undefined, { maximumFractionDigits: 2 }) + '%';
            resultsSection.style.display = 'block';
        }
    }
    
    originalPrice.addEventListener('input', calculate);
    discountPercent.addEventListener('input', calculate);
    finalPriceInput.addEventListener('input', calculate);
    calculateBtn.addEventListener('click', calculate);
    
    // Call calculate on load to process any browser-restored input values and the saved currency symbol
    calculate();
    
    copyResultBtn.addEventListener('click', () => {
        let textToCopy = '';
        if (currentMode === 'normal') {
            textToCopy = `Original: ${currentSymbol}${originalPrice.value} | Discount: ${discountPercent.value}% | Final: ${resPrimary.textContent} | Saved: ${resSaved.textContent}`;
        } else {
            textToCopy = `Original: ${currentSymbol}${originalPrice.value} | Final: ${currentSymbol}${finalPriceInput.value} | Discount: ${resPrimary.textContent} | Saved: ${resSaved.textContent}`;
        }
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyResultBtn.textContent;
            copyResultBtn.textContent = 'Copied!';
            setTimeout(() => copyResultBtn.textContent = originalText, 2000);
        }).catch(err => {
            alert('Failed to copy.');
        });
    });
});
