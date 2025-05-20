/**
 * JPG to PNG Converter - Image Processing Tool
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
 * Initialize the JPG to PNG converter tool
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

                // Show preview container
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
            <p class="highlight-text">JPG to PNG conversion transforms lossy compressed images into lossless format with transparency support. This essential conversion preserves image quality and enables advanced editing capabilities.</p>
        </div>

        <h3 class="section-title">Understanding JPG and PNG Formats</h3>

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
                            <li>Small file size (10:1 compression ratio)</li>
                            <li>Universal compatibility across all platforms</li>
                            <li>Ideal for photographs with complex color gradients</li>
                            <li>Adjustable compression levels for quality/size balance</li>
                            <li>Faster loading times on websites</li>
                            <li>Excellent for email attachments and social media</li>
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
                            <li>Limited for professional editing workflows</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Photographs, complex images, web images where transparency isn't needed, social media sharing, email attachments</p>
            </div>

            <div class="format-box">
                <h3>PNG (Portable Network Graphics)</h3>
                <p>PNG was developed as an improved, non-patented replacement for GIF, offering lossless compression and transparency support for high-quality digital images.</p>

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
                            <li>Supports 24-bit RGB or 32-bit RGBA color</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Larger file size than JPG for photographs</li>
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

        <h3 class="section-title">JPG vs PNG: Detailed Comparison</h3>

        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>JPG</th>
                <th>PNG</th>
            </tr>
            <tr>
                <td>Compression Type</td>
                <td>Lossy</td>
                <td>Lossless</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Not supported</td>
                <td>Fully supported (alpha channel)</td>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Smaller (for photos)</td>
                <td>Larger</td>
            </tr>
            <tr>
                <td>Color Depth</td>
                <td>Up to 24-bit (16.7 million colors)</td>
                <td>Up to 48-bit (trillions of colors)</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Photographs, complex images</td>
                <td>Graphics, logos, text, screenshots</td>
            </tr>
            <tr>
                <td>Quality Loss</td>
                <td>Yes, with each save</td>
                <td>No loss with edits</td>
            </tr>
            <tr>
                <td>Web Usage</td>
                <td>Photos, backgrounds</td>
                <td>Logos, icons, graphics</td>
            </tr>
            <tr>
                <td>Metadata Support</td>
                <td>EXIF, XMP, IPTC</td>
                <td>Limited metadata</td>
            </tr>
            <tr>
                <td>Browser Support</td>
                <td>All browsers since 1990s</td>
                <td>All modern browsers</td>
            </tr>
        </table>

        <div class="why-convert">
            <h3>Why Convert JPG to PNG?</h3>
            <ul>
                <li><strong>Add transparency:</strong> PNG supports alpha channel transparency, allowing you to create images with transparent backgrounds that blend seamlessly with any website or design.</li>
                <li><strong>Preserve quality:</strong> Converting to PNG prevents further quality loss during editing, ensuring your images remain crisp and clear through multiple edits.</li>
                <li><strong>Better for graphics:</strong> PNG is superior for images with text, sharp edges, or solid colors, making it ideal for logos, icons, and digital illustrations.</li>
                <li><strong>Avoid compression artifacts:</strong> PNG's lossless compression eliminates the blocky artifacts that can appear in JPG images, especially around text and high-contrast areas.</li>
                <li><strong>Professional design work:</strong> PNG is preferred for design assets that need to maintain quality and detail, making it essential for professional graphic design workflows.</li>
                <li><strong>Digital art preservation:</strong> PNG's lossless nature makes it perfect for archiving digital artwork without quality degradation over time.</li>
                <li><strong>Web graphics:</strong> For website elements that need crisp edges and transparency, PNG is the industry standard format.</li>
            </ul>
        </div>

        <p class="conclusion">Our JPG to PNG converter tool makes this conversion process simple and efficient, helping you optimize your images for any purpose that requires the PNG format. With just a few clicks, you can transform your JPG images into high-quality PNG files with all the benefits of lossless compression and transparency support.</p>
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
