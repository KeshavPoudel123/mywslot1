/**
 * SVG to JPG Converter - Image Processing Tool
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
 * Initialize the SVG to JPG converter tool
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
                    <label for="quality">JPG Quality: <span id="qualityValue">90</span>%</label>
                    <input type="range" id="quality" class="quality-slider" min="1" max="100" value="90">
                    <p class="file-info">Higher quality = larger file size. Lower quality = smaller file size.</p>
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
                    <p class="file-info">SVGs can have transparent backgrounds, but JPGs require a background color.</p>
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
                        <h3>Converted JPG Image</h3>
                        <div class="image-container">
                            <img id="convertedPreview" src="" alt="Converted JPG image preview">
                        </div>
                        <div class="info" id="convertedInfo"></div>
                    </div>
                </div>
                <div class="buttons">
                    <button type="button" class="convert-btn" id="convertBtn">
                        <i class="fas fa-sync-alt"></i> Convert to JPG
                    </button>
                    <button type="button" class="download-btn hidden" id="downloadBtn">
                        <i class="fas fa-download"></i> Download JPG
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
    const width = document.getElementById('width');
    const height = document.getElementById('height');
    const maintainAspectRatio = document.getElementById('maintainAspectRatio');
    const backgroundColor = document.getElementById('backgroundColor');
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

        // Get quality value and dimensions
        const qualityVal = parseInt(quality.value) / 100;
        const outputWidth = parseInt(width.value) || originalWidth;
        const outputHeight = parseInt(height.value) || originalHeight;
        const bgColor = backgroundColor.value;

        // Use setTimeout to allow the UI to update before the conversion starts
        setTimeout(() => {
            try {
                // Create canvas for conversion
                const canvas = document.createElement('canvas');
                canvas.width = outputWidth;
                canvas.height = outputHeight;
                
                // Draw the image on the canvas
                const ctx = canvas.getContext('2d');
                
                // Fill with background color
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw the SVG on top
                ctx.drawImage(originalImage, 0, 0, outputWidth, outputHeight);
                
                // Convert the canvas to JPG format
                canvas.toBlob(blob => {
                    // Create object URL for the blob
                    const url = URL.createObjectURL(blob);
                    
                    // Store the converted image URL for download
                    convertedImageUrl = url;
                    
                    // Set converted preview
                    convertedPreview.src = url;
                    
                    // Update converted info
                    convertedInfo.textContent = `Converted to JPG (${formatFileSize(blob.size)}, ${outputWidth}×${outputHeight} px)`;
                    
                    // Hide loading indicator
                    loading.classList.add('hidden');
                    
                    // Show download button
                    downloadBtn.classList.remove('hidden');
                    
                    // Show success notification
                    showNotification('Image converted to JPG successfully!', 'success');
                    
                    // Scroll to preview
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                }, 'image/jpeg', qualityVal);
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
        const filename = originalImageName.substring(0, originalImageName.lastIndexOf('.')) + '.jpg';
        
        link.download = filename;
        link.href = convertedImageUrl;
        link.click();
        
        // Show success notification
        showNotification('JPG image downloaded successfully!', 'success');
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
            <p class="highlight-text">SVG to JPG conversion transforms scalable vector graphics into raster images, making them compatible with applications and platforms that don't support vector formats. This conversion is essential when you need to use your vector graphics in environments that only accept raster formats.</p>
        </div>
        
        <h3 class="section-title">Understanding SVG and JPG Formats</h3>
        
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
                <h3>JPG (Joint Photographic Experts Group)</h3>
                <p>JPG is the most widely used image format on the web, designed specifically for photographs and complex images with millions of colors and gradients.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created in 1992 by the Joint Photographic Experts Group</p>
                    <p><strong>File Extension:</strong> .jpg, .jpeg</p>
                    <p><strong>Type:</strong> Raster graphic format (resolution-dependent)</p>
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
                            <li>Resolution-dependent (pixelates when enlarged)</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Photographs, complex images, universal sharing, email attachments, print materials, social media</p>
            </div>
        </div>
        
        <h3 class="section-title">SVG vs JPG: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>SVG</th>
                <th>JPG</th>
            </tr>
            <tr>
                <td>Image Type</td>
                <td>Vector (resolution-independent)</td>
                <td>Raster (resolution-dependent)</td>
            </tr>
            <tr>
                <td>Scalability</td>
                <td>Infinitely scalable without quality loss</td>
                <td>Loses quality when scaled up</td>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Small for simple graphics, large for complex ones</td>
                <td>Efficient for photographs</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Fully supported</td>
                <td>Not supported</td>
            </tr>
            <tr>
                <td>Animation</td>
                <td>Supported</td>
                <td>Not supported</td>
            </tr>
            <tr>
                <td>Editability</td>
                <td>Easily editable (XML-based)</td>
                <td>Limited editability</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Logos, icons, illustrations, diagrams</td>
                <td>Photographs, complex images</td>
            </tr>
            <tr>
                <td>Browser Support</td>
                <td>All modern browsers</td>
                <td>All browsers since 1990s</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert SVG to JPG?</h3>
            <ul>
                <li><strong>Universal compatibility:</strong> JPG is supported by virtually all software, devices, and platforms, making it the safe choice when compatibility is a concern.</li>
                <li><strong>Social media sharing:</strong> Many social media platforms don't support SVG uploads but work perfectly with JPG.</li>
                <li><strong>Email attachments:</strong> Some email clients may not display SVG images correctly, while JPG is universally accepted.</li>
                <li><strong>Print production:</strong> Many print services require raster formats like JPG rather than vector formats.</li>
                <li><strong>Fixed resolution needs:</strong> When you need a specific pixel dimension for your image rather than a scalable format.</li>
                <li><strong>Software compatibility:</strong> Older software or specialized applications may not support SVG but will work with JPG.</li>
                <li><strong>Prevent editing:</strong> Converting to JPG makes it harder for others to edit your original vector design.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our SVG to JPG converter tool makes this conversion process simple and efficient, helping you transform your vector graphics into universally compatible raster images. With adjustable quality settings and dimension controls, you can find the perfect balance between file size and image quality for your specific needs.</p>
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
