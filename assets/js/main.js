/**
 * Latest Online Tools - Main JavaScript
 * Handles dynamic content, mobile menu, and form validation
 */

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    updateCopyrightYear();

    // Initialize mobile menu
    initMobileMenu();

    // Populate latest tools
    populateLatestTools();

    // Initialize newsletter form
    initNewsletterForm();
});

/**
 * Updates the copyright year in the footer
 */
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Initializes the mobile menu toggle functionality and search toggle
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNavContainer = document.querySelector('.main-nav');
    const mainNav = document.querySelector('.main-nav ul');
    const searchToggle = document.getElementById('search-toggle');
    const mobileSearch = document.querySelector('.mobile-search');

    // Create close button for mobile menu
    if (mainNav && window.innerWidth <= 767) {
        // Remove existing close button if it exists
        const existingCloseButton = mainNav.querySelector('.mobile-menu-close');
        if (existingCloseButton) {
            existingCloseButton.remove();
        }

        const closeButton = document.createElement('div');
        closeButton.className = 'mobile-menu-close';
        closeButton.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';
        closeButton.style.display = 'flex';
        closeButton.style.alignItems = 'center';
        closeButton.style.justifyContent = 'center';
        closeButton.style.cursor = 'pointer';
        closeButton.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.2)';

        // Append to the mobile menu instead of body
        mainNav.appendChild(closeButton);

        // Add event listener to close button
        closeButton.addEventListener('click', function() {
            mainNavContainer.classList.remove('active');
            mainNav.classList.remove('show');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        });
    }

    // Mobile menu toggle
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mainNavContainer.classList.toggle('active');
            mainNav.classList.toggle('show');
            menuToggle.classList.toggle('active');

            // Prevent body scrolling when menu is open
            if (mainNav.classList.contains('show')) {
                document.body.style.overflow = 'hidden';
                document.body.style.width = '100%'; // Fix width to prevent layout shift
                document.body.style.position = 'fixed'; // Fix position to prevent scrolling
            } else {
                document.body.style.overflow = '';
                document.body.style.width = '';
                document.body.style.position = '';
            }

            // Hide search when menu is toggled
            if (mobileSearch && mobileSearch.classList.contains('show')) {
                mobileSearch.classList.remove('show');
            }
        });
    }

    // Search toggle for mobile
    if (searchToggle && mobileSearch) {
        searchToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            mobileSearch.classList.toggle('show');

            // Focus the search input when shown
            if (mobileSearch.classList.contains('show')) {
                // Hide the search icon when search is open
                searchToggle.style.display = 'none';

                // Position the search box below the header
                const header = document.querySelector('.site-header');
                if (header) {
                    const headerHeight = header.offsetHeight;
                    mobileSearch.style.top = headerHeight + 'px';
                }

                const searchInput = mobileSearch.querySelector('.search-box');
                if (searchInput) {
                    searchInput.focus();
                }

                // Hide menu if it's open
                if (mainNav.classList.contains('show')) {
                    mainNavContainer.classList.remove('active');
                    mainNav.classList.remove('show');
                    menuToggle.classList.remove('active');
                    document.body.style.overflow = '';
                }
            } else {
                // Show the search icon when search is closed
                searchToggle.style.display = 'flex';
            }
        });
    }

    // Close menu when clicking on the overlay
    mainNavContainer && mainNavContainer.addEventListener('click', function(e) {
        if (e.target === mainNavContainer) {
            mainNavContainer.classList.remove('active');
            mainNav.classList.remove('show');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';

            // Hide close button
            const closeButton = document.querySelector('.mobile-menu-close');
            if (closeButton) {
                closeButton.style.display = 'none';
            }
        }
    });

    // Close menu and search when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mainNav && (mainNav.contains(event.target) || (menuToggle && menuToggle.contains(event.target)));
        const isClickInsideSearch = mobileSearch && (mobileSearch.contains(event.target) || (searchToggle && searchToggle.contains(event.target)));

        if (!isClickInsideNav && mainNav && mainNav.classList.contains('show')) {
            mainNavContainer.classList.remove('active');
            mainNav.classList.remove('show');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }

        if (!isClickInsideSearch && mobileSearch && mobileSearch.classList.contains('show')) {
            mobileSearch.classList.remove('show');
            // Show the search icon again when search is closed by clicking outside
            if (searchToggle) {
                searchToggle.style.display = 'flex';
            }
        }
    });

    // Add mobile dropdown functionality
    function setupMobileDropdowns() {
        if (window.innerWidth <= 767) {
            const navItems = document.querySelectorAll('.main-nav ul li');

            // Load tools data for mobile menu using tools-data.js
            window.toolsDataModule.getAllTools()
                .then(toolsData => {
                    // First, hide all dropdown menus by default
                    navItems.forEach(item => {
                        const dropdown = item.querySelector('.dropdown-menu');
                        if (dropdown) {
                            dropdown.style.display = 'none';

                            // If this is the "All Tools" or "Popular Tools" dropdown, populate it with all tools
                            const link = item.querySelector('a');
                            if (link && (link.textContent.includes('All Tools') || link.textContent.includes('Popular Tools'))) {
                                // Clear existing content
                                dropdown.innerHTML = '';

                                // Create a container for all tools
                                const allToolsContainer = document.createElement('div');
                                allToolsContainer.className = 'mobile-all-tools';

                                // Get unique categories from tools
                                const categories = [...new Set(toolsData.map(tool => tool.category))];

                                // Process each category
                                categories.forEach(categoryName => {
                                    // Create category heading
                                    const categoryHeading = document.createElement('h5');
                                    categoryHeading.textContent = categoryName;
                                    categoryHeading.style.textAlign = 'center';
                                    categoryHeading.style.margin = '1rem 0 0.5rem';
                                    categoryHeading.style.borderBottom = '1px solid var(--gray-200)';
                                    categoryHeading.style.paddingBottom = '0.5rem';

                                    allToolsContainer.appendChild(categoryHeading);

                                    // Filter tools for this category
                                    const categoryTools = toolsData.filter(tool => tool.category === categoryName);

                                    // Add tools for this category
                                    categoryTools.forEach((tool, index) => {
                                        const toolLink = document.createElement('a');
                                        toolLink.href = tool.url || '#';

                                        // Create SVG icons with different colors based on category
                                        let iconColor = '#00C4CC';

                                        if (categoryName === 'Image Tools') {
                                            iconColor = index % 2 === 0 ? '#FF5722' : '#FF9800';
                                        } else if (categoryName === 'Developer Tools') {
                                            iconColor = index % 2 === 0 ? '#4CAF50' : '#2196F3';
                                        } else if (categoryName === 'Utility Tools') {
                                            iconColor = index % 2 === 0 ? '#E91E63' : '#9C27B0';
                                        } else if (categoryName === 'Productivity Tools') {
                                            iconColor = index % 2 === 0 ? '#FFC107' : '#03A9F4';
                                        } else if (categoryName === 'Math Tools') {
                                            iconColor = index % 2 === 0 ? '#8BC34A' : '#CDDC39';
                                        } else if (categoryName === 'File Tools') {
                                            iconColor = index % 2 === 0 ? '#FF5722' : '#FF9800';
                                        } else if (categoryName === 'Text Tools') {
                                            iconColor = index % 2 === 0 ? '#00C4CC' : '#6A3BE4';
                                        } else if (categoryName === 'Financial Calculators') {
                                            iconColor = index % 2 === 0 ? '#E91E63' : '#9C27B0';
                                        } else if (categoryName === 'Health Calculators') {
                                            iconColor = index % 2 === 0 ? '#4CAF50' : '#2196F3';
                                        }

                                        toolLink.innerHTML = `
                                            <div class="dropdown-tool-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${iconColor}">
                                                    <path d="${getSVGPathForTool(tool.icon)}"/>
                                                </svg>
                                            </div>
                                            ${tool.name}
                                        `;

                                        allToolsContainer.appendChild(toolLink);
                                    });
                                });

                                dropdown.appendChild(allToolsContainer);
                            }
                        }
                    });

                    // Set up click handlers for dropdown toggles
                    navItems.forEach(item => {
                        const link = item.querySelector('a');
                        if (link && item.querySelector('.dropdown-menu')) {
                            // Remove existing event listeners
                            const newLink = link.cloneNode(true);
                            link.parentNode.replaceChild(newLink, link);

                            // Add new event listener
                            newLink.addEventListener('click', function(e) {
                                // Only prevent default if it has a dropdown
                                if (item.querySelector('.dropdown-menu')) {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    // Close any other open dropdowns
                                    navItems.forEach(otherItem => {
                                        if (otherItem !== item && otherItem.classList.contains('active')) {
                                            otherItem.classList.remove('active');
                                            const otherDropdown = otherItem.querySelector('.dropdown-menu');
                                            if (otherDropdown) {
                                                otherDropdown.style.display = 'none';
                                            }
                                        }
                                    });

                                    // Toggle the active class
                                    item.classList.toggle('active');

                                    // Toggle the dropdown display
                                    const dropdown = item.querySelector('.dropdown-menu');
                                    if (dropdown) {
                                        if (item.classList.contains('active')) {
                                            dropdown.style.display = 'flex';

                                            // Don't move the text to the right
                                            const linkText = newLink.textContent.trim();
                                            newLink.style.transform = 'translateX(0)';

                                            // Scroll to make the dropdown visible if needed
                                            setTimeout(() => {
                                                const rect = dropdown.getBoundingClientRect();
                                                if (rect.bottom > window.innerHeight) {
                                                    item.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                                }
                                            }, 100);
                                        } else {
                                            dropdown.style.display = 'none';
                                            newLink.style.transform = 'translateX(0)';
                                        }
                                    }
                                }
                            });
                        }
                    });
                })
                .catch(error => console.error('Error loading tools data for mobile menu:', error));
        }
    }

    // Helper function to get SVG path for tool icons
    function getSVGPathForTool(iconName) {
        const svgPaths = {
            'edit_note': 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 2l5 5h-5V4zM6 20V4h5v7h7v9H6z',
            'format_list_numbered': 'M3 5H1v16c0 1.1.9 2 2 2h16v-2H3V5zm18-4H7c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V3c0-1.1-.9-2-2-2zm0 16H7V3h14v14zM15 5h-2v6h-2v2h2v2h2v-2h2v-2h-2z',
            'compare_arrows': 'M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z',
            'code': 'M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z',
            'compress': 'M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z',
            'picture_as_pdf': 'M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8.5 7.5c0 .83-.67 1.5-1.5 1.5H9v2H7.5V7H10c.83 0 1.5.67 1.5 1.5v1zm5 2c0 .83-.67 1.5-1.5 1.5h-2.5V7H15c.83 0 1.5.67 1.5 1.5v3zm4-3H19v1h1.5V11H19v2h-1.5V7h3v1.5zM9 9.5h1v-1H9v1zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm10 5.5h1v-3h-1v3z',
            'image': 'M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z',
            'palette': 'M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0 1 12 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 0 0-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 0 1 2.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z',
            'json': 'M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z',
            'html': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z',
            'regex': 'M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z',
            'unit': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z',
            'currency': 'M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z',
            'url': 'M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.88 15.61 22 13.95 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73L13 15.27V17h1.73l4.01 4L20 19.74 3.27 3 2 4.27z',
            'base64': 'M20 5h-9.586L8.707 3.293A.997.997 0 0 0 8 3H4c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V7c0-1.103-.897-2-2-2zm-4 9h-3v3h-2v-3H8v-2h3V9h2v3h3v2z',
            'timer': 'M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z',
            'checklist': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z',
            'grade': 'M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z',
            'home': 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',
            'monitor_weight': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5.97 4.06L14.09 11l1.06 4.06 1.23-4.06L17.44 7h1.48l-2.72 10h-1.5l-1.35-5.51L12 17h-1.5L7.78 7h1.48l1.06 4.06L11.55 7h1.48z',
            'case': 'M5 4v3h5.5v12h3V7H19V4z',
            'lorem': 'M4 5h16v2H4V5zm0 6h16v2H4v-2zm0 6h16v2H4v-2z',
            'format': 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm4.59-12.42L10 14.17l-2.59-2.58L6 13l4 4 8-8z',
            'resize': 'M17 15h2V7c0-1.1-.9-2-2-2H9v2h8v8zM7 17V1H5v4H1v2h4v10c0 1.1.9 2 2 2h10v4h2v-4h4v-2H7z',
            'convert': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54-1.96-2.36L6.5 17h11l-3.54-4.71z',
            'background': 'M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4.86 8.86l-3 3.87L9 13.14 6 17h12l-3.86-5.14z',
            'sql': 'M2 20h20v-4H2v4zm2-3h2v2H4v-2zM2 4v4h20V4H2zm4 3H4V5h2v2zm-4 7h20v-4H2v4zm2-3h2v2H4v-2z',
            'password': 'M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z',
            'qr': 'M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zm13-2h-2v2h2v-2zm0 4h-2v2h2v-2zm-4-2h-2v2h2v-2zm0 4h-2v2h2v-2zm2-8h2v2h-2v-2zm-4 0h2v2h-2v-2zm4 4h2v2h-2v-2z',
            'calculator': 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14h-2V9h-2V7h4v10z',
            'calendar': 'M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z',
            'note': 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z',
            'tip': 'M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm-2 14H7v-2h3v2zm0-4H7v-2h3v2zm0-4H7V7h3v2zm4 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V7h3v2zm4 8h-3v-2h3v2zm0-4h-3v-2h3v2zm0-4h-3V7h3v2z'
        };

        return svgPaths[iconName] || 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z';
    }

    // Call the function initially
    setupMobileDropdowns();

    // Also call it on window resize
    window.addEventListener('resize', function() {
        setupMobileDropdowns();
    });

    // Handle search form submission for both desktop and mobile
    const searchForms = document.querySelectorAll('.search-form');
    if (searchForms.length) {
        searchForms.forEach(form => {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const searchInput = form.querySelector('.search-box');
                const searchTerm = searchInput.value.trim();

                if (searchTerm) {
                    // Implement search functionality here
                    console.log('Searching for:', searchTerm);

                    // For demo purposes, redirect to all-tools.html with search parameter
                    window.location.href = `all-tools.html?search=${encodeURIComponent(searchTerm)}`;
                }
            });
        });
    }

    // Initialize search dropdowns for all pages
    function initSearchDropdowns() {
        // Handle desktop search in index.html
        const desktopSearchInput = document.getElementById('desktop-search-input');
        const desktopSearchDropdown = document.getElementById('desktop-search-dropdown');

        // Handle desktop search in all-tools.html
        const desktopSearchInputAll = document.getElementById('desktop-search-input-all');
        const desktopSearchDropdownAll = document.getElementById('desktop-search-dropdown-all');

        // Handle desktop search in popular-tools.html
        const desktopSearchInputPopular = document.getElementById('desktop-search-input-popular');
        const desktopSearchDropdownPopular = document.getElementById('desktop-search-dropdown-popular');

        // Handle mobile search in index.html
        const mobileSearchInput = document.getElementById('mobile-search-input');
        const mobileSearchDropdown = document.getElementById('mobile-search-dropdown');

        // Handle mobile search in all-tools.html
        const mobileSearchInputAll = document.getElementById('mobile-search-input-all');
        const mobileSearchDropdownAll = document.getElementById('mobile-search-dropdown-all');

        // Handle mobile search in popular-tools.html
        const mobileSearchInputPopular = document.getElementById('mobile-search-input-popular');
        const mobileSearchDropdownPopular = document.getElementById('mobile-search-dropdown-popular');

        // Setup desktop search in index.html
        if (desktopSearchInput && desktopSearchDropdown) {
            setupSearchDropdown(desktopSearchInput, desktopSearchDropdown);
        }

        // Setup desktop search in all-tools.html
        if (desktopSearchInputAll && desktopSearchDropdownAll) {
            setupSearchDropdown(desktopSearchInputAll, desktopSearchDropdownAll);
        }

        // Setup desktop search in popular-tools.html
        if (desktopSearchInputPopular && desktopSearchDropdownPopular) {
            setupSearchDropdown(desktopSearchInputPopular, desktopSearchDropdownPopular);
        }

        // Setup mobile search in index.html
        if (mobileSearchInput && mobileSearchDropdown) {
            setupSearchDropdown(mobileSearchInput, mobileSearchDropdown);
        }

        // Setup mobile search in all-tools.html
        if (mobileSearchInputAll && mobileSearchDropdownAll) {
            setupSearchDropdown(mobileSearchInputAll, mobileSearchDropdownAll);
        }

        // Setup mobile search in popular-tools.html
        if (mobileSearchInputPopular && mobileSearchDropdownPopular) {
            setupSearchDropdown(mobileSearchInputPopular, mobileSearchDropdownPopular);
        }
    }

    // Helper function to setup search dropdown behavior
    function setupSearchDropdown(input, dropdown) {
        // Load tools data
        let toolsData = [];

        // Get tools data from tools-data.js
        window.toolsDataModule.getAllTools()
            .then(data => {
                // Store tools data
                toolsData = data;
            })
            .catch(error => console.error('Error loading tools data:', error));

        input.addEventListener('focus', function() {
            dropdown.style.display = 'block';
        });

        input.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            if (searchTerm) {
                dropdown.style.display = 'block';

                // Filter tools based on search term
                const matchingTools = toolsData.filter(tool =>
                    tool.name.toLowerCase().includes(searchTerm) ||
                    tool.shortDescription.toLowerCase().includes(searchTerm) ||
                    tool.category.toLowerCase().includes(searchTerm)
                );

                // Get the search results container
                const searchResultsContainer = dropdown.querySelector('.search-results');
                if (searchResultsContainer) {
                    // Clear previous results
                    searchResultsContainer.innerHTML = '';

                    // Show matching tools (limit to top 5)
                    const toolsToShow = matchingTools.slice(0, 5);

                    if (toolsToShow.length > 0) {
                        // Update heading
                        const heading = dropdown.querySelector('h5');
                        if (heading) {
                            heading.textContent = 'Matching Tools';
                        }

                        // Add matching tools to results
                        toolsToShow.forEach(tool => {
                            const resultItem = document.createElement('a');
                            resultItem.href = tool.url || '#';
                            resultItem.className = 'search-result-item';

                            resultItem.innerHTML = `
                                <div class="search-result-icon">
                                    <img src="assets/images/tool-icons/${tool.icon}.svg" alt="${tool.name} Icon" width="24" height="24">
                                </div>
                                <div class="search-result-info">
                                    <div class="search-result-title">
                                        ${tool.name}
                                        ${tool.isPopular ? '<span class="recommended-label">Popular</span>' : ''}
                                        ${tool.isNew ? '<span class="new-label">New</span>' : ''}
                                    </div>
                                    <div class="search-result-description">${tool.shortDescription}</div>
                                </div>
                            `;

                            searchResultsContainer.appendChild(resultItem);
                        });
                    } else {
                        // Show no results message
                        searchResultsContainer.innerHTML = '<div class="no-results">No matching tools found</div>';
                    }
                }
            } else {
                // Show default recommended tools
                dropdown.style.display = 'block';

                // Reset to default view
                const searchResultsContainer = dropdown.querySelector('.search-results');
                if (searchResultsContainer) {
                    // Clear and reset to default content
                    const heading = dropdown.querySelector('h5');
                    if (heading) {
                        heading.textContent = 'Recommended Tools';
                    }

                    // Show popular tools
                    const popularTools = toolsData.filter(tool => tool.isPopular);
                    searchResultsContainer.innerHTML = '';

                    if (popularTools.length > 0) {
                        popularTools.slice(0, 3).forEach(tool => {
                            const resultItem = document.createElement('a');
                            resultItem.href = tool.url || '#';
                            resultItem.className = 'search-result-item';

                            resultItem.innerHTML = `
                                <div class="search-result-icon">
                                    <img src="assets/images/tool-icons/${tool.icon}.svg" alt="${tool.name} Icon" width="24" height="24">
                                </div>
                                <div class="search-result-info">
                                    <div class="search-result-title">
                                        ${tool.name}
                                        <span class="recommended-label">Popular</span>
                                        ${tool.isNew ? '<span class="new-label">New</span>' : ''}
                                    </div>
                                    <div class="search-result-description">${tool.shortDescription}</div>
                                </div>
                            `;

                            searchResultsContainer.appendChild(resultItem);
                        });
                    }
                }
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!input.contains(event.target) && !dropdown.contains(event.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    // Initialize search dropdowns
    initSearchDropdowns();
}

/**
 * Populates the latest tools section with dynamic content
 */
function populateLatestTools() {
    const latestToolsContainer = document.getElementById('latest-tools-container');

    if (!latestToolsContainer) return;

    // Get tools data from tools-data.js
    window.toolsDataModule.getAllTools()
        .then(toolsData => {
            // Filter for new tools
            const newTools = toolsData.filter(tool => tool.isNew).slice(0, 5);

            if (newTools.length === 0) return;

            // Create and append tool items to the container
            newTools.forEach(tool => {
                const toolItem = document.createElement('div');
                toolItem.className = 'latest-tool-item';

                // Format current date (this would be replaced with actual dates in a real app)
                const date = new Date();
                const formattedDate = `${date.toLocaleString('default', { month: 'long' })} ${date.getDate()}, ${date.getFullYear()}`;

                toolItem.innerHTML = `
                    <div class="tool-header">
                        <div class="tool-icon">
                            <img src="assets/images/tool-icons/${tool.icon}.svg" alt="${tool.name} Icon" width="32" height="32">
                        </div>
                        <div class="tool-info">
                            <h3>${tool.name}</h3>
                            <span class="tool-date">Added on ${formattedDate}</span>
                        </div>
                    </div>
                    <p>${tool.shortDescription}</p>
                    <a href="${tool.url}" class="tool-link">Learn More</a>
                `;

                latestToolsContainer.appendChild(toolItem);
            });
        })
        .catch(error => {
            console.error('Error loading tools data for latest tools:', error);
        });

    // Add CSS for the dynamically created elements
    const style = document.createElement('style');
    style.textContent = `
        .latest-tool-item {
            background-color: white;
            border-radius: 8px;
            padding: 1.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .latest-tool-item:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
        }

        .tool-header {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
        }

        .tool-icon {
            margin-right: 1rem;
        }

        .tool-info h3 {
            margin-bottom: 0.25rem;
        }

        .tool-date {
            font-size: 0.875rem;
            color: #6c757d;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Initializes the newsletter form with validation and submission handling
 */
function initNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const emailInput = document.getElementById('email');
            const email = emailInput.value.trim();

            if (!isValidEmail(email)) {
                showFormError(emailInput, 'Please enter a valid email address');
                return;
            }

            // Simulate form submission
            const submitButton = newsletterForm.querySelector('.submit-button');
            const originalText = submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = 'Subscribing...';

            // Simulate API call with timeout
            setTimeout(() => {
                // Reset form
                newsletterForm.reset();

                // Show success message
                showFormSuccess('Thank you for subscribing! We\'ve sent a confirmation email.');

                // Reset button
                submitButton.disabled = false;
                submitButton.textContent = originalText;
            }, 1500);
        });
    }
}

/**
 * Validates an email address format
 * @param {string} email - The email address to validate
 * @returns {boolean} - Whether the email is valid
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Shows an error message for a form input
 * @param {HTMLElement} input - The input element
 * @param {string} message - The error message
 */
function showFormError(input, message) {
    // Remove any existing error message
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    // Create and append error message
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#dc3545';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.5rem';

    input.parentElement.appendChild(errorElement);

    // Highlight input
    input.style.borderColor = '#dc3545';

    // Remove error after 3 seconds
    setTimeout(() => {
        errorElement.remove();
        input.style.borderColor = '';
    }, 3000);
}

/**
 * Shows a success message after form submission
 * @param {string} message - The success message
 */
function showFormSuccess(message) {
    const newsletterForm = document.getElementById('newsletter-form');

    // Create success message element
    const successElement = document.createElement('div');
    successElement.className = 'success-message';
    successElement.textContent = message;
    successElement.style.color = '#28a745';
    successElement.style.backgroundColor = '#d4edda';
    successElement.style.padding = '1rem';
    successElement.style.borderRadius = '8px';
    successElement.style.marginTop = '1rem';

    // Insert after form
    newsletterForm.parentElement.insertBefore(successElement, newsletterForm.nextSibling);

    // Remove success message after 5 seconds
    setTimeout(() => {
        successElement.remove();
    }, 5000);
}
