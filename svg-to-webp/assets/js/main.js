/**
 * SVG to WebP Converter - Image Processing Tool
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
 * Initialize the SVG to WebP converter tool
 */
function initializeConverter() {
    const toolMainContent = document.getElementById('tool-main-content');
    
    // Create the converter HTML
    const converterHTML = `
        <div class="converter-app">
            <div class="upload-container" id="uploadContainer">
                <p><i class="fas fa-cloud-upload-alt" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);"></i></p>
                <p>Drag & Drop your SVG image here or</p>
                <button type="button" class="upload-btn" id="uploadBtn">
                    <i class="fas fa-file-image"></i> Choose File
                </button>
                <input type="file" id="fileInput" accept=".svg" class="hidden" aria-label="Upload SVG Image" title="Upload SVG Image">
                <p class="file-info">Supports: SVG</p>
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
                    <label for="width">Output Width (px):</label>
                    <input type="number" id="width" min="1" max="5000" value="800" class="number-input">
                    <p class="file-info">Leave blank to use original width.</p>
                </div>
                <div class="control-group">
                    <label for="height">Output Height (px):</label>
                    <input type="number" id="height" min="1" max="5000" value="600" class="number-input">
                    <p class="file-info">Leave blank to use original height.</p>
                </div>
                <div class="control-group">
                    <label for="maintainAspectRatio">
                        <input type="checkbox" id="maintainAspectRatio" checked> Maintain aspect ratio
                    </label>
                </div>
                <div class="control-group">
                    <label for="backgroundColor">Background Color:</label>
                    <input type="color" id="backgroundColor" value="#ffffff" class="color-input">
                    <p class="file-info">SVGs can have transparent backgrounds. Choose a background color or keep transparency.</p>
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
                        <h3>Original SVG Image</h3>
                        <div class="image-container">
                            <img id="originalPreview" src="" alt="Original SVG image preview">
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
    const width = document.getElementById('width');
    const height = document.getElementById('height');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');
    const backgroundColor = document.getElementById('backgroundColor');
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
    let originalWidth = 0;
    let originalHeight = 0;
    let aspectRatio = 1;

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

    maintainAspectRatio.addEventListener('change', () => {
        if (maintainAspectRatio.checked) {
            // Update height based on width to maintain aspect ratio
            height.value = Math.round(width.value / aspectRatio);
        }
    });

    width.addEventListener('input', () => {
        if (maintainAspectRatio.checked && aspectRatio) {
            // Update height based on width to maintain aspect ratio
            height.value = Math.round(width.value / aspectRatio);
        }
    });

    height.addEventListener('input', () => {
        if (maintainAspectRatio.checked && aspectRatio) {
            // Update width based on height to maintain aspect ratio
            width.value = Math.round(height.value * aspectRatio);
        }
    });

    convertBtn.addEventListener('click', convertImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function handleFileUpload(file) {
        // Check if file is an SVG
        if (!file.type.match('image/svg+xml') && !file.name.endsWith('.svg')) {
            showNotification('Please select an SVG image.', 'error');
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
                originalWidth = img.width || 800; // Default to 800 if width is 0
                originalHeight = img.height || 600; // Default to 600 if height is 0
                aspectRatio = originalWidth / originalHeight;
                
                // Update width and height inputs with original dimensions
                width.value = originalWidth;
                height.value = originalHeight;
                
                // Display original image info
                originalInfo.textContent = `${file.name} (${formatFileSize(file.size)}, ${originalWidth}×${originalHeight} px)`;
                
                // Set original preview
                originalPreview.src = e.target.result;
                
                // Show controls and preview
                controls.classList.remove('hidden');
                previewContainer.classList.remove('hidden');
                
                // Show success notification
                showNotification('SVG image uploaded successfully!', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertImage() {
        if (!originalImage) {
            showNotification('Please upload an SVG image first.', 'error');
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
        const bgColor = backgroundColor.value;
        const outputWidth = parseInt(width.value) || originalWidth;
        const outputHeight = parseInt(height.value) || originalHeight;

        // Use setTimeout to allow the UI to update before the conversion starts
        setTimeout(() => {
            try {
                // Create canvas for conversion
                const canvas = document.createElement('canvas');
                canvas.width = outputWidth;
                canvas.height = outputHeight;
                
                // Draw the image on the canvas
                const ctx = canvas.getContext('2d');
                
                // Clear canvas with transparent background if preserving transparency
                if (keepTransparency) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    // Fill with background color if not preserving transparency
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                // Draw the SVG on top
                ctx.drawImage(originalImage, 0, 0, outputWidth, outputHeight);
                
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
        const outputWidth = parseInt(width.value) || originalWidth;
        const outputHeight = parseInt(height.value) || originalHeight;
        convertedInfo.textContent = `Converted to WebP (${formatFileSize(blob.size)}, ${outputWidth}×${outputHeight} px)`;
        
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
            <p class="highlight-text">SVG to WebP conversion transforms scalable vector graphics into the modern WebP raster format. This conversion is particularly useful when you need to use your vector graphics in environments that require highly optimized raster images for web performance.</p>
        </div>
        
        <h3 class="section-title">Understanding SVG and WebP Formats</h3>
        
        <div class="format-info-grid">
            <div class="format-box">
                <h3>SVG (Scalable Vector Graphics)</h3>
                <p>SVG is an XML-based vector image format for two-dimensional graphics that supports interactivity and animation.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created by the World Wide Web Consortium (W3C) in 1999</p>
                    <p><strong>File Extension:</strong> .svg</p>
                    <p><strong>Type:</strong> Vector graphic format (resolution-independent)</p>
                    <p><strong>Compression:</strong> Can be compressed with gzip (SVGZ)</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Infinitely scalable without quality loss</li>
                            <li>Small file size for simple graphics</li>
                            <li>Editable with text editors or vector software</li>
                            <li>Supports animation and interactivity</li>
                            <li>Transparency support</li>
                            <li>Accessible and searchable text content</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Not ideal for complex photographic images</li>
                            <li>Limited support in older software</li>
                            <li>Can be slow to render if very complex</li>
                            <li>Security concerns in some contexts</li>
                            <li>Inconsistent rendering across browsers</li>
                            <li>Not supported by some social media platforms</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Logos, icons, illustrations, diagrams, charts, animations, interactive graphics</p>
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
        
        <h3 class="section-title">SVG vs WebP: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>SVG</th>
                <th>WebP</th>
            </tr>
            <tr>
                <td>Image Type</td>
                <td>Vector (resolution-independent)</td>
                <td>Raster (resolution-dependent)</td>
            </tr>
            <tr>
                <td>Scalability</td>
                <td>Infinitely scalable</td>
                <td>Fixed resolution</td>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Small for simple graphics</td>
                <td>Very small (highly compressed)</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Fully supported</td>
                <td>Alpha channel supported</td>
            </tr>
            <tr>
                <td>Animation</td>
                <td>Supported (SMIL, CSS, JS)</td>
                <td>Supported</td>
            </tr>
            <tr>
                <td>Editability</td>
                <td>Easily editable (XML-based)</td>
                <td>Limited editability</td>
            </tr>
            <tr>
                <td>Browser Support</td>
                <td>All modern browsers</td>
                <td>Most modern browsers</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Logos, icons, illustrations</td>
                <td>Web photos, complex images</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert SVG to WebP?</h3>
            <ul>
                <li><strong>Fixed resolution needs:</strong> When you need a specific pixel dimension rather than a scalable format.</li>
                <li><strong>Web optimization:</strong> WebP offers excellent compression for web images, helping to improve page load times.</li>
                <li><strong>Compatibility:</strong> Some platforms may not support SVG but do support WebP.</li>
                <li><strong>Prevent editing:</strong> Converting to WebP makes it harder for others to edit your original vector design.</li>
                <li><strong>Raster effects:</strong> When you need to apply raster-specific effects to your vector graphics.</li>
                <li><strong>Complex SVGs:</strong> Very complex SVGs can be slow to render; converting to WebP can improve performance.</li>
                <li><strong>Social media:</strong> Many social platforms support WebP but not SVG.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our SVG to WebP converter tool makes this conversion process simple and efficient, helping you transform your vector graphics into highly optimized raster images for web use. With adjustable quality settings, dimension controls, and transparency options, you can find the perfect balance between file size and image quality for your specific needs.</p>
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
