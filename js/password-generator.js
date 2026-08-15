document.addEventListener('DOMContentLoaded', () => {
    const pwdOutput = document.getElementById('pwdResult');
    const copyPwdBtn = document.getElementById('copyPwdBtn');
    const pwdLength = document.getElementById('pwdLength');
    const pwdLengthValue = document.getElementById('pwdLengthValue');
    const generateBtn = document.getElementById('generateBtn');
    
    const chkUpper = document.getElementById('chkUpper');
    const chkLower = document.getElementById('chkLower');
    const chkNumbers = document.getElementById('chkNumbers');
    const chkSymbols = document.getElementById('chkSymbols');
    
    const bar1 = document.getElementById('bar1');
    const bar2 = document.getElementById('bar2');
    const bar3 = document.getElementById('bar3');
    const bar4 = document.getElementById('bar4');
    const strengthText = document.getElementById('strengthText');

    const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
    const NUMBERS = '0123456789';
    const SYMBOLS = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    function calculateStrength(pwd, poolSize) {
        if (!pwd) return;
        // Calculate entropy
        const entropy = pwd.length * Math.log2(poolSize || 1);
        
        // Reset bars
        [bar1, bar2, bar3, bar4].forEach(b => b.style.backgroundColor = 'var(--border-color)');
        
        let color = '';
        let text = '';
        
        if (entropy < 40) {
            color = '#ef4444'; // Red
            text = 'Weak';
            bar1.style.backgroundColor = color;
        } else if (entropy < 60) {
            color = '#f59e0b'; // Orange
            text = 'Medium';
            bar1.style.backgroundColor = color;
            bar2.style.backgroundColor = color;
        } else if (entropy < 80) {
            color = '#10b981'; // Green
            text = 'Strong';
            bar1.style.backgroundColor = color;
            bar2.style.backgroundColor = color;
            bar3.style.backgroundColor = color;
        } else {
            color = '#059669'; // Dark Green
            text = 'Very Strong';
            bar1.style.backgroundColor = color;
            bar2.style.backgroundColor = color;
            bar3.style.backgroundColor = color;
            bar4.style.backgroundColor = color;
        }
        
        strengthText.textContent = text;
        strengthText.style.color = color;
    }

    function generatePassword() {
        let charset = '';
        if (chkUpper.checked) charset += UPPERCASE;
        if (chkLower.checked) charset += LOWERCASE;
        if (chkNumbers.checked) charset += NUMBERS;
        if (chkSymbols.checked) charset += SYMBOLS;

        if (charset === '') {
            if(typeof showToast === 'function') showToast('Please select at least one character type', 'error');
            pwdOutput.textContent = '';
            calculateStrength('', 1);
            return;
        }

        const length = parseInt(pwdLength.value);
        let password = '';
        
        // Use Crypto API for secure randomness
        const randomValues = new Uint32Array(length);
        window.crypto.getRandomValues(randomValues);

        for (let i = 0; i < length; i++) {
            password += charset[randomValues[i] % charset.length];
        }

        pwdOutput.textContent = password;
        calculateStrength(password, charset.length);
    }

    pwdLength.addEventListener('input', (e) => {
        pwdLengthValue.textContent = e.target.value;
        generatePassword();
    });

    [chkUpper, chkLower, chkNumbers, chkSymbols].forEach(chk => {
        chk.addEventListener('change', generatePassword);
    });

    generateBtn.addEventListener('click', generatePassword);

    copyPwdBtn.addEventListener('click', () => {
        const text = pwdOutput.textContent;
        if (text && text !== 'Click Generate') {
            navigator.clipboard.writeText(text).then(() => {
                if(typeof showToast === 'function') showToast('Password copied to clipboard!');
            });
        }
    });

    // Generate initially
    generatePassword();
});
