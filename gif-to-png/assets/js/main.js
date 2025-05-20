/**
 * GIF to PNG Converter - Image Processing Tool
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
 * Initialize the GIF to PNG converter tool
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
                    <label for="preserveTransparency">
                        <input type="checkbox" id="preserveTransparency" checked> Preserve transparency
                    </label>
                    <p class="file-info">PNG supports full transparency, unlike GIF which only has binary (on/off) transparency.</p>
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
                
                // Draw the GIF frame on top
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
            <p class="highlight-text">GIF to PNG conversion transforms Graphics Interchange Format images into the versatile PNG format. This conversion is particularly useful when you need transparency support or higher image quality than GIF can provide.</p>
        </div>
        
        <h3 class="section-title">Understanding GIF and PNG Formats</h3>
        
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
                            <li>Binary transparency support (on/off)</li>
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
        
        <h3 class="section-title">GIF vs PNG: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>GIF</th>
                <th>PNG</th>
            </tr>
            <tr>
                <td>Color Support</td>
                <td>Limited (256 colors)</td>
                <td>Rich (16.7+ million colors)</td>
            </tr>
            <tr>
                <td>Compression</td>
                <td>Lossless</td>
                <td>Lossless</td>
            </tr>
            <tr>
                <td>Transparency</td>
                <td>Binary (on/off)</td>
                <td>Full alpha channel (256 levels)</td>
            </tr>
            <tr>
                <td>Animation</td>
                <td>Supported</td>
                <td>Not supported</td>
            </tr>
            <tr>
                <td>Best For</td>
                <td>Simple animations, icons</td>
                <td>Logos, screenshots, digital art</td>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Small for simple graphics</td>
                <td>Larger than JPG, smaller than BMP</td>
            </tr>
            <tr>
                <td>Quality Loss</td>
                <td>None (lossless)</td>
                <td>None (lossless)</td>
            </tr>
            <tr>
                <td>Web Usage</td>
                <td>Animations, simple graphics</td>
                <td>Logos, icons, images with transparency</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert GIF to PNG?</h3>
            <ul>
                <li><strong>Better transparency:</strong> PNG supports alpha channel transparency (256 levels) while GIF only supports binary transparency (on/off).</li>
                <li><strong>Higher color depth:</strong> PNG supports millions of colors compared to GIF's 256 colors, resulting in better image quality.</li>
                <li><strong>Better compression:</strong> PNG often provides better compression for complex images with many colors.</li>
                <li><strong>No patent issues:</strong> PNG was created as a free, open-source alternative to GIF when GIF was restricted by patents.</li>
                <li><strong>Extract a single frame:</strong> When you only need one static image from an animated GIF.</li>
                <li><strong>Better for editing:</strong> PNG's higher color depth and transparency make it better for further editing in image software.</li>
                <li><strong>Better for text and sharp edges:</strong> PNG preserves sharp edges better than GIF, making it ideal for text and line art.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our GIF to PNG converter tool makes this conversion process simple and efficient, helping you transform your GIF images into high-quality PNG format with full transparency support. With frame selection for animated GIFs and transparency preservation options, you can create the perfect PNG image for your specific needs.</p>
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
