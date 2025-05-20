/**
 * JPG to PDF Converter - Image Conversion Tool
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
 * Initialize the JPG to PDF converter tool
 */
function initializeConverter() {
    const toolMainContent = document.getElementById('tool-main-content');
    
    // Create the converter HTML
    const converterHTML = `
        <div class="converter-app">
            <div class="upload-container" id="uploadContainer">
                <p><i class="fas fa-cloud-upload-alt" style="font-size: 2.5rem; margin-bottom: 1rem; color: var(--primary-color);"></i></p>
                <p>Drag & Drop your JPG images here or</p>
                <button type="button" class="upload-btn" id="uploadBtn">
                    <i class="fas fa-file-upload"></i> Choose Files
                </button>
                <input type="file" id="fileInput" accept=".jpg,.jpeg" multiple class="hidden" aria-label="Upload JPG Images" title="Upload JPG Images">
                <p class="file-info">Supports: JPG/JPEG (Multiple files allowed)</p>
            </div>

            <div class="controls hidden" id="controls">
                <div class="control-group">
                    <label>Page Settings:</label>
                    <div class="page-settings">
                        <div class="page-setting">
                            <label for="pageSize">Page Size:</label>
                            <select id="pageSize">
                                <option value="a4">A4 (Default)</option>
                                <option value="letter">Letter</option>
                                <option value="legal">Legal</option>
                                <option value="fit">Fit to Image</option>
                            </select>
                        </div>
                        <div class="page-setting">
                            <label for="pageOrientation">Orientation:</label>
                            <select id="pageOrientation">
                                <option value="portrait">Portrait</option>
                                <option value="landscape">Landscape</option>
                                <option value="auto">Auto (Based on Image)</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label>Margins (mm):</label>
                    <div class="margin-controls">
                        <div class="margin-control">
                            <label for="marginTop">Top:</label>
                            <input type="number" id="marginTop" min="0" max="100" value="10">
                        </div>
                        <div class="margin-control">
                            <label for="marginRight">Right:</label>
                            <input type="number" id="marginRight" min="0" max="100" value="10">
                        </div>
                        <div class="margin-control">
                            <label for="marginBottom">Bottom:</label>
                            <input type="number" id="marginBottom" min="0" max="100" value="10">
                        </div>
                        <div class="margin-control">
                            <label for="marginLeft">Left:</label>
                            <input type="number" id="marginLeft" min="0" max="100" value="10">
                        </div>
                    </div>
                </div>
                
                <div class="control-group">
                    <label for="imageQuality">Image Quality:</label>
                    <input type="range" id="imageQuality" class="quality-slider" min="1" max="100" value="90">
                    <span id="qualityValue">90%</span>
                    <p class="file-info">Higher quality = larger file size. Lower quality = smaller file size.</p>
                </div>
                
                <div class="control-group">
                    <label for="imageFit">Image Fit:</label>
                    <select id="imageFit">
                        <option value="contain">Contain (Preserve aspect ratio)</option>
                        <option value="fill">Fill (Stretch to page)</option>
                        <option value="cover">Cover (Crop to fill)</option>
                    </select>
                </div>
                
                <div class="control-group">
                    <label for="addPageNumbers">
                        <input type="checkbox" id="addPageNumbers"> Add page numbers
                    </label>
                </div>
            </div>

            <div class="image-list-container hidden" id="imageListContainer">
                <h2 class="preview-heading">Image List</h2>
                <p class="drag-info">Drag images to reorder them in the PDF</p>
                <div class="image-list" id="imageList"></div>
                <div class="info" id="imageCount"></div>
            </div>

            <div class="buttons hidden" id="actionButtons">
                <button type="button" class="convert-btn" id="convertBtn">
                    <i class="fas fa-file-pdf"></i> Convert to PDF
                </button>
                <button type="button" class="download-btn hidden" id="downloadBtn">
                    <i class="fas fa-download"></i> Download PDF
                </button>
            </div>

            <div class="loading hidden" id="loading">
                <div class="spinner"></div>
                <p>Converting images to PDF...</p>
            </div>

            <div class="error-message hidden" id="errorMessage"></div>
        </div>
    `;
    
    // Insert the HTML into the tool main content
    toolMainContent.innerHTML = converterHTML;
    
    // Add CSS for image list
    const style = document.createElement('style');
    style.textContent = `
        .image-list-container {
            padding: 1.5rem;
            background-color: var(--white);
            border-radius: var(--border-radius);
            margin-bottom: 1.5rem;
            border: 1px solid var(--gray-200);
        }
        
        .drag-info {
            text-align: center;
            color: var(--gray-600);
            margin-bottom: 1rem;
            font-style: italic;
        }
        
        .image-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
            gap: 1rem;
            margin-bottom: 1rem;
        }
        
        .image-item {
            position: relative;
            border: 1px solid var(--gray-300);
            border-radius: var(--border-radius);
            overflow: hidden;
            cursor: move;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .image-item:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .image-item img {
            width: 100%;
            height: 150px;
            object-fit: cover;
            display: block;
        }
        
        .image-item .image-name {
            padding: 0.5rem;
            font-size: 0.8rem;
            background-color: var(--gray-100);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        
        .image-item .remove-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background-color: rgba(255, 255, 255, 0.8);
            border: none;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            color: var(--error-color);
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.2s;
        }
        
        .image-item:hover .remove-btn {
            opacity: 1;
        }
        
        .image-item.dragging {
            opacity: 0.5;
            border: 2px dashed var(--primary-color);
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
    const pageSize = document.getElementById('pageSize');
    const pageOrientation = document.getElementById('pageOrientation');
    const marginTop = document.getElementById('marginTop');
    const marginRight = document.getElementById('marginRight');
    const marginBottom = document.getElementById('marginBottom');
    const marginLeft = document.getElementById('marginLeft');
    const imageQuality = document.getElementById('imageQuality');
    const qualityValue = document.getElementById('qualityValue');
    const imageFit = document.getElementById('imageFit');
    const addPageNumbers = document.getElementById('addPageNumbers');
    const imageListContainer = document.getElementById('imageListContainer');
    const imageList = document.getElementById('imageList');
    const imageCount = document.getElementById('imageCount');
    const actionButtons = document.getElementById('actionButtons');
    const convertBtn = document.getElementById('convertBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    // Variables
    let uploadedImages = [];
    let pdfBlob = null;

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
            handleFileUpload(e.dataTransfer.files);
        }
    });

    uploadBtn.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length) {
            handleFileUpload(e.target.files);
        }
    });

    imageQuality.addEventListener('input', () => {
        qualityValue.textContent = imageQuality.value + '%';
    });

    convertBtn.addEventListener('click', convertToPdf);
    downloadBtn.addEventListener('click', downloadPdf);

    // Functions
    function handleFileUpload(files) {
        // Filter for JPG/JPEG files
        const jpgFiles = Array.from(files).filter(file => 
            file.type === 'image/jpeg' || file.name.toLowerCase().endsWith('.jpg') || file.name.toLowerCase().endsWith('.jpeg')
        );
        
        if (jpgFiles.length === 0) {
            showNotification('Please select JPG/JPEG images.', 'error');
            return;
        }

        hideError();
        
        // Process each file
        const promises = jpgFiles.map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    // Create an image element to get dimensions
                    const img = new Image();
                    img.onload = () => {
                        resolve({
                            file: file,
                            dataUrl: e.target.result,
                            width: img.width,
                            height: img.height
                        });
                    };
                    img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
                    img.src = e.target.result;
                };
                reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
                reader.readAsDataURL(file);
            });
        });
        
        // Wait for all images to load
        Promise.all(promises)
            .then(images => {
                // Add to uploaded images
                uploadedImages = [...uploadedImages, ...images];
                
                // Update image list
                updateImageList();
                
                // Show controls and image list
                controls.classList.remove('hidden');
                imageListContainer.classList.remove('hidden');
                actionButtons.classList.remove('hidden');
                
                // Show success notification
                showNotification(`${images.length} image${images.length > 1 ? 's' : ''} uploaded successfully!`, 'success');
            })
            .catch(error => {
                showError('Error loading images: ' + error.message);
                showNotification('Error loading images. Please try again.', 'error');
            });
    }

    function updateImageList() {
        // Clear the image list
        imageList.innerHTML = '';
        
        // Add each image to the list
        uploadedImages.forEach((image, index) => {
            const imageItem = document.createElement('div');
            imageItem.className = 'image-item';
            imageItem.draggable = true;
            imageItem.dataset.index = index;
            
            imageItem.innerHTML = `
                <img src="${image.dataUrl}" alt="${image.file.name}">
                <div class="image-name">${image.file.name}</div>
                <button type="button" class="remove-btn" data-index="${index}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            
            // Add drag and drop functionality
            imageItem.addEventListener('dragstart', handleDragStart);
            imageItem.addEventListener('dragover', handleDragOver);
            imageItem.addEventListener('dragenter', handleDragEnter);
            imageItem.addEventListener('dragleave', handleDragLeave);
            imageItem.addEventListener('drop', handleDrop);
            imageItem.addEventListener('dragend', handleDragEnd);
            
            // Add remove button functionality
            const removeBtn = imageItem.querySelector('.remove-btn');
            removeBtn.addEventListener('click', () => {
                uploadedImages.splice(index, 1);
                updateImageList();
            });
            
            imageList.appendChild(imageItem);
        });
        
        // Update image count
        imageCount.textContent = `${uploadedImages.length} image${uploadedImages.length !== 1 ? 's' : ''} (${formatTotalSize(uploadedImages.map(img => img.file.size))})`;
    }

    // Drag and drop functionality for reordering images
    let draggedItem = null;
    
    function handleDragStart(e) {
        draggedItem = this;
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', this.dataset.index);
    }
    
    function handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    }
    
    function handleDragEnter(e) {
        e.preventDefault();
        this.classList.add('drag-over');
    }
    
    function handleDragLeave() {
        this.classList.remove('drag-over');
    }
    
    function handleDrop(e) {
        e.preventDefault();
        this.classList.remove('drag-over');
        
        if (draggedItem !== this) {
            const fromIndex = parseInt(draggedItem.dataset.index);
            const toIndex = parseInt(this.dataset.index);
            
            // Reorder the images array
            const temp = uploadedImages[fromIndex];
            uploadedImages.splice(fromIndex, 1);
            uploadedImages.splice(toIndex, 0, temp);
            
            // Update the image list
            updateImageList();
        }
    }
    
    function handleDragEnd() {
        this.classList.remove('dragging');
        draggedItem = null;
    }

    function convertToPdf() {
        if (uploadedImages.length === 0) {
            showNotification('Please upload at least one JPG image.', 'error');
            return;
        }

        // Show loading indicator
        loading.classList.remove('hidden');
        
        // Hide download button while converting
        downloadBtn.classList.add('hidden');

        // Use setTimeout to allow the UI to update before the conversion starts
        setTimeout(() => {
            try {
                // Get PDF settings
                const settings = {
                    pageSize: pageSize.value,
                    pageOrientation: pageOrientation.value,
                    margins: {
                        top: parseInt(marginTop.value),
                        right: parseInt(marginRight.value),
                        bottom: parseInt(marginBottom.value),
                        left: parseInt(marginLeft.value)
                    },
                    quality: parseInt(imageQuality.value) / 100,
                    imageFit: imageFit.value,
                    addPageNumbers: addPageNumbers.checked
                };
                
                // Create PDF
                const { jsPDF } = window.jspdf;
                
                // Determine orientation for each image if auto is selected
                const getOrientation = (image) => {
                    if (settings.pageOrientation !== 'auto') return settings.pageOrientation;
                    return image.width > image.height ? 'landscape' : 'portrait';
                };
                
                // Determine page size if fit to image is selected
                const getPageSize = (image, orientation) => {
                    if (settings.pageSize !== 'fit') return settings.pageSize;
                    
                    // Convert pixels to mm (assuming 96 DPI)
                    const widthInMm = image.width * 0.264583;
                    const heightInMm = image.height * 0.264583;
                    
                    return [widthInMm, heightInMm];
                };
                
                // Create PDF with first image's settings
                const firstOrientation = getOrientation(uploadedImages[0]);
                const firstPageSize = getPageSize(uploadedImages[0], firstOrientation);
                
                const doc = new jsPDF({
                    orientation: firstOrientation,
                    unit: 'mm',
                    format: firstPageSize
                });
                
                // Add each image to the PDF
                uploadedImages.forEach((image, index) => {
                    // Add a new page for all images except the first one
                    if (index > 0) {
                        const orientation = getOrientation(image);
                        const pageSize = getPageSize(image, orientation);
                        
                        doc.addPage(pageSize, orientation);
                    }
                    
                    // Get page dimensions
                    const pageWidth = doc.internal.pageSize.getWidth();
                    const pageHeight = doc.internal.pageSize.getHeight();
                    
                    // Calculate effective dimensions (accounting for margins)
                    const effectiveWidth = pageWidth - settings.margins.left - settings.margins.right;
                    const effectiveHeight = pageHeight - settings.margins.top - settings.margins.bottom;
                    
                    // Calculate image dimensions based on fit setting
                    let imgWidth, imgHeight, x, y;
                    
                    if (settings.imageFit === 'contain') {
                        // Preserve aspect ratio and fit within margins
                        const ratio = Math.min(effectiveWidth / image.width, effectiveHeight / image.height);
                        imgWidth = image.width * ratio;
                        imgHeight = image.height * ratio;
                        
                        // Center the image
                        x = settings.margins.left + (effectiveWidth - imgWidth) / 2;
                        y = settings.margins.top + (effectiveHeight - imgHeight) / 2;
                    } else if (settings.imageFit === 'fill') {
                        // Stretch to fill the entire effective area
                        imgWidth = effectiveWidth;
                        imgHeight = effectiveHeight;
                        x = settings.margins.left;
                        y = settings.margins.top;
                    } else { // cover
                        // Preserve aspect ratio and cover the entire effective area
                        const ratio = Math.max(effectiveWidth / image.width, effectiveHeight / image.height);
                        imgWidth = image.width * ratio;
                        imgHeight = image.height * ratio;
                        
                        // Center the image (this will crop the overflow)
                        x = settings.margins.left + (effectiveWidth - imgWidth) / 2;
                        y = settings.margins.top + (effectiveHeight - imgHeight) / 2;
                    }
                    
                    // Add the image to the PDF
                    doc.addImage(
                        image.dataUrl,
                        'JPEG',
                        x,
                        y,
                        imgWidth,
                        imgHeight,
                        `image-${index}`,
                        'MEDIUM',
                        0
                    );
                    
                    // Add page number if enabled
                    if (settings.addPageNumbers) {
                        doc.setFontSize(10);
                        doc.setTextColor(100, 100, 100);
                        doc.text(
                            `Page ${index + 1} of ${uploadedImages.length}`,
                            pageWidth / 2,
                            pageHeight - 5,
                            { align: 'center' }
                        );
                    }
                });
                
                // Convert to blob
                pdfBlob = doc.output('blob');
                
                // Hide loading indicator
                loading.classList.add('hidden');
                
                // Show download button
                downloadBtn.classList.remove('hidden');
                
                // Show success notification
                showNotification('Images converted to PDF successfully!', 'success');
            } catch (error) {
                loading.classList.add('hidden');
                showError('Error converting images to PDF: ' + error.message);
                showNotification('Error converting images to PDF: ' + error.message, 'error');
            }
        }, 100);
    }

    function downloadPdf() {
        if (!pdfBlob) {
            showNotification('Please convert the images to PDF first.', 'error');
            return;
        }
        
        // Create a link element
        const link = document.createElement('a');
        
        // Set download name
        let filename = 'images.pdf';
        if (uploadedImages.length === 1) {
            // Use the original filename if only one image
            filename = uploadedImages[0].file.name.replace(/\.[^/.]+$/, '') + '.pdf';
        }
        
        link.href = URL.createObjectURL(pdfBlob);
        link.download = filename;
        link.click();
        
        // Show success notification
        showNotification('PDF downloaded successfully!', 'success');
    }

    function formatTotalSize(sizes) {
        const totalBytes = sizes.reduce((total, size) => total + size, 0);
        
        if (totalBytes < 1024) return totalBytes + ' bytes';
        else if (totalBytes < 1048576) return (totalBytes / 1024).toFixed(1) + ' KB';
        else return (totalBytes / 1048576).toFixed(1) + ' MB';
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
            <p class="highlight-text">JPG to PDF conversion transforms JPEG images into PDF documents. This conversion is particularly useful when you need to combine multiple photos into a single document, create professional reports with images, or ensure your images are in a universally readable format for sharing and printing.</p>
        </div>
        
        <h3 class="section-title">Understanding JPG and PDF Formats</h3>
        
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
                            <li>Cannot contain multiple pages</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Photographs, complex images, universal sharing, email attachments, print materials, social media</p>
            </div>
            
            <div class="format-box">
                <h3>PDF (Portable Document Format)</h3>
                <p>PDF is a file format developed by Adobe to present documents consistently across all platforms and software.</p>
                
                <div class="format-details">
                    <p><strong>Development:</strong> Created by Adobe in 1993</p>
                    <p><strong>File Extension:</strong> .pdf</p>
                    <p><strong>Type:</strong> Fixed-layout document format</p>
                    <p><strong>Compression:</strong> Various compression methods</p>
                </div>
                
                <div class="pros-cons">
                    <div class="pros">
                        <h4>Pros</h4>
                        <ul>
                            <li>Preserves exact formatting across all devices</li>
                            <li>Supports multiple pages in a single file</li>
                            <li>Professional appearance</li>
                            <li>Can be secured with passwords and permissions</li>
                            <li>Widely accepted for official documents</li>
                            <li>Print-ready format</li>
                        </ul>
                    </div>
                    <div class="cons">
                        <h4>Cons</h4>
                        <ul>
                            <li>Larger file size than individual JPGs</li>
                            <li>Not easily editable without specialized software</li>
                            <li>More complex to create from scratch</li>
                            <li>May require additional software to view (though widely available)</li>
                            <li>Not ideal for collaborative editing</li>
                            <li>Image extraction can be challenging</li>
                        </ul>
                    </div>
                </div>
                <p class="format-usage"><strong>Best used for:</strong> Documents with images, reports, forms, publications, manuals, brochures, and any content where layout preservation is important</p>
            </div>
        </div>
        
        <h3 class="section-title">JPG vs PDF: Detailed Comparison</h3>
        
        <table class="comparison-table">
            <tr>
                <th>Feature</th>
                <th>JPG</th>
                <th>PDF</th>
            </tr>
            <tr>
                <td>Multiple Pages</td>
                <td>Not supported</td>
                <td>Supported</td>
            </tr>
            <tr>
                <td>Image Quality</td>
                <td>Lossy compression</td>
                <td>Can preserve original quality</td>
            </tr>
            <tr>
                <td>File Size</td>
                <td>Smaller (individual files)</td>
                <td>Larger (combined document)</td>
            </tr>
            <tr>
                <td>Document Features</td>
                <td>None</td>
                <td>Page numbers, bookmarks, links</td>
            </tr>
            <tr>
                <td>Professional Appearance</td>
                <td>Basic</td>
                <td>Professional</td>
            </tr>
            <tr>
                <td>Security Features</td>
                <td>None</td>
                <td>Passwords, permissions</td>
            </tr>
            <tr>
                <td>Printing Quality</td>
                <td>Good</td>
                <td>Excellent</td>
            </tr>
            <tr>
                <td>Sharing Multiple Images</td>
                <td>Requires multiple files</td>
                <td>Single file</td>
            </tr>
        </table>
        
        <div class="why-convert">
            <h3>Why Convert JPG to PDF?</h3>
            <ul>
                <li><strong>Combine multiple images:</strong> Create a single document from multiple JPG images.</li>
                <li><strong>Professional presentation:</strong> Present images in a more professional, document-like format.</li>
                <li><strong>Easier sharing:</strong> Share multiple images as a single file instead of multiple attachments.</li>
                <li><strong>Document features:</strong> Add page numbers, bookmarks, and other document features.</li>
                <li><strong>Print preparation:</strong> Create print-ready documents with proper page formatting.</li>
                <li><strong>Security:</strong> Add password protection or restrict permissions for sensitive images.</li>
                <li><strong>Universal readability:</strong> Ensure your images can be viewed on virtually any device.</li>
                <li><strong>Organization:</strong> Keep related images together in a structured document.</li>
            </ul>
        </div>
        
        <p class="conclusion">Our JPG to PDF converter tool makes this conversion process simple and efficient, helping you transform your JPG images into professional PDF documents. With customizable page settings, image arrangement, and formatting options, you can create PDFs that perfectly suit your needs while maintaining the quality of your original images.</p>
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
