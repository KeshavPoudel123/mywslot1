/**
 * BMP to JPG Converter - Image Processing Tool
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
 * Initialize the BMP to JPG converter tool
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
                    <label for="quality">JPG Quality: <span id="qualityValue">90</span>%</label>
                    <input type="range" id="quality" class="quality-slider" min="1" max="100" value="90">
                    <p class="file-info">Higher quality = larger file size. Lower quality = smaller file size.</p>
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

        // Get quality value
        const qualityVal = parseInt(quality.value) / 100;

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
                
                // Convert the canvas to JPG format
                canvas.toBlob(blob => {
                    // Create object URL for the blob
                    const url = URL.createObjectURL(blob);
                    
                    // Store the converted image URL for download
                    convertedImageUrl = url;
                    
                    // Set converted preview
                    convertedPreview.src = url;
                    
                    // Update converted info
                    convertedInfo.textContent = `Converted to JPG (${formatFileSize(blob.size)}, ${originalImage.width}×${originalImage.height} px)`;
                    
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
            <p class="highlight-text">BMP to JPG conversion transforms uncompressed bitmap images into the widely-used JPG format. This conversion is particularly useful for reducing file size while maintaining acceptable image quality for photographs and complex images.</p>
        </div>
        
        <h3 class="section-title">Understanding BMP and JPG Formats</h3>
        
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
                            <li>Excellent compression for photographs</li>
                            <li>Adjustable quality/size ratio</li>
                            <li>Small file size compared to uncompressed formats</li>
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
                            <li>Visible artifacts in high-contrast areas</li>
                            <li>Not ideal for text, graphics, and sharp edges</li>
                            <li>Not suitable for images requiring exact color precision</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Photographs, complex images, universal sharing, email attachments, print materials, social media</p>
            </div>
        </div>
        
        <h3 class="section-title">BMP vs JPG: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>BMP</th>
                <th>JPG</th>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Very large (uncompressed)</td>
                <td>Small (compressed)</td>
            </tr>
            <tr>
                <td>Compression</td>
                <td>None or minimal RLE</td>
                <td>Lossy</td>
            </tr>
            <tr>
                <td>Quality</td>
                <td>Perfect (lossless)</td>
                <td>Variable (lossy)</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Limited support</td>
                <td>Not supported</td>
            </tr>
            <tr>
                <td>Web Usage</td>
                <td>Rarely used</td>
                <td>Very common</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Raw image data, editing</td>
                <td>Photographs, web images</td>
            </tr>
            <tr>
                <td>Color Support</td>
                <td>1-bit to 32-bit</td>
                <td>24-bit (16.7M colors)</td>
            </tr>
            <tr>
                <td>Loading Speed</td>
                <td>Slow (due to size)</td>
                <td>Fast (small size)</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert BMP to JPG?</h3>
            <ul>
                <li><strong>Drastically reduce file size:</strong> JPG files are typically 10-20 times smaller than equivalent BMP files.</li>
                <li><strong>Easier sharing:</strong> Smaller JPG files are much easier to email, upload, or share online.</li>
                <li><strong>Faster loading:</strong> JPG images load much faster on websites and in applications due to their smaller size.</li>
                <li><strong>Better compatibility:</strong> While BMP is widely supported on Windows, JPG has universal compatibility across all platforms and devices.</li>
                <li><strong>Social media optimization:</strong> Most social platforms prefer and are optimized for JPG images.</li>
                <li><strong>Storage efficiency:</strong> JPG files take up much less space on your hard drive or cloud storage.</li>
                <li><strong>Print preparation:</strong> Many print services prefer JPG files for photographs.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our BMP to JPG converter tool makes this conversion process simple and efficient, helping you transform your large bitmap images into web-friendly JPG format. With adjustable quality settings, you can find the perfect balance between file size and image quality for your specific needs.</p>
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
