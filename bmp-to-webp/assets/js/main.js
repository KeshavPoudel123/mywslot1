/**
 * BMP to WebP Converter - Image Processing Tool
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tool content
    initializeConverter();
    
    // Initialize the about content
    initializeAboutContent();
    
    // Initialize similar tools
    initializeSimilarTools();
});

/**
 * Initialize the BMP to WebP converter tool
 */
function initializeConverter() {
    const toolMainContent = document.getElementById('tool-main-content');
    
    // Create the converter HTML
    const converterHTML = `
        <div class="converter-app">
            <div class="upload-container" id="uploadContainer">
                <p><i class="fas fa-cloud-upload-alt" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);"></i></p>
                <p>Drag & Drop your BMP image here or</p>
                <button type="button" class="upload-btn" id="uploadBtn">
                    <i class="fas fa-file-image"></i> Choose File
                </button>
                <input type="file" id="fileInput" accept=".bmp" class="hidden" aria-label="Upload BMP Image" title="Upload BMP Image">
                <p class="file-info">Supports: BMP (Windows Bitmap)</p>
            </div>

            <div class="controls hidden" id="controls">
                <div class="control-group">
                    <label for="quality">WebP Quality: <span id="qualityValue">80</span>%</label>
                    <input type="range" id="quality" class="quality-slider" min="1" max="100" value="80">
                    <p class="file-info">Higher quality = larger file size. Lower quality = smaller file size.</p>
                </div>
                <div class="control-group">
                    <label for="lossless">
                        <input type="checkbox" id="lossless"> Use lossless compression
                    </label>
                    <p class="file-info">Lossless compression preserves all image data but results in larger files.</p>
                </div>
                <div class="control-group">
                    <label for="preserveTransparency">
                        <input type="checkbox" id="preserveTransparency" checked> Preserve transparency
                    </label>
                    <p class="file-info">WebP supports alpha channel transparency for partially transparent areas.</p>
                </div>
            </div>

            <div class="preview-container hidden" id="previewContainer">
                <h2 class="preview-heading">Image Preview</h2>
                <div class="preview-images">
                    <div class="preview-box">
                        <h3>Original BMP Image</h3>
                        <div class="image-container">
                            <img id="originalPreview" src="" alt="Original BMP image preview">
                        </div>
                        <div class="info" id="originalInfo"></div>
                    </div>
                    <div class="preview-box">
                        <h3>Converted WebP Image</h3>
                        <div class="image-container">
                            <img id="convertedPreview" src="" alt="Converted WebP image preview">
                        </div>
                        <div class="info" id="convertedInfo"></div>
                    </div>
                </div>
                <div class="buttons">
                    <button type="button" class="convert-btn" id="convertBtn">
                        <i class="fas fa-sync-alt"></i> Convert to WebP
                    </button>
                    <button type="button" class="download-btn hidden" id="downloadBtn">
                        <i class="fas fa-download"></i> Download WebP
                    </button>
                </div>
            </div>

            <div class="loading hidden" id="loading">
                <div class="spinner"></div>
                <p>Converting image...</p>
            </div>

            <div class="error-message hidden" id="errorMessage"></div>
        </div>
    `;
    
    // Insert the HTML into the tool main content
    toolMainContent.innerHTML = converterHTML;
    
    // Initialize the converter functionality
    initConverterFunctionality();
}

/**
 * Initialize the converter functionality
 */
