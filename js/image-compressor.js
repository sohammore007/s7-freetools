document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const fileInput = document.getElementById('fileInput');
    const workspace = document.getElementById('workspace');
    
    const compressionWorkspace = document.getElementById('compressionWorkspace');
    const imagePreview = document.getElementById('imagePreview');
    const originalSizeEl = document.getElementById('originalSize');
    const compressedSizeEl = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('qualitySlider');
    const qualityValue = document.getElementById('qualityValue');
    const savingsBadge = document.getElementById('savingsBadge');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');

    let currentFile = null;
    let originalImageObj = new Image();

    // Event Listeners for Drag & Drop
    dropZone.addEventListener('click', () => fileInput.click());
    
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFile(e.target.files[0]);
        }
    });

    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (currentFile) {
            compressImage();
        }
    });

    resetBtn.addEventListener('click', () => {
        compressionWorkspace.style.display = 'none';
        dropZone.style.display = 'block';
        currentFile = null;
        fileInput.value = '';
    });

    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }

    function handleFile(file) {
        if (!file.type.match(/image\/(jpeg|png|webp)/)) {
            showToast('Please select a JPG, PNG, or WebP image.', 'error');
            return;
        }

        currentFile = file;
        originalSizeEl.textContent = formatBytes(file.size);
        
        const reader = new FileReader();
        reader.onload = (e) => {
            originalImageObj.src = e.target.result;
            originalImageObj.onload = () => {
                dropZone.style.display = 'none';
                compressionWorkspace.style.display = 'flex';
                compressImage();
            };
        };
        reader.readAsDataURL(file);
    }

    function compressImage() {
        
        downloadBtn.disabled = true;
        downloadBtn.innerHTML = '<span class="spinner"></span> Processing...';
        const quality = parseInt(qualitySlider.value) / 100;

        
        const canvas = document.createElement('canvas');
        canvas.width = originalImageObj.width;
        canvas.height = originalImageObj.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(originalImageObj, 0, 0);

        // Determine output type based on input (default to jpeg for compression)
        let outputType = 'image/jpeg';
        if (currentFile.type === 'image/png') {
            // Web browsers canvas implementation doesn't support PNG quality compression natively,
            // we convert PNGs to JPEG or WebP if they want smaller files, but let's stick to jpeg or keep original type if we use webp.
            // Actually, Canvas toDataURL supports image/jpeg and image/webp quality.
            // Let's use webp if original is png or webp for better transparency support, else jpeg.
            // To keep it simple and fulfill JPG/PNG requirement:
            outputType = 'image/jpeg'; 
            
            // Fill background with white just in case it was a transparent PNG converting to JPEG
            ctx.globalCompositeOperation = 'destination-over';
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Compress
        canvas.toBlob((blob) => {
            const compressedUrl = URL.createObjectURL(blob);
            imagePreview.src = compressedUrl;
            
            compressedSizeEl.textContent = formatBytes(blob.size);
            
            // Calculate savings
            const savedBytes = currentFile.size - blob.size;
            const savedPercent = Math.round((savedBytes / currentFile.size) * 100);
            
            if (savedPercent > 0) {
                savingsBadge.textContent = `Savings: ${savedPercent}% (${formatBytes(savedBytes)})`;
                savingsBadge.className = 'savings-badge';
            } else {
                savingsBadge.textContent = `File size increased! (${savedPercent}%)`;
                savingsBadge.className = 'savings-badge negative';
            }

            // Update download button
            
            downloadBtn.disabled = false;
            downloadBtn.innerHTML = 'Download Compressed Image';
            downloadBtn.onclick = () => {

                const a = document.createElement('a');
                a.href = compressedUrl;
                // create new filename
                const extension = outputType === 'image/jpeg' ? '.jpg' : '.png';
                const baseName = currentFile.name.substring(0, currentFile.name.lastIndexOf('.')) || 'image';
                a.download = `${baseName}-compressed${extension}`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            };
        }, outputType, quality);
    }
});
