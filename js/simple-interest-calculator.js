document.addEventListener('DOMContentLoaded', () => {
    const principalInput = document.getElementById('principalInput');
    const rateInput = document.getElementById('rateInput');
    const timeInput = document.getElementById('timeInput');
    
    const resInterest = document.getElementById('resInterest');
    const resTotal = document.getElementById('resTotal');
    const resultsSection = document.getElementById('resultsSection');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const copyResultBtn = document.getElementById('copyResultBtn');
    
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
        const p = parseFloat(principalInput.value);
        const r = parseFloat(rateInput.value);
        const t = parseFloat(timeInput.value);
        
        if (isNaN(p) || p < 0 || isNaN(r) || r < 0 || isNaN(t) || t < 0) {
            resultsSection.style.display = 'none';
            return;
        }
        
        const interest = (p * r * t) / 100;
        const total = p + interest;
        
        resInterest.textContent = formatMoney(interest);
        resTotal.textContent = formatMoney(total);
        resultsSection.style.display = 'block';
    }
    
    principalInput.addEventListener('input', calculate);
    rateInput.addEventListener('input', calculate);
    timeInput.addEventListener('input', calculate);
    calculateBtn.addEventListener('click', calculate);
    
    // Call calculate on load to process any browser-restored input values and the saved currency symbol
    calculate();
    
    copyResultBtn.addEventListener('click', () => {
        const textToCopy = `Principal: ${currentSymbol}${principalInput.value} | Rate: ${rateInput.value}% | Time: ${timeInput.value} Years | Interest: ${resInterest.textContent} | Total: ${resTotal.textContent}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyResultBtn.textContent;
            copyResultBtn.textContent = 'Copied!';
            setTimeout(() => copyResultBtn.textContent = originalText, 2000);
        }).catch(err => {
            alert('Failed to copy.');
        });
    });
});
