document.addEventListener('DOMContentLoaded', () => {
    const loanAmountInput = document.getElementById('loanAmount');
    const interestRateInput = document.getElementById('interestRate');
    const loanTenureInput = document.getElementById('loanTenure');
    const tenureTypeSelect = document.getElementById('tenureType');
    const calculateBtn = document.getElementById('calculateBtn');
    
    const resultsSection = document.getElementById('resultsSection');
    const monthlyEmiDisplay = document.getElementById('monthlyEmi');
    const totalInterestDisplay = document.getElementById('totalInterest');
    const totalPaymentDisplay = document.getElementById('totalPayment');
    const copyResultBtn = document.getElementById('copyResultBtn');

    const lblPrincipal = document.getElementById('lblPrincipal');
    const lblInterest = document.getElementById('lblInterest');
    const barPrincipal = document.getElementById('barPrincipal');
    const barInterest = document.getElementById('barInterest');

    // Formatter for currency
    const formatCurrency = (amount) => {
        return Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    };

    calculateBtn.addEventListener('click', () => {
        const principal = parseFloat(loanAmountInput.value);
        const annualRate = parseFloat(interestRateInput.value);
        let tenure = parseFloat(loanTenureInput.value);

        if (isNaN(principal) || isNaN(annualRate) || isNaN(tenure) || principal <= 0 || annualRate <= 0 || tenure <= 0) {
            if (typeof showToast === 'function') showToast('Please enter valid positive numbers for all fields.', 'error');
            return;
        }

        // Convert tenure to months if it's in years
        if (tenureTypeSelect.value === 'years') {
            tenure = tenure * 12;
        }

        // EMI Formula: P x r x (1+r)^n / ((1+r)^n - 1)
        const monthlyRate = (annualRate / 12) / 100;
        
        let emi = 0;
        let totalPayment = 0;
        let totalInterest = 0;

        // Calculate
        emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) / (Math.pow(1 + monthlyRate, tenure) - 1);
        totalPayment = emi * tenure;
        totalInterest = totalPayment - principal;

        // Render
        monthlyEmiDisplay.textContent = formatCurrency(emi);
        totalPaymentDisplay.textContent = formatCurrency(totalPayment);
        totalInterestDisplay.textContent = formatCurrency(totalInterest);

        // Render Bar
        const principalPercent = (principal / totalPayment) * 100;
        const interestPercent = (totalInterest / totalPayment) * 100;

        barPrincipal.style.width = `${principalPercent}%`;
        barInterest.style.width = `${interestPercent}%`;
        lblPrincipal.textContent = `${Math.round(principalPercent)}%`;
        lblInterest.textContent = `${Math.round(interestPercent)}%`;

        resultsSection.style.display = 'block';
    });

    // Enter key support
    [loanAmountInput, interestRateInput, loanTenureInput].forEach(input => {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') calculateBtn.click();
        });
    });

    // Copy Result
    copyResultBtn.addEventListener('click', () => {
        const text = `Loan EMI Details:\nMonthly EMI: ${monthlyEmiDisplay.textContent}\nTotal Interest: ${totalInterestDisplay.textContent}\nTotal Payment: ${totalPaymentDisplay.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast('Result copied to clipboard!');
        }).catch(() => {
            if (typeof showToast === 'function') showToast('Failed to copy', 'error');
        });
    });
});
