/**
 * JPG to WebP Converter - Image Processing Tool
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
 * Initialize the JPG to WebP converter tool
 */
function initializeConverter() {
    const toolMainContent = document.getElementById('tool-main-content');
    
    // Create the converter HTML
    const converterHTML = `
        <div class="converter-app">
            <div class="upload-container" id="uploadContainer">
                <p><i class="fas fa-cloud-upload-alt" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);"></i></p>
                <p>Drag & Drop your JPG image here or</p>
                <button type="button" class="upload-btn" id="uploadBtn">
                    <i class="fas fa-file-image"></i> Choose File
                </button>
                <input type="file" id="fileInput" accept=".jpg,.jpeg" class="hidden" aria-label="Upload JPG Image" title="Upload JPG Image">
                <p class="file-info">Supports: JPG, JPEG</p>
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
                    <p class="file-info">Lossless preserves all details but results in larger files.</p>
                </div>
            </div>

            <div class="preview-container hidden" id="previewContainer">
                <h2 class="preview-heading">Image Preview</h2>
                <div class="preview-images">
                    <div class="preview-box">
                        <h3>Original JPG Image</h3>
                        <div class="image-container">
                            <img id="originalPreview" src="" alt="Original JPG image preview">
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
        if (lossless.checked) {
            quality.disabled = true;
            qualityValue.parentElement.style.opacity = '0.5';
        } else {
            quality.disabled = false;
            qualityValue.parentElement.style.opacity = '1';
        }
    });

    convertBtn.addEventListener('click', convertImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function handleFileUpload(file) {
        // Check if file is a JPG
        if (!file.type.match('image/jpeg')) {
            showNotification('Please select a JPG image.', 'error');
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
                
                // Display original image info
                originalInfo.textContent = `${file.name} (${formatFileSize(file.size)}, ${img.width}×${img.height} px)`;
                
                // Set original preview
                originalPreview.src = e.target.result;
                
                // Show controls and preview
                controls.classList.remove('hidden');
                previewContainer.classList.remove('hidden');
                
                // Show success notification
                showNotification('JPG image uploaded successfully!', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertImage() {
        if (!originalImage) {
            showNotification('Please upload a JPG image first.', 'error');
            return;
        }

        // Show loading indicator
        loading.classList.remove('hidden');
        
        // Hide download button while converting
        downloadBtn.classList.add('hidden');

        // Get quality value and lossless setting
        const qualityVal = parseInt(quality.value) / 100;
        const isLossless = lossless.checked;

        // Use setTimeout to allow the UI to update before the conversion starts
        setTimeout(() => {
            try {
                // Create canvas for conversion
                const canvas = document.createElement('canvas');
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                
                // Draw the image on the canvas
                const ctx = canvas.getContext('2d');
                ctx.drawImage(originalImage, 0, 0);
                
                // Convert the canvas to WebP format
                // Note: WebP conversion is only supported in modern browsers
                if (typeof canvas.toBlob !== 'function') {
                    throw new Error('Your browser does not support WebP conversion. Please try a modern browser like Chrome or Edge.');
                }
                
                canvas.toBlob(blob => {
                    if (!blob) {
                        throw new Error('WebP conversion failed. Your browser may not support WebP format.');
                    }
                    
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
                }, 'image/webp', isLossless ? undefined : qualityVal);
            } catch (error) {
                loading.classList.add('hidden');
                showNotification('Error converting image: ' + error.message, 'error');
            }
        }, 100);
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
            <p class="highlight-text">JPG to WebP conversion transforms traditional images into Google's modern format, reducing file size by 25-34% while maintaining visual quality. This conversion is essential for optimizing website performance and improving page load times.</p>
        </div>
        
        <h3 class="section-title">Understanding JPG and WebP Formats</h3>
        
        <div class="format-info-grid">
            <div class="format-box">
                <h3>JPG (Joint Photographic Experts Group)</h3>
                <p>JPG is the most widely used image format on the web, designed specifically for photographs and complex images with millions of colors and gradients.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created in 1992 by the Joint Photographic Experts Group</p>
                    <p><strong>File Extension:</strong> .jpg, .jpeg</p>
                    <p><strong>Color Depth:</strong> Up to 24-bit (16.7 million colors)</p>
                    <p><strong>Compression:</strong> Lossy (discards some image data)</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Universal compatibility across all platforms</li>
                            <li>Supported by all image editors and viewers</li>
                            <li>Ideal for photographs with complex color gradients</li>
                            <li>Adjustable compression levels for quality/size balance</li>
                            <li>Well-supported in email clients and social media</li>
                            <li>Excellent for print production workflows</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Lossy compression degrades image quality</li>
                            <li>No transparency support</li>
                            <li>Quality degrades with each edit and save</li>
                            <li>Poor for text, graphics, and sharp edges</li>
                            <li>Visible artifacts in high-contrast areas</li>
                            <li>Larger file size than WebP for same quality</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Photographs, complex images, universal sharing, email attachments, print materials, social media</p>
            </div>
            
            <div class="format-box">
                <h3>WebP (Web Picture)</h3>
                <p>WebP is a modern image format developed by Google that provides superior lossless and lossy compression for images on the web.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created by Google in 2010</p>
                    <p><strong>File Extension:</strong> .webp</p>
                    <p><strong>Color Depth:</strong> Up to 32-bit RGBA</p>
                    <p><strong>Compression:</strong> Both lossy and lossless</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Smaller file size than JPG (25-34% smaller)</li>
                            <li>Supports both lossy and lossless compression</li>
                            <li>Transparency support with alpha channel</li>
                            <li>Animation support (like GIF but smaller)</li>
                            <li>Better quality-to-size ratio than JPG</li>
                            <li>Ideal for web performance optimization</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Limited compatibility with older browsers</li>
                            <li>Not universally supported in image editors</li>
                            <li>Less compatible with some social media platforms</li>
                            <li>Not widely supported in email clients</li>
                            <li>Some quality loss in lossy mode</li>
                            <li>Not ideal for print production</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Web images, websites focused on performance, progressive web apps, Google platforms</p>
            </div>
        </div>
        
        <h3 class="section-title">JPG vs WebP: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>JPG</th>
                <th>WebP</th>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Larger than WebP</td>
                <td>Smaller (25-34% smaller than JPG)</td>
            </tr>
            <tr>
                <td>Compression</td>
                <td>Lossy only</td>
                <td>Both lossy and lossless</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Not supported</td>
                <td>Supported (alpha channel)</td>
            </tr>
            <tr>
                <td>Animation</td>
                <td>Not supported</td>
                <td>Supported</td>
            </tr>
            <tr>
                <td>Browser Support</td>
                <td>All browsers since 1990s</td>
                <td>Modern browsers only</td>
            </tr>
            <tr>
                <td>Software Support</td>
                <td>Universal</td>
                <td>Limited</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Universal compatibility, photographs</td>
                <td>Web optimization, modern platforms</td>
            </tr>
            <tr>
                <td>Quality at Same Size</td>
                <td>Lower</td>
                <td>Higher</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert JPG to WebP?</h3>
            <ul>
                <li><strong>Smaller file size:</strong> WebP images are typically 25-34% smaller than JPG images of the same visual quality, reducing bandwidth usage and storage requirements.</li>
                <li><strong>Faster website loading:</strong> Smaller image sizes lead to faster page load times, improving user experience and SEO rankings.</li>
                <li><strong>Better mobile experience:</strong> Reduced data usage is especially important for mobile users with limited data plans.</li>
                <li><strong>Improved Core Web Vitals:</strong> Google's page experience metrics favor faster-loading pages, which WebP helps achieve.</li>
                <li><strong>Support for transparency:</strong> Unlike JPG, WebP supports alpha channel transparency, allowing for more versatile image usage.</li>
                <li><strong>Animation support:</strong> WebP can replace both static JPGs and animated GIFs, offering a unified format with better compression.</li>
                <li><strong>Better quality at same file size:</strong> When file size is constrained, WebP can deliver higher visual quality than JPG.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our JPG to WebP converter tool makes this conversion process simple and efficient, helping you optimize your images for modern web use. With adjustable quality settings and lossless compression options, you can find the perfect balance between file size and image quality for your specific needs.</p>
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
