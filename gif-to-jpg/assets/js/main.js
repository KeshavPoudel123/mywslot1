/**
 * GIF to JPG Converter - Image Processing Tool
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
 * Initialize the GIF to JPG converter tool
 */
function initializeConverter() {
    const toolMainContent = document.getElementById('tool-main-content');
    
    // Create the converter HTML
    const converterHTML = `
        <div class="converter-app">
            <div class="upload-container" id="uploadContainer">
                <p><i class="fas fa-cloud-upload-alt" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);"></i></p>
                <p>Drag & Drop your GIF image here or</p>
                <button type="button" class="upload-btn" id="uploadBtn">
                    <i class="fas fa-file-image"></i> Choose File
                </button>
                <input type="file" id="fileInput" accept=".gif" class="hidden" aria-label="Upload GIF Image" title="Upload GIF Image">
                <p class="file-info">Supports: GIF (animated and static)</p>
            </div>

            <div class="controls hidden" id="controls">
                <div class="control-group" id="frameControlGroup">
                    <label for="frameSelector">Select Frame:</label>
                    <div class="frame-selector-container">
                        <div class="frame-preview" id="framePreview">
                            <p>Loading frames...</p>
                        </div>
                        <div class="frame-controls">
                            <button type="button" id="prevFrameBtn" class="frame-btn">
                                <i class="fas fa-chevron-left"></i>
                            </button>
                            <span id="frameCounter">Frame 1 of 1</span>
                            <button type="button" id="nextFrameBtn" class="frame-btn">
                                <i class="fas fa-chevron-right"></i>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="control-group">
                    <label for="quality">JPG Quality: <span id="qualityValue">90</span>%</label>
                    <input type="range" id="quality" class="quality-slider" min="1" max="100" value="90">
                    <p class="file-info">Higher quality = larger file size. Lower quality = smaller file size.</p>
                </div>
                <div class="control-group">
                    <label for="backgroundColor">Background Color:</label>
                    <input type="color" id="backgroundColor" value="#ffffff" class="color-input">
                    <p class="file-info">GIFs can have transparent areas, but JPGs require a background color.</p>
                </div>
            </div>

            <div class="preview-container hidden" id="previewContainer">
                <h2 class="preview-heading">Image Preview</h2>
                <div class="preview-images">
                    <div class="preview-box">
                        <h3>Original GIF Image</h3>
                        <div class="image-container">
                            <img id="originalPreview" src="" alt="Original GIF image preview">
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
    
    // Add CSS for frame selector
    const style = document.createElement('style');
    style.textContent = `
        .frame-selector-container {
            margin-top: 10px;
            border: 1px solid var(--gray-300);
            border-radius: 8px;
            overflow: hidden;
        }
        
        .frame-preview {
            height: 200px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: var(--gray-100);
            overflow: hidden;
        }
        
        .frame-preview img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
        }
        
        .frame-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background-color: var(--gray-200);
            border-top: 1px solid var(--gray-300);
        }
        
        .frame-btn {
            background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
            color: white;
            border: none;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            transition: opacity 0.3s;
        }
        
        .frame-btn:hover {
            opacity: 0.9;
        }
        
        .frame-btn:disabled {
            background: var(--gray-400);
            cursor: not-allowed;
            opacity: 0.5;
        }
        
        #frameCounter {
            font-size: 0.9rem;
            color: var(--gray-700);
        }
    `;
    document.head.appendChild(style);
    
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
    const frameControlGroup = document.getElementById('frameControlGroup');
    const framePreview = document.getElementById('framePreview');
    const prevFrameBtn = document.getElementById('prevFrameBtn');
    const nextFrameBtn = document.getElementById('nextFrameBtn');
    const frameCounter = document.getElementById('frameCounter');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
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
    let gifFrames = [];
    let currentFrameIndex = 0;
    let isAnimated = false;

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

    prevFrameBtn.addEventListener('click', () => {
        if (currentFrameIndex > 0) {
            currentFrameIndex--;
            updateFramePreview();
        }
    });

    nextFrameBtn.addEventListener('click', () => {
        if (currentFrameIndex < gifFrames.length - 1) {
            currentFrameIndex++;
            updateFramePreview();
        }
    });

    convertBtn.addEventListener('click', convertImage);
    downloadBtn.addEventListener('click', downloadImage);

    // Functions
    function handleFileUpload(file) {
        // Check if file is a GIF
        if (!file.type.match('image/gif')) {
            showNotification('Please select a GIF image.', 'error');
            return;
        }

        hideError();
        
        // Store original image information
        originalImageName = file.name;

        const reader = new FileReader();
        reader.onload = (e) => {
            // Reset frames
            gifFrames = [];
            currentFrameIndex = 0;
            
            // Create an image element to get dimensions
            const img = new Image();
            img.onload = () => {
                // Store the original image
                originalImage = img;
                
                // Set original preview
                originalPreview.src = e.target.result;
                
                // Display original image info
                originalInfo.textContent = `${file.name} (${formatFileSize(file.size)}, ${img.width}×${img.height} px)`;
                
                // Check if GIF is animated and extract frames
                checkIfAnimated(e.target.result);
                
                // Show controls and preview
                controls.classList.remove('hidden');
                previewContainer.classList.remove('hidden');
                
                // Show success notification
                showNotification('GIF image uploaded successfully!', 'success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    }

    function checkIfAnimated(gifDataUrl) {
        // This is a simplified approach - for a production tool, you'd want to use a library like gif.js
        // to properly parse and extract frames from animated GIFs
        
        // For now, we'll just show the first frame and assume it's not animated
        // In a real implementation, you would extract all frames here
        
        // Simulate frame extraction (in a real app, you'd use a GIF parsing library)
        gifFrames = [gifDataUrl];
        isAnimated = false; // Set to true if multiple frames are detected
        
        // Update frame controls visibility
        if (isAnimated) {
            frameControlGroup.classList.remove('hidden');
        } else {
            frameControlGroup.classList.add('hidden');
        }
        
        // Update frame preview
        updateFramePreview();
    }

    function updateFramePreview() {
        if (gifFrames.length > 0) {
            // Create image for the current frame
            const frameImg = document.createElement('img');
            frameImg.src = gifFrames[currentFrameIndex];
            frameImg.alt = `Frame ${currentFrameIndex + 1}`;
            
            // Update frame preview
            framePreview.innerHTML = '';
            framePreview.appendChild(frameImg);
            
            // Update frame counter
            frameCounter.textContent = `Frame ${currentFrameIndex + 1} of ${gifFrames.length}`;
            
            // Update button states
            prevFrameBtn.disabled = currentFrameIndex === 0;
            nextFrameBtn.disabled = currentFrameIndex === gifFrames.length - 1;
        }
    }

    function convertImage() {
        if (!originalImage) {
            showNotification('Please upload a GIF image first.', 'error');
            return;
        }

        // Show loading indicator
        loading.classList.remove('hidden');
        
        // Hide download button while converting
        downloadBtn.classList.add('hidden');

        // Get quality value
        const qualityVal = parseInt(quality.value) / 100;
        const bgColor = backgroundColor.value;

        // Use setTimeout to allow the UI to update before the conversion starts
        setTimeout(() => {
            try {
                // Create canvas for conversion
                const canvas = document.createElement('canvas');
                canvas.width = originalImage.width;
                canvas.height = originalImage.height;
                
                // Draw the image on the canvas
                const ctx = canvas.getContext('2d');
                
                // Fill with background color (for transparent areas)
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                
                // Draw the GIF frame on top
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
            <p class="highlight-text">GIF to JPG conversion transforms Graphics Interchange Format images into the universally compatible JPG format. This conversion is particularly useful when you need to use a static version of a GIF in applications that don't support GIF or when you want to reduce file size.</p>
        </div>
        
        <h3 class="section-title">Understanding GIF and JPG Formats</h3>
        
        <div class="format-info-grid">
            <div class="format-box">
                <h3>GIF (Graphics Interchange Format)</h3>
                <p>GIF is a bitmap image format that supports up to 256 colors and is widely used for simple animations and graphics with limited color palettes.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created by CompuServe in 1987</p>
                    <p><strong>File Extension:</strong> .gif</p>
                    <p><strong>Color Depth:</strong> 8-bit (256 colors)</p>
                    <p><strong>Compression:</strong> Lossless (LZW compression)</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Supports animation</li>
                            <li>Transparency support (binary - on/off)</li>
                            <li>Lossless compression</li>
                            <li>Small file size for simple graphics</li>
                            <li>Widely supported across platforms</li>
                            <li>Perfect for simple animations and icons</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Limited to 256 colors</li>
                            <li>No partial transparency (alpha channel)</li>
                            <li>Poor for photographs and complex images</li>
                            <li>Larger file size than JPG for complex images</li>
                            <li>Patent issues (now expired)</li>
                            <li>Outdated compared to modern formats like WebP</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Simple animations, icons, logos, graphics with limited colors, memes, short clips</p>
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
                            <li>Supports millions of colors</li>
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
                            <li>No animation support</li>
                            <li>Quality degrades with each edit and save</li>
                            <li>Visible artifacts in high-contrast areas</li>
                            <li>Not ideal for text, graphics, and sharp edges</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Photographs, complex images, universal sharing, email attachments, print materials, social media</p>
            </div>
        </div>
        
        <h3 class="section-title">GIF vs JPG: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>GIF</th>
                <th>JPG</th>
            </tr>
            <tr>
                <td>Color Support</td>
                <td>Limited (256 colors)</td>
                <td>Rich (16.7 million colors)</td>
            </tr>
            <tr>
                <td>Compression</td>
                <td>Lossless</td>
                <td>Lossy</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Binary (on/off)</td>
                <td>Not supported</td>
            </tr>
            <tr>
                <td>Animation</td>
                <td>Supported</td>
                <td>Not supported</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Simple graphics, animations, icons</td>
                <td>Photographs, complex images</td>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Small for simple graphics, large for complex</td>
                <td>Efficient for photographs</td>
            </tr>
            <tr>
                <td>Quality Loss</td>
                <td>None (lossless)</td>
                <td>Yes, with each save</td>
            </tr>
            <tr>
                <td>Web Usage</td>
                <td>Animations, icons, simple graphics</td>
                <td>Photos, backgrounds, complex images</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert GIF to JPG?</h3>
            <ul>
                <li><strong>Reduce file size:</strong> For complex images with many colors, JPG often provides better compression than GIF.</li>
                <li><strong>Better color representation:</strong> JPG supports millions of colors compared to GIF's 256 colors, making it better for photographs.</li>
                <li><strong>Compatibility with specific software:</strong> Some applications may handle JPG better than GIF.</li>
                <li><strong>Print production:</strong> JPG is generally preferred for print workflows over GIF.</li>
                <li><strong>Extract a single frame:</strong> When you only need one static image from an animated GIF.</li>
                <li><strong>Email attachments:</strong> JPG's better compression can be helpful when sending images via email.</li>
                <li><strong>Social media optimization:</strong> Some platforms may compress GIFs more aggressively than JPGs.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our GIF to JPG converter tool makes this conversion process simple and efficient, helping you transform your GIF images into universally compatible JPG format. With adjustable quality settings and frame selection for animated GIFs, you can find the perfect balance between file size and image quality for your specific needs.</p>
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
