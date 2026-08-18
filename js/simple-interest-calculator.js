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
            if (resultsSection.style.display === 'block') calculate();
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
    
    calculateBtn.addEventListener('click', calculate);
    
    copyResultBtn.addEventListener('click', () => {
        const textToCopy = `Principal: ${currentSymbol}${principalInput.value} | Rate: ${rateInput.value}% | Time: ${timeInput.value} Years | Interest: ${resInterest.textContent} | Total: ${resTotal.textContent}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalHTML = copyResultBtn.innerHTML;
            copyResultBtn.innerHTML = '<span style="font-size:0.8rem; font-weight:bold; color:var(--primary-color);">Copied!</span>';
            setTimeout(() => copyResultBtn.innerHTML = originalHTML, 2000);
        }).catch(err => {
            if (typeof showToast === 'function') showToast('Failed to copy', 'error');
            else alert('Failed to copy.');
        });
    });
});
