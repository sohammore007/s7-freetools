document.addEventListener('DOMContentLoaded', () => {
    const textInput = document.getElementById('textInput');
    const clearBtn = document.getElementById('clearBtn');
    
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');
    const charNoSpaceCountEl = document.getElementById('charNoSpaceCount');
    const sentenceCountEl = document.getElementById('sentenceCount');
    const paragraphCountEl = document.getElementById('paragraphCount');
    const readingTimeEl = document.getElementById('readingTime');

    function updateStats() {
        const text = textInput.value;
        
        // Character count (with spaces)
        const charCount = text.length;
        charCountEl.textContent = charCount;
        
        // Character count (no spaces)
        const charNoSpaceCount = text.replace(/\s+/g, '').length;
        charNoSpaceCountEl.textContent = charNoSpaceCount;
        
        if (charCount === 0) {
            wordCountEl.textContent = '0';
            sentenceCountEl.textContent = '0';
            paragraphCountEl.textContent = '0';
            readingTimeEl.textContent = '0m';
            return;
        }

        // Word count
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const wordCount = words.length;
        wordCountEl.textContent = wordCount;
        
        // Sentence count (split by punctuation ., !, ?)
        const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
        sentenceCountEl.textContent = sentences.length;
        
        // Paragraph count (split by newlines)
        const paragraphs = text.split(/\n+/).filter(para => para.trim().length > 0);
        paragraphCountEl.textContent = paragraphs.length;
        
        // Reading time (200 words per minute)
        const minutes = Math.ceil(wordCount / 200);
        if (minutes < 1) {
            readingTimeEl.textContent = '< 1m';
        } else {
            readingTimeEl.textContent = `${minutes}m`;
        }
    }

    textInput.addEventListener('input', updateStats);
    
    
    const copyStatsBtn = document.getElementById('copyStatsBtn');
    if (copyStatsBtn) {
        copyStatsBtn.addEventListener('click', () => {
            const summary = `Word Count: ${wordCountEl.textContent}
Characters (spaces): ${charCountEl.textContent}
Characters (no spaces): ${charNoSpaceCountEl.textContent}
Sentences: ${sentenceCountEl.textContent}
Paragraphs: ${paragraphCountEl.textContent}
Reading Time: ${readingTimeEl.textContent}`;
            navigator.clipboard.writeText(summary).then(() => {
                showToast('Copied to clipboard!');
            }).catch(() => {
                showToast('Failed to copy', 'error');
            });
        });
    }

    clearBtn.addEventListener('click', () => {
        textInput.value = '';
        updateStats();
        textInput.focus();
    });
});
