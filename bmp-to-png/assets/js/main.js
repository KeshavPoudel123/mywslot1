/**
 * BMP to PNG Converter - Image Processing Tool
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
 * Initialize the BMP to PNG converter tool
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
                    <label for="preserveTransparency">
                        <input type="checkbox" id="preserveTransparency" checked> Preserve transparency
                    </label>
                    <p class="file-info">PNG supports full alpha channel transparency for partially transparent areas.</p>
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
                        <h3>Converted PNG Image</h3>
                        <div class="image-container">
                            <img id="convertedPreview" src="" alt="Converted PNG image preview">
                        </div>
                        <div class="info" id="convertedInfo"></div>
                    </div>
                </div>
                <div class="buttons">
                    <button type="button" class="convert-btn" id="convertBtn">
                        <i class="fas fa-sync-alt"></i> Convert to PNG
                    </button>
                    <button type="button" class="download-btn hidden" id="downloadBtn">
                        <i class="fas fa-download"></i> Download PNG
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
                if (preserveTransparency.checked) {
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                } else {
                    // Fill with white background if not preserving transparency
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                }
                
                // Draw the BMP image on top
                ctx.drawImage(originalImage, 0, 0);
                
                // Convert the canvas to PNG format
                canvas.toBlob(blob => {
                    // Create object URL for the blob
                    const url = URL.createObjectURL(blob);
                    
                    // Store the converted image URL for download
                    convertedImageUrl = url;
                    
                    // Set converted preview
                    convertedPreview.src = url;
                    
                    // Update converted info
                    convertedInfo.textContent = `Converted to PNG (${formatFileSize(blob.size)}, ${originalImage.width}×${originalImage.height} px)`;
                    
                    // Hide loading indicator
                    loading.classList.add('hidden');
                    
                    // Show download button
                    downloadBtn.classList.remove('hidden');
                    
                    // Show success notification
                    showNotification('Image converted to PNG successfully!', 'success');
                    
                    // Scroll to preview
                    previewContainer.scrollIntoView({ behavior: 'smooth' });
                }, 'image/png');
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
        const filename = originalImageName.substring(0, originalImageName.lastIndexOf('.')) + '.png';
        
        link.download = filename;
        link.href = convertedImageUrl;
        link.click();
        
        // Show success notification
        showNotification('PNG image downloaded successfully!', 'success');
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
            <p class="highlight-text">BMP to PNG conversion transforms uncompressed bitmap images into the versatile PNG format with lossless compression. This conversion is particularly useful for reducing file size while maintaining perfect image quality and adding transparency support.</p>
        </div>
        
        <h3 class="section-title">Understanding BMP and PNG Formats</h3>
        
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
                <h3>PNG (Portable Network Graphics)</h3>
                <p>PNG is a raster graphics file format that supports lossless data compression and was created as an improved, non-patented replacement for GIF.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created in 1996 as a free, open-source alternative to GIF</p>
                    <p><strong>File Extension:</strong> .png</p>
                    <p><strong>Color Depth:</strong> Up to 48-bit true color (16 million+ colors)</p>
                    <p><strong>Compression:</strong> Lossless</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Full alpha channel transparency</li>
                            <li>Lossless compression (no quality loss)</li>
                            <li>Supports millions of colors</li>
                            <li>Better for text, logos, and images with sharp edges</li>
                            <li>No patent restrictions</li>
                            <li>Excellent for screenshots and digital art</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>No animation support (unlike GIF)</li>
                            <li>Larger file size than JPG for photographs</li>
                            <li>Not ideal for print production</li>
                            <li>Slower to load than JPG for large images</li>
                            <li>Not as efficient as newer formats like WebP</li>
                            <li>Overkill for simple images with few colors</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Images requiring transparency, logos, text graphics, screenshots, digital illustrations, diagrams</p>
            </div>
        </div>
        
        <h3 class="section-title">BMP vs PNG: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>BMP</th>
                <th>PNG</th>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Very large (uncompressed)</td>
                <td>Medium (lossless compression)</td>
            </tr>
            <tr>
                <td>Compression</td>
                <td>None or minimal RLE</td>
                <td>Lossless</td>
            </tr>
            <tr>
                <td>Quality</td>
                <td>Perfect (lossless)</td>
                <td>Perfect (lossless)</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Limited support</td>
                <td>Full alpha channel support</td>
            </tr>
            <tr>
                <td>Web Usage</td>
                <td>Rarely used</td>
                <td>Very common</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Raw image data, editing</td>
                <td>Web graphics, logos, transparency</td>
            </tr>
            <tr>
                <td>Color Support</td>
                <td>1-bit to 32-bit</td>
                <td>Up to 48-bit true color</td>
            </tr>
            <tr>
                <td>Loading Speed</td>
                <td>Slow (due to size)</td>
                <td>Medium (smaller than BMP)</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert BMP to PNG?</h3>
            <ul>
                <li><strong>Reduce file size:</strong> PNG uses lossless compression to significantly reduce file size while maintaining perfect image quality.</li>
                <li><strong>Add transparency support:</strong> PNG supports full alpha channel transparency, allowing for partially transparent areas.</li>
                <li><strong>Better web compatibility:</strong> PNG is widely supported on the web, while BMP is rarely used online.</li>
                <li><strong>Maintain image quality:</strong> Unlike JPG, PNG uses lossless compression, so you don't lose any image quality in the conversion.</li>
                <li><strong>Better for graphics and text:</strong> PNG is ideal for images with sharp edges, text, and graphics.</li>
                <li><strong>Easier sharing:</strong> Smaller PNG files are much easier to email, upload, or share online.</li>
                <li><strong>Better software compatibility:</strong> Many modern applications prefer PNG over BMP for better performance.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our BMP to PNG converter tool makes this conversion process simple and efficient, helping you transform your large bitmap images into web-friendly PNG format with perfect quality and transparency support. This is particularly useful for screenshots, logos, and graphics that need to maintain their quality while being more efficiently stored and shared.</p>
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