function initConverterFunctionality() {
    // DOM Elements
    const uploadContainer = document.getElementById('uploadContainer');
    const uploadBtn = document.getElementById('uploadBtn');
    const fileInput = document.getElementById('fileInput');
    const controls = document.getElementById('controls');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const lossless = document.getElementById('lossless');
    const preserveTransparency = document.getElementById('preserveTransparency');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const convertedPreview = document.getElementById('convertedPreview');
    const originalInfo = document.getElementById('originalInfo');
    const convertedInfo = document.getElementById('convertedInfo');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    // Variables
    let originalImage = null;
    let originalImageName = '';
    let convertedImageUrl = '';

    // Event Listeners
    uploadContainer.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadContainer.classList.add('active');
    });

    uploadContainer.addEventListener('dragleave', () => {
        uploadContainer.classList.remove('active');
    });

    uploadContainer.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadContainer.classList.remove('active');
        
        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });

    quality.addEventListener('input', () => {
        qualityValue.textContent = quality.value;
    });

    lossless.addEventListener('change', () => {
        // If lossless is checked, disable quality slider
        if (lossless.checked) {
            quality.disabled = true;
            quality.parentElement.classList.add('disabled');
        } else {
            quality.disabled = false;
            quality.parentElement.classList.remove('disabled');
        }
    });

    convertBtn.addEventListener('click', convertImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function handleFileUpload(file) {
        // Check if file is a BMP
        if (!file.type.match('image/bmp') && !file.name.toLowerCase().endsWith('.bmp')) {
            showNotification('Please select a BMP image.', 'error');
            return;
        }

        hideError();
        
        // Store original image information
        originalImageName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Create an image element to get dimensions
            const img = new Image();
            img.onload = () => {
                // Store the original image
                originalImage = img;
                
                // Set original preview
                originalPreview.src = e.target.result;
                
                // Display original image info
                originalInfo.textContent = `${file.name} (${formatFileSize(file.size)}, ${img.width}×${img.height} px)`;
                
                // Show controls and preview
                controls.classList.remove('hidden');
                previewContainer.classList.remove('hidden');
                
                // Show success notification
                showNotification('BMP image uploaded successfully!', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertImage() {
        if (!originalImage) {
            showNotification('Please upload a BMP image first.', 'error');
            return;
        }

        // Show loading indicator
        loading.classList.remove('hidden');
        
        // Hide download button while converting
        downloadBtn.classList.add('hidden');

        // Get quality value and options
        const qualityVal = parseInt(quality.value) / 100;
        const isLossless = lossless.checked;
        const keepTransparency = preserveTransparency.checked;

        // Use setTimeout to allow the UI to update before the conversion starts
        setTimeout(() => {
            try {
                // Create canvas for conversion
                const canvas = document.createElement('canvas');
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                
                // Draw the image on the canvas
                const ctx = canvas.getContext('2d');
                
                // Clear canvas with transparent background if preserving transparency
                if (keepTransparency) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    // Fill with white background if not preserving transparency
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                // Draw the BMP image on top
                ctx.drawImage(originalImage, 0, 0);
                
                // Check if browser supports WebP
                if (typeof canvas.toBlob === 'function') {
                    // For browsers that support WebP
                    const options = {
                        quality: isLossless ? 1 : qualityVal,
                        lossless: isLossless,
                        alpha: keepTransparency
                    };
                    
                    // Convert to WebP if supported
                    if (hasWebPSupport()) {
                        canvas.toBlob(blob => {
                            handleConvertedBlob(blob);
                        }, 'image/webp', options);
                    } else {
                        // Fallback to PNG for browsers without WebP support
                        canvas.toBlob(blob => {
                            handleConvertedBlob(blob);
                            showNotification('Your browser does not support WebP. Converted to PNG instead.', 'warning');
                        }, 'image/png');
                    }
                } else {
                    // Fallback for older browsers
                    const dataURL = canvas.toDataURL('image/png');
                    const blob = dataURItoBlob(dataURL);
                    handleConvertedBlob(blob);
                    showNotification('Your browser does not fully support WebP. Converted to PNG instead.', 'warning');
                }
            } catch (error) {
                loading.classList.add('hidden');
                showNotification('Error converting image: ' + error.message, 'error');
            }
        }, 100);
    }

    function handleConvertedBlob(blob) {
        // Create object URL for the blob
        const url = URL.createObjectURL(blob);
        
        // Store the converted image URL for download
        convertedImageUrl = url;
        
        // Set converted preview
        convertedPreview.src = url;
        
        // Update converted info
        convertedInfo.textContent = `Converted to WebP (${formatFileSize(blob.size)}, ${originalImage.width}×${originalImage.height} px)`;
        
        // Hide loading indicator
        loading.classList.add('hidden');
        
        // Show download button
        downloadBtn.classList.remove('hidden');
        
        // Show success notification
        showNotification('Image converted to WebP successfully!', 'success');
        
        // Scroll to preview
        previewContainer.scrollIntoView({ behavior: 'smooth' });
    }

    function downloadImage() {
        if (!convertedImageUrl) {
            showNotification('Please convert an image first.', 'error');
            return;
        }
        
        // Create a link element
        const link = document.createElement('a');
        
        // Set download name with original filename and new extension
        const filename = originalImageName.substring(0, originalImageName.lastIndexOf('.')) + '.webp';
        
        link.download = filename;
        link.href = convertedImageUrl;
        link.click();
        
        // Show success notification
        showNotification('WebP image downloaded successfully!', 'success');
    }

    function formatFileSize(bytes) {
        if (bytes < 1024) return bytes + ' bytes';
        else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
        else return (bytes / 1048576).toFixed(1) + ' MB';
    }

    function hasWebPSupport() {
        // Simple check for WebP support
        const canvas = document.createElement('canvas');
        if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
            return true;
        }
        return false;
    }

    function dataURItoBlob(dataURI) {
        // Convert base64 to raw binary data held in a string
        const byteString = atob(dataURI.split(',')[1]);
        
        // Separate out the mime component
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        
        // Write the bytes of the string to an ArrayBuffer
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        
        // Create a blob with the ArrayBuffer
        return new Blob([ab], {type: mimeString});
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function hideError() {
        errorMessage.classList.add('hidden');
    }
}

/**
 * Initialize the about content section
 */
function initializeAboutContent() {
    const aboutContent = document.getElementById('about-content');
    
    // Create the about content HTML
    const aboutHTML = `
        <div class="content-intro">
            <p class="highlight-text">BMP to WebP conversion transforms uncompressed bitmap images into the modern WebP format. This conversion is particularly useful for drastically reducing file size while maintaining excellent image quality and supporting transparency.</p>
        </div>
        
        <h3 class="section-title">Understanding BMP and WebP Formats</h3>
        
        <div class="format-info-grid">
            <div class="format-box">
                <h3>BMP (Bitmap)</h3>
                <p>BMP is an uncompressed raster graphics image file format used to store bitmap digital images, independently of the display device.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created by Microsoft for Windows</p>
                    <p><strong>File Extension:</strong> .bmp</p>
                    <p><strong>Color Depth:</strong> 1-bit to 32-bit</p>
                    <p><strong>Compression:</strong> None or RLE (rarely used)</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Lossless quality (no compression artifacts)</li>
                            <li>Simple format, widely supported</li>
                            <li>No patent restrictions</li>
                            <li>Supports various color depths</li>
                            <li>Good for pixel-perfect editing</li>
                            <li>Stores exact color information</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Very large file sizes</li>
                            <li>Inefficient for web use</li>
                            <li>No transparency support in most implementations</li>
                            <li>Limited metadata support</li>
                            <li>Not ideal for sharing or online use</li>
                            <li>Slow to load due to size</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Raw image data, temporary storage during editing, screenshots in Windows, situations where file size is not a concern</p>
            </div>
            
            <div class="format-box">
                <h3>WebP</h3>
                <p>WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created by Google in 2010</p>
                    <p><strong>File Extension:</strong> .webp</p>
                    <p><strong>Color Depth:</strong> 24-bit (16.7 million colors)</p>
                    <p><strong>Compression:</strong> Both lossy and lossless</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Smaller file size than JPG, PNG, and GIF</li>
                            <li>Supports both lossy and lossless compression</li>
                            <li>Full alpha channel transparency</li>
                            <li>Animation support</li>
                            <li>Excellent for web optimization</li>
                            <li>Better quality-to-size ratio than other formats</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Not universally supported in older browsers</li>
                            <li>Limited support in some image editing software</li>
                            <li>Not ideal for print production</li>
                            <li>Requires fallback images for older browsers</li>
                            <li>More complex to implement than traditional formats</li>
                            <li>Less widely recognized than JPG or PNG</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Web images, web graphics, web optimization, sites concerned with performance, mobile-first websites</p>
            </div>
        </div>
        
        <h3 class="section-title">BMP vs WebP: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>BMP</th>
                <th>WebP</th>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Very large (uncompressed)</td>
                <td>Very small (highly compressed)</td>
            </tr>
            <tr>
                <td>Compression</td>
                <td>None or minimal RLE</td>
                <td>Both lossy and lossless</td>
            </tr>
            <tr>
                <td>Quality</td>
                <td>Perfect (lossless)</td>
                <td>Adjustable (lossy) or perfect (lossless)</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Limited support</td>
                <td>Full alpha channel support</td>
            </tr>
            <tr>
                <td>Animation</td>
                <td>Not supported</td>
                <td>Supported</td>
            </tr>
            <tr>
                <td>Web Usage</td>
                <td>Rarely used</td>
                <td>Increasingly common</td>
            </tr>
            <tr>
                <td>Browser Support</td>
                <td>Universal</td>
                <td>Most modern browsers</td>
            </tr>
            <tr>
                <td>Loading Speed</td>
                <td>Slow (due to size)</td>
                <td>Very fast (small size)</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert BMP to WebP?</h3>
            <ul>
                <li><strong>Drastically reduce file size:</strong> WebP files are typically 25-35% smaller than equivalent JPG files and much smaller than BMP files.</li>
                <li><strong>Maintain high quality:</strong> WebP offers excellent image quality even at high compression rates.</li>
                <li><strong>Support transparency:</strong> WebP supports alpha channel transparency like PNG but with smaller file sizes.</li>
                <li><strong>Improve website performance:</strong> Smaller image files load faster, improving website speed and user experience.</li>
                <li><strong>Better SEO:</strong> Faster-loading websites tend to rank better in search engines.</li>
                <li><strong>Reduce bandwidth usage:</strong> Smaller files mean less data transfer, which is especially important for mobile users.</li>
                <li><strong>Future-proof your images:</strong> WebP is a modern format with growing support across the web.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our BMP to WebP converter tool makes this conversion process simple and efficient, helping you transform your large bitmap images into highly optimized WebP format. With adjustable quality settings and transparency options, you can find the perfect balance between file size and image quality for your specific needs.</p>
    `;
    
    // Insert the HTML into the about content
    aboutContent.innerHTML = aboutHTML;
}

/**
 * Initialize similar tools section
 */
function initializeSimilarTools() {
    // This will be populated by the tool-template.js script
    // which uses the tools-data.js to find similar tools
}
