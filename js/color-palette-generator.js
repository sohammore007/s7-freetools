document.addEventListener('DOMContentLoaded', () => {
    const paletteContainer = document.getElementById('paletteContainer');
    const generateBtn = document.getElementById('generateBtn');
    const toastCopied = document.getElementById('toastCopied');
    
    let colors = Array(5).fill({ hex: '#FFFFFF', locked: false });
    
    // HSL to HEX converter
    function hslToHex(h, s, l) {
        l /= 100;
        const a = s * Math.min(l, 1 - l) / 100;
        const f = n => {
            const k = (n + h / 30) % 12;
            const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
            return Math.round(255 * color).toString(16).padStart(2, '0');
        };
        return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
    }

    function generatePalette() {
        const baseHue = Math.floor(Math.random() * 360);
        // Offsets to create a nice palette (e.g., analogous/triadic mix)
        const offsets = [0, 30, 150, 180, 330];
        const s = Math.floor(Math.random() * 30) + 60; // 60-90%
        const l = Math.floor(Math.random() * 30) + 40; // 40-70%
        
        colors = colors.map((color, index) => {
            if (color.locked) return color;
            
            const h = (baseHue + offsets[index]) % 360;
            // slight variations for s and l to make it look organic
            const sVar = Math.min(100, Math.max(0, s + (Math.random() * 10 - 5)));
            const lVar = Math.min(100, Math.max(0, l + (Math.random() * 20 - 10)));
            
            return {
                hex: hslToHex(h, sVar, lVar),
                locked: false
            };
        });
        
        renderPalette();
    }

    function renderPalette() {
        paletteContainer.innerHTML = '';
        
        colors.forEach((color, index) => {
            const swatch = document.createElement('div');
            swatch.className = 'color-swatch';
            swatch.style.backgroundColor = color.hex;
            
            const controls = document.createElement('div');
            controls.className = 'swatch-controls';
            
            const hexBtn = document.createElement('button');
            hexBtn.className = 'swatch-hex';
            hexBtn.textContent = color.hex;
            hexBtn.title = "Click to copy";
            hexBtn.onclick = (e) => {
                e.stopPropagation();
                copyToClipboard(color.hex);
            };
            
            const lockBtn = document.createElement('button');
            lockBtn.className = `swatch-lock ${color.locked ? 'locked' : ''}`;
            lockBtn.innerHTML = color.locked 
                ? '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12,17A2,2 0 0,0 14,15C14,13.89 13.1,13 12,13A2,2 0 0,0 10,15A2,2 0 0,0 12,17M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/></svg>'
                : '<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10C4,8.89 4.9,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3M18,10H6V20H18V10Z"/></svg>';
            lockBtn.onclick = (e) => {
                e.stopPropagation();
                toggleLock(index);
            };
            
            controls.appendChild(hexBtn);
            controls.appendChild(lockBtn);
            swatch.appendChild(controls);
            paletteContainer.appendChild(swatch);
        });
    }

    function toggleLock(index) {
        colors[index].locked = !colors[index].locked;
        renderPalette();
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            toastCopied.style.display = 'block';
            setTimeout(() => {
                toastCopied.style.display = 'none';
            }, 2000);
        }).catch(err => {
            alert('Failed to copy');
        });
    }

    generateBtn.addEventListener('click', generatePalette);
    
    // Spacebar to generate
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
            e.preventDefault();
            generatePalette();
        }
    });

    // Initial generation
    generatePalette();
});
