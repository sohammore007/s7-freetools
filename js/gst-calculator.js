document.addEventListener('DOMContentLoaded', () => {
    const amountInput = document.getElementById('amountInput');
    const gstRateSelect = document.getElementById('gstRate');
    const customRateGroup = document.getElementById('customRateGroup');
    const customRateInput = document.getElementById('customRateInput');
    const calculateBtn = document.getElementById('calculateBtn');
    
    const resultsSection = document.getElementById('resultsSection');
    const resBase = document.getElementById('resBase');
    const resTotal = document.getElementById('resTotal');
    const resGst = document.getElementById('resGst');
    const resCgst = document.getElementById('resCgst');
    const resSgst = document.getElementById('resSgst');
    const lblCgstRate = document.getElementById('lblCgstRate');
    const lblSgstRate = document.getElementById('lblSgstRate');
    const copyResultBtn = document.getElementById('copyResultBtn');

    // Formatter for currency
    const formatCurrency = (amount) => {
        return Number(amount).toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 2 });
    };

    // Toggle custom rate input visibility
    gstRateSelect.addEventListener('change', () => {
        if (gstRateSelect.value === 'custom') {
            customRateGroup.style.display = 'block';
            customRateInput.focus();
        } else {
            customRateGroup.style.display = 'none';
        }
    });

    calculateBtn.addEventListener('click', () => {
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            if (typeof showToast === 'function') showToast('Please enter a valid amount', 'error');
            return;
        }

        let rate = 18;
        if (gstRateSelect.value === 'custom') {
            rate = parseFloat(customRateInput.value);
            if (isNaN(rate) || rate < 0) {
                if (typeof showToast === 'function') showToast('Please enter a valid custom GST rate', 'error');
                return;
            }
        } else {
            rate = parseFloat(gstRateSelect.value);
        }

        // Get Add or Remove mode
        const action = document.querySelector('input[name="gstAction"]:checked').value;
        
        let base = 0;
        let total = 0;
        let gst = 0;

        if (action === 'add') {
            // Exclusive: amount is base
            base = amount;
            gst = amount * (rate / 100);
            total = base + gst;
        } else {
            // Inclusive: amount is total
            total = amount;
            base = amount / (1 + (rate / 100));
            gst = total - base;
        }

        const halfGst = gst / 2;
        const halfRate = rate / 2;

        resBase.textContent = formatCurrency(base);
        resTotal.textContent = formatCurrency(total);
        resGst.textContent = formatCurrency(gst);
        resCgst.textContent = formatCurrency(halfGst);
        resSgst.textContent = formatCurrency(halfGst);
        
        // Format rate label to remove trailing zeros if int
        lblCgstRate.textContent = Number.isInteger(halfRate) ? halfRate : halfRate.toFixed(2);
        lblSgstRate.textContent = Number.isInteger(halfRate) ? halfRate : halfRate.toFixed(2);

        resultsSection.style.display = 'block';
    });

    // Enter key support
    amountInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') calculateBtn.click();
    });
    customRateInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') calculateBtn.click();
    });

    // Copy Result
    copyResultBtn.addEventListener('click', () => {
        const text = `GST Details:\nBase Amount: ${resBase.textContent}\nGST Amount: ${resGst.textContent}\nTotal Amount: ${resTotal.textContent}\nCGST (${lblCgstRate.textContent}%): ${resCgst.textContent}\nSGST (${lblSgstRate.textContent}%): ${resSgst.textContent}`;
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast('Result copied to clipboard!');
        }).catch(() => {
            if (typeof showToast === 'function') showToast('Failed to copy', 'error');
        });
    });
});
