document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const textOutput = document.getElementById('textOutput');
    const copyBtn = document.getElementById('copyBtn');
    const caseBtns = document.querySelectorAll('.case-btn');

    function convertCase(type) {
        const text = textInput.value;
        if (!text) return;
        
        let result = text;
        switch (type) {
            case 'upper':
                result = text.toUpperCase();
                break;
            case 'lower':
                result = text.toLowerCase();
                break;
            case 'title':
                result = text.toLowerCase().split(/\s+/).map(word => {
                    if (!word) return word;
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }).join(' ');
                // Preserve original newlines if possible by splitting on lines instead
                result = text.split('\n').map(line => 
                    line.toLowerCase().split(/\s+/).map(word => 
                        word ? word.charAt(0).toUpperCase() + word.slice(1) : ''
                    ).join(' ')
                ).join('\n');
                break;
            case 'sentence':
                result = text.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, c => c.toUpperCase());
                break;
            case 'camel':
                result = text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
                break;
            case 'snake':
                result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                       ?.map(x => x.toLowerCase()).join('_') || text;
                break;
            case 'kebab':
                result = text.match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
                       ?.map(x => x.toLowerCase()).join('-') || text;
                break;
        }
        textOutput.value = result;
    }

    caseBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const caseType = btn.getAttribute('data-case');
            convertCase(caseType);
        });
    });

    copyBtn.addEventListener('click', () => {
        const text = textOutput.value;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
            if (typeof showToast === 'function') showToast('Copied to clipboard!');
        }).catch(() => {
            if (typeof showToast === 'function') showToast('Failed to copy', 'error');
        });
    });
});
