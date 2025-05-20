/**
 * WebP to PNG Converter - Image Processing Tool
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
 * Initialize the WebP to PNG converter tool
 */
function initializeConverter() {
    const toolMainContent = document.getElementById('tool-main-content');
    
    // Create the converter HTML
    const converterHTML = `
        <div class="converter-app">
            <div class="upload-container" id="uploadContainer">
                <p><i class="fas fa-cloud-upload-alt" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);"></i></p>
                <p>Drag & Drop your WebP image here or</p>
                <button type="button" class="upload-btn" id="uploadBtn">
                    <i class="fas fa-file-image"></i> Choose File
                </button>
                <input type="file" id="fileInput" accept=".webp" class="hidden" aria-label="Upload WebP Image" title="Upload WebP Image">
                <p class="file-info">Supports: WebP</p>
            </div>

            <div class="preview-container hidden" id="previewContainer">
                <h2 class="preview-heading">Image Preview</h2>
                <div class="preview-images">
                    <div class="preview-box">
                        <h3>Original WebP Image</h3>
                        <div class="image-container">
                            <img id="originalPreview" src="" alt="Original WebP image preview">
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
        // Check if file is a WebP
        if (!file.type.match('image/webp')) {
            showNotification('Please select a WebP image.', 'error');
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
                
                // Show preview
                previewContainer.classList.remove('hidden');
                
                // Show success notification
                showNotification('WebP image uploaded successfully!', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function convertImage() {
        if (!originalImage) {
            showNotification('Please upload a WebP image first.', 'error');
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
            <p class="highlight-text">WebP to PNG conversion transforms Google's modern format into the universally compatible PNG format. This conversion is essential when you need to use images with software or platforms that don't support WebP while maintaining transparency and image quality.</p>
        </div>
        
        <h3 class="section-title">Understanding WebP and PNG Formats</h3>
        
        <div class="format-info-grid">
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
                            <li>Smaller file size than PNG (26% smaller)</li>
                            <li>Supports both lossy and lossless compression</li>
                            <li>Transparency support with alpha channel</li>
                            <li>Animation support (like GIF but smaller)</li>
                            <li>Better quality-to-size ratio than PNG</li>
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
            
            <div class="format-box">
                <h3>PNG (Portable Network Graphics)</h3>
                <p>PNG is a lossless format that supports transparency, making it ideal for graphics, logos, and images with text.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created in 1996 as an open format alternative to GIF</p>
                    <p><strong>File Extension:</strong> .png</p>
                    <p><strong>Color Depth:</strong> Up to 48-bit (trillions of colors)</p>
                    <p><strong>Compression:</strong> Lossless (preserves all image data)</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Lossless compression preserves all details</li>
                            <li>Full alpha channel transparency support</li>
                            <li>Perfect for graphics, logos, and text</li>
                            <li>No quality loss with repeated editing</li>
                            <li>Superior for images with sharp edges</li>
                            <li>Universal compatibility across platforms</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Larger file size than WebP for same quality</li>
                            <li>Less efficient for complex photographic images</li>
                            <li>No native animation support</li>
                            <li>Slower loading on websites (if not optimized)</li>
                            <li>Excessive for simple photographic content</li>
                            <li>Not ideal for print production workflows</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Graphics with transparency, logos, icons, text, screenshots, illustrations, digital art, web graphics</p>
            </div>
        </div>
        
        <h3 class="section-title">WebP vs PNG: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>WebP</th>
                <th>PNG</th>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Smaller (26% smaller than PNG)</td>
                <td>Larger than WebP</td>
            </tr>
            <tr>
                <td>Compression</td>
                <td>Both lossy and lossless</td>
                <td>Lossless only</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Fully supported (alpha channel)</td>
                <td>Fully supported (alpha channel)</td>
            </tr>
            <tr>
                <td>Animation</td>
                <td>Supported</td>
                <td>Not supported</td>
            </tr>
            <tr>
                <td>Browser Support</td>
                <td>Modern browsers only</td>
                <td>All browsers</td>
            </tr>
            <tr>
                <td>Software Support</td>
                <td>Limited</td>
                <td>Universal</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Web optimization, modern platforms</td>
                <td>Universal compatibility, transparency</td>
            </tr>
            <tr>
                <td>Quality at Same Size</td>
                <td>Higher</td>
                <td>Lower</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert WebP to PNG?</h3>
            <ul>
                <li><strong>Universal compatibility:</strong> PNG is supported by virtually all software, devices, and platforms, making it the safe choice when compatibility is a concern.</li>
                <li><strong>Software support:</strong> Many image editing programs, especially older versions, don't support WebP files but work perfectly with PNG.</li>
                <li><strong>Social media sharing:</strong> Some social media platforms may not properly handle WebP images, while PNG is universally accepted.</li>
                <li><strong>Transparency preservation:</strong> When you need to maintain transparency in your images, PNG is a reliable format that's widely supported.</li>
                <li><strong>Lossless quality:</strong> PNG's lossless compression ensures that no image data is lost during conversion, making it ideal for preserving WebP image quality.</li>
                <li><strong>Legacy system support:</strong> Older systems and software that haven't been updated to support WebP will work with PNG files.</li>
                <li><strong>Archiving:</strong> For long-term storage, PNG's universal support makes it a safer choice than newer formats like WebP.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our WebP to PNG converter tool makes this conversion process simple and efficient, helping you optimize your images for any purpose that requires the PNG format. The conversion preserves transparency and image quality, ensuring your images look their best in any application or platform that supports PNG.</p>
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
