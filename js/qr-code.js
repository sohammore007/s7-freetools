document.addEventListener('DOMContentLoaded', () => {
    const qrInput = document.getElementById('qrInput');
    const generateBtn = document.getElementById('generateBtn');
    const qrCanvas = document.getElementById('qrCanvas');
    const qrPlaceholder = document.getElementById('qrPlaceholder');
    const downloadBtn = document.getElementById('downloadBtn');

    function generateQR() {
        const text = qrInput.value.trim();
        if (!text) {
            if (typeof showToast === 'function') {
                showToast('Please enter some text or a URL', 'error');
            } else {
                alert('Please enter some text or a URL');
            }
            return;
        }

        try {
            // Generate QR Code using the qrcodegen library
            const QRC = qrcodegen.QrCode;
            // Encode the text with Medium error correction
            const qr = QRC.encodeText(text, QRC.Ecc.MEDIUM);
            
            // Draw to canvas
            const scale = 8; // pixels per module
            const border = 4; // standard 4-module quiet zone
            
            qrCanvas.width = (qr.size + border * 2) * scale;
            qrCanvas.height = (qr.size + border * 2) * scale;
            
            const ctx = qrCanvas.getContext('2d');
            
            // Draw white background
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);
            
            // Draw black modules
            ctx.fillStyle = '#000000';
            for (let y = 0; y < qr.size; y++) {
                for (let x = 0; x < qr.size; x++) {
                    if (qr.getModule(x, y)) {
                        ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
                    }
                }
            }

            // Update UI
            qrPlaceholder.style.display = 'none';
            qrCanvas.style.display = 'block';
            downloadBtn.style.display = 'block';
            
            if (typeof showToast === 'function') showToast('QR Code generated!');

        } catch (error) {
            console.error(error);
            if (typeof showToast === 'function') {
                showToast('Failed to generate QR code', 'error');
            }
        }
    }

    generateBtn.addEventListener('click', generateQR);

    // Also support Ctrl+Enter
    qrInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            generateQR();
        }
    });

    downloadBtn.addEventListener('click', () => {
        qrCanvas.toBlob((blob) => {
            if (!blob) {
                if (typeof showToast === 'function') showToast('Failed to generate image', 'error');
                return;
            }
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'freetools-qrcode.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            if (typeof showToast === 'function') showToast('Downloaded successfully!');
        }, 'image/png');
    });
});
