document.addEventListener('DOMContentLoaded', () => {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const encodeBtn = document.getElementById('encodeBtn');
    const decodeBtn = document.getElementById('decodeBtn');
    const clearInputBtn = document.getElementById('clearInputBtn');
    const copyOutputBtn = document.getElementById('copyOutputBtn');
    const toastError = document.getElementById('toastError');
    
    function showToast(msg) {
        toastError.textContent = msg;
        toastError.style.display = 'block';
        setTimeout(() => toastError.style.display = 'none', 3000);
    }
    
    encodeBtn.addEventListener('click', () => {
        const text = inputText.value;
        if (!text) {
            outputText.value = '';
            return;
        }
        try {
            // Encode properly handling UTF-8 (emojis etc)
            const bytes = new TextEncoder().encode(text);
            const binary = Array.from(bytes, b => String.fromCharCode(b)).join('');
            outputText.value = btoa(binary);
        } catch (e) {
            showToast('Error encoding text.');
        }
    });
    
    decodeBtn.addEventListener('click', () => {
        const b64 = inputText.value.trim();
        if (!b64) {
            outputText.value = '';
            return;
        }
        try {
            // Decode properly handling UTF-8
            const binary = atob(b64);
            const bytes = Uint8Array.from(binary, c => c.charCodeAt(0));
            outputText.value = new TextDecoder().decode(bytes);
        } catch (e) {
            showToast('Invalid Base64 input.');
            outputText.value = '';
        }
    });
    
    clearInputBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        inputText.focus();
    });
    
    copyOutputBtn.addEventListener('click', () => {
        const textToCopy = outputText.value;
        if (!textToCopy) return;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyOutputBtn.textContent;
            copyOutputBtn.textContent = 'Copied!';
            setTimeout(() => copyOutputBtn.textContent = originalText, 2000);
        }).catch(err => {
            alert('Failed to copy.');
        });
    });
});
