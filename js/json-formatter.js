document.addEventListener('DOMContentLoaded', () => {
    const jsonInput = document.getElementById('jsonInput');
    const jsonOutput = document.getElementById('jsonOutput');
    const formatBtn = document.getElementById('formatBtn');
    const minifyBtn = document.getElementById('minifyBtn');
    const copyBtn = document.getElementById('copyBtn');

    function processJson(action) {
        const raw = jsonInput.value.trim();
        if (!raw) {
            if (typeof showToast === 'function') showToast('Please enter some JSON first', 'error');
            return;
        }

        try {
            const parsed = JSON.parse(raw);
            let result = '';
            
            if (action === 'format') {
                result = JSON.stringify(parsed, null, 2);
            } else if (action === 'minify') {
                result = JSON.stringify(parsed);
            }
            
            jsonOutput.value = result;
            if (typeof showToast === 'function') showToast(`JSON ${action}ted successfully!`);
        } catch (e) {
            jsonOutput.value = '';
            if (typeof showToast === 'function') {
                // Show a clean error toast with the parse error details
                showToast(`Invalid JSON: ${e.message}`, 'error');
            }
        }
    }

    formatBtn.addEventListener('click', () => processJson('format'));
    minifyBtn.addEventListener('click', () => processJson('minify'));

    copyBtn.addEventListener('click', () => {
        const text = jsonOutput.value;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast('Copied to clipboard!');
        }).catch(() => {
            if (typeof showToast === 'function') showToast('Failed to copy', 'error');
        });
    });
});
