document.addEventListener('DOMContentLoaded', () => {
    const unitRadios = document.getElementsByName('bmiUnit');
    const metricInputs = document.getElementById('metricInputs');
    const imperialInputs = document.getElementById('imperialInputs');
    
    const heightCm = document.getElementById('heightCm');
    const weightKg = document.getElementById('weightKg');
    
    const heightFt = document.getElementById('heightFt');
    const heightIn = document.getElementById('heightIn');
    const weightLb = document.getElementById('weightLb');
    
    const calculateBtn = document.getElementById('calculateBtn');
    const resultBox = document.getElementById('resultBox');
    const bmiValueEl = document.getElementById('bmiValue');
    const bmiCategoryEl = document.getElementById('bmiCategory');
    const bmiMarker = document.getElementById('bmiMarker');

    // Toggle units
    unitRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'metric') {
                metricInputs.style.display = 'block';
                imperialInputs.style.display = 'none';
            } else {
                metricInputs.style.display = 'none';
                imperialInputs.style.display = 'flex';
                imperialInputs.style.flexDirection = 'column';
            }
            resultBox.style.display = 'none';
        });
    });

    calculateBtn.addEventListener('click', () => {
        let bmi = 0;
        const isMetric = document.getElementById('unitMetric').checked;

        if (isMetric) {
            const h = parseFloat(heightCm.value) / 100; // to meters
            const w = parseFloat(weightKg.value);
            if (!h || !w || h <= 0 || w <= 0) {
                if (typeof showToast === 'function') showToast('Please enter valid height and weight', 'error');
                return;
            }
            bmi = w / (h * h);
        } else {
            const ft = parseFloat(heightFt.value) || 0;
            const ins = parseFloat(heightIn.value) || 0;
            const w = parseFloat(weightLb.value);
            
            const totalInches = (ft * 12) + ins;
            if (totalInches <= 0 || !w || w <= 0) {
                if (typeof showToast === 'function') showToast('Please enter valid height and weight', 'error');
                return;
            }
            bmi = (w / (totalInches * totalInches)) * 703;
        }

        displayResult(bmi);
    });

    function displayResult(bmi) {
        bmi = Math.round(bmi * 10) / 10;
        bmiValueEl.textContent = bmi;
        
        let category = '';
        let color = '';
        
        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#3b82f6'; // Blue
        } else if (bmi < 25) {
            category = 'Normal Weight';
            color = '#10b981'; // Green
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#f59e0b'; // Orange
        } else {
            category = 'Obese';
            color = '#ef4444'; // Red
        }

        bmiCategoryEl.textContent = category;
        bmiCategoryEl.style.color = color;
        
        // Position the marker
        // Scale representation:
        // Underweight (< 18.5): 0 - 24%
        // Normal (18.5 - 24.9): 24% - 50%
        // Overweight (25 - 29.9): 50% - 75%
        // Obese (30+): 75% - 100%
        let position = 0;
        
        if (bmi < 18.5) {
            // Map 10-18.5 to 0-24%
            position = Math.max(0, (bmi - 10) / 8.5 * 24);
        } else if (bmi < 25) {
            // Map 18.5-25 to 24-50%
            position = 24 + ((bmi - 18.5) / 6.5 * 26);
        } else if (bmi < 30) {
            // Map 25-30 to 50-75%
            position = 50 + ((bmi - 25) / 5 * 25);
        } else {
            // Map 30-40 to 75-100%
            position = Math.min(100, 75 + ((bmi - 30) / 10 * 25));
        }

        bmiMarker.style.left = `${position}%`;
        resultBox.style.display = 'block';
    }
});
