document.addEventListener('DOMContentLoaded', () => {
    const categorySelect = document.getElementById('categorySelect');
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    const inputVal = document.getElementById('inputVal');
    const outputVal = document.getElementById('outputVal');

    const units = {
        length: {
            cm: { name: 'Centimeters', toBase: 0.01 },
            m: { name: 'Meters', toBase: 1 },
            km: { name: 'Kilometers', toBase: 1000 },
            inch: { name: 'Inches', toBase: 0.0254 },
            feet: { name: 'Feet', toBase: 0.3048 },
            mile: { name: 'Miles', toBase: 1609.344 }
        },
        weight: {
            g: { name: 'Grams', toBase: 0.001 },
            kg: { name: 'Kilograms', toBase: 1 },
            lb: { name: 'Pounds', toBase: 0.45359237 },
            oz: { name: 'Ounces', toBase: 0.0283495231 }
        },
        temperature: {
            celsius: { name: 'Celsius' },
            fahrenheit: { name: 'Fahrenheit' },
            kelvin: { name: 'Kelvin' }
        }
    };

    function populateUnits() {
        const category = categorySelect.value;
        const opts = units[category];
        
        fromUnit.innerHTML = '';
        toUnit.innerHTML = '';
        
        let first = null;
        let second = null;
        let count = 0;
        
        for (const [key, val] of Object.entries(opts)) {
            const opt1 = document.createElement('option');
            opt1.value = key;
            opt1.textContent = val.name;
            fromUnit.appendChild(opt1);

            const opt2 = document.createElement('option');
            opt2.value = key;
            opt2.textContent = val.name;
            toUnit.appendChild(opt2);
            
            if (count === 0) first = key;
            if (count === 1) second = key;
            count++;
        }
        
        // Set distinct defaults
        fromUnit.value = first;
        toUnit.value = second || first;
        
        convert();
    }

    function convert() {
        const category = categorySelect.value;
        const from = fromUnit.value;
        const to = toUnit.value;
        const val = parseFloat(inputVal.value);
        
        if (isNaN(val)) {
            outputVal.value = '';
            return;
        }

        let result = 0;

        if (category === 'temperature') {
            // Convert to Celsius first
            let c = 0;
            if (from === 'celsius') c = val;
            else if (from === 'fahrenheit') c = (val - 32) * 5/9;
            else if (from === 'kelvin') c = val - 273.15;

            // Convert from Celsius to Target
            if (to === 'celsius') result = c;
            else if (to === 'fahrenheit') result = (c * 9/5) + 32;
            else if (to === 'kelvin') result = c + 273.15;
            
        } else {
            // Multiplicative conversions
            const toBase = units[category][from].toBase;
            const fromBase = units[category][to].toBase;
            
            // Value in base unit (meters or kg)
            const baseVal = val * toBase;
            
            // Base to target
            result = baseVal / fromBase;
        }

        // Format to prevent crazy floating point issues, max 6 decimals
        outputVal.value = parseFloat(result.toFixed(6));
    }

    categorySelect.addEventListener('change', populateUnits);
    fromUnit.addEventListener('change', convert);
    toUnit.addEventListener('change', convert);
    inputVal.addEventListener('input', convert);

    // Initial setup
    populateUnits();
});
