document.addEventListener('DOMContentLoaded', () => {
    const scoreInput = document.getElementById('scoreInput');
    const multiplierSelect = document.getElementById('multiplierSelect');
    const customMultiplierGroup = document.getElementById('customMultiplierGroup');
    const customMultiplierInput = document.getElementById('customMultiplierInput');
    const calculateBtn = document.getElementById('calculateBtn');
    const toggleModeBtn = document.getElementById('toggleModeBtn');
    const inputLabel = document.getElementById('inputLabel');
    const resultsSection = document.getElementById('resultsSection');
    const resultValue = document.getElementById('resultValue');
    const copyResultBtn = document.getElementById('copyResultBtn');

    let mode = 'cgpa_to_percent'; // or 'percent_to_cgpa'

    // Toggle custom multiplier input visibility
    multiplierSelect.addEventListener('change', () => {
        if (multiplierSelect.value === 'custom') {
            customMultiplierGroup.style.display = 'block';
            customMultiplierInput.focus();
        } else {
            customMultiplierGroup.style.display = 'none';
        }
    });

    // Toggle Mode
    toggleModeBtn.addEventListener('click', () => {
        if (mode === 'cgpa_to_percent') {
            mode = 'percent_to_cgpa';
            toggleModeBtn.textContent = 'Switch to: CGPA to Percentage';
            inputLabel.textContent = 'Enter Percentage';
            scoreInput.placeholder = 'e.g. 85.5';
        } else {
            mode = 'cgpa_to_percent';
            toggleModeBtn.textContent = 'Switch to: Percentage to CGPA';
            inputLabel.textContent = 'Enter CGPA';
            scoreInput.placeholder = 'e.g. 8.75';
        }
        resultsSection.style.display = 'none';
        scoreInput.value = '';
        scoreInput.focus();
    });

    // Calculate Logic
    calculateBtn.addEventListener('click', () => {
        const score = parseFloat(scoreInput.value);
        if (isNaN(score)) {
            if (typeof showToast === 'function') showToast('Please enter a valid number', 'error');
            return;
        }

        let multiplier = 9.5;
        if (multiplierSelect.value === 'custom') {
            multiplier = parseFloat(customMultiplierInput.value);
            if (isNaN(multiplier) || multiplier <= 0) {
                if (typeof showToast === 'function') showToast('Please enter a valid custom multiplier', 'error');
                return;
            }
        } else {
            multiplier = parseFloat(multiplierSelect.value);
        }

        let result = 0;
        let suffix = '';

        if (mode === 'cgpa_to_percent') {
            result = score * multiplier;
            if (result > 100) result = 100; // Cap at 100%
            suffix = '%';
        } else {
            result = score / multiplier;
            if (multiplierSelect.value !== 'custom' && multiplier === 10 && result > 10) result = 10;
            suffix = ' CGPA';
        }

        // Format to max 2 decimal places cleanly
        resultValue.textContent = (Math.round(result * 100) / 100) + suffix;
        resultsSection.style.display = 'block';
    });

    // Enter key support
    scoreInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') calculateBtn.click();
    });
    customMultiplierInput.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') calculateBtn.click();
    });

    // Copy Result
    copyResultBtn.addEventListener('click', () => {
        const text = resultValue.textContent;
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast('Result copied to clipboard!');
        }).catch(() => {
            if (typeof showToast === 'function') showToast('Failed to copy', 'error');
        });
    });
});
