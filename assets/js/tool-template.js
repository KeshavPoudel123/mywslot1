/**
 * Tool Template JavaScript
 * Common functionality for all tool pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize share functionality
    initShareButton();

    // Initialize notification system
    initNotificationSystem();

    // Update copyright year
    updateCopyrightYear();

    // Load similar tools
    loadSimilarTools();

    // Initialize mobile menu functionality
    initMobileMenu();

    // Initialize search functionality
    initSearchFunctionality();

    // Ensure the hamburger menu is properly initialized
    setTimeout(() => {
        resetHamburgerMenu();
        recreateHamburgerMenu();
    }, 500);
});

/**
 * Initialize share button functionality
 */
function initShareButton() {
    const shareBtn = document.getElementById('share-btn');
    const shareDropdown = document.getElementById('share-dropdown');

    if (!shareBtn || !shareDropdown) return;

    // Toggle share dropdown
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        shareDropdown.classList.toggle('show');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!shareBtn.contains(event.target) && !shareDropdown.contains(event.target)) {
            shareDropdown.classList.remove('show');
        }
    });

    // Share on Facebook
    document.getElementById('share-facebook').addEventListener('click', function(e) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${title}`, '_blank');
    });

    // Share on Twitter
    document.getElementById('share-twitter').addEventListener('click', function(e) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(document.title);
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
    });

    // Share on LinkedIn
    document.getElementById('share-linkedin').addEventListener('click', function(e) {
        e.preventDefault();
        const url = encodeURIComponent(window.location.href);
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
    });

    // Share via Email
    document.getElementById('share-email').addEventListener('click', function(e) {
        e.preventDefault();
        const url = window.location.href;
        const title = document.title;
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Check out this tool: ' + url)}`;
    });

    // Copy link
    document.getElementById('copy-link').addEventListener('click', function(e) {
        e.preventDefault();
        const url = window.location.href;

        // Use Clipboard API if available
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url)
                .then(() => {
                    console.log('Link copied to clipboard');
                })
                .catch(err => {
                    console.error('Could not copy text: ', err);
                });
        } else {
            // Fallback for older browsers
            try {
                const textarea = document.createElement('textarea');
                textarea.value = url;
                textarea.style.position = 'fixed';  // Prevent scrolling to bottom
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();

                // Using a try-catch block to handle potential errors
                // Note: document.execCommand is deprecated but still widely supported
                // This is a fallback for browsers that don't support the Clipboard API
                document.execCommand('copy');
                console.log('Link copied to clipboard');

                document.body.removeChild(textarea);
            } catch (err) {
                console.error('Could not copy text: ', err);
            }
        }

        // Hide dropdown after copying
        shareDropdown.classList.remove('show');
    });
}

/**
 * Initialize Apple-style notification system
 */
function initNotificationSystem() {
    // Create notification container if it doesn't exist
    if (!document.getElementById('notification-container')) {
        const container = document.createElement('div');
        container.id = 'notification-container';
        container.className = 'notification-container';
        document.body.appendChild(container);
    }
}

/**
 * Show a notification
 * @param {string} title - The notification title
 * @param {string} message - The notification message
 * @param {string} type - The notification type (success, error, info, warning)
 * @param {number} duration - How long to show the notification in ms (default: 1000)
 */
function showNotification(title, message, type = 'info', duration = 1000) {
    const container = document.getElementById('notification-container');

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Get icon based on type
    let iconSvg;
    switch (type) {
        case 'success':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
            break;
        case 'error':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
            break;
        case 'warning':
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>';
            break;
        case 'info':
        default:
            iconSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
            break;
    }

    // Set notification content
    notification.innerHTML = `
        <div class="notification-icon">${iconSvg}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <p class="notification-message">${message}</p>
        </div>
        <button class="notification-close" aria-label="Close notification">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        </button>
    `;

    // Add to container
    container.appendChild(notification);

    // Add close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        closeNotification(notification);
    });

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    // Auto-close after duration
    const timeout = setTimeout(() => {
        closeNotification(notification);
    }, duration);

    // Store timeout ID on the element
    notification.dataset.timeoutId = timeout;

    return notification;
}

/**
 * Close a notification
 * @param {HTMLElement} notification - The notification element to close
 */
function closeNotification(notification) {
    // Clear timeout if it exists
    if (notification.dataset.timeoutId) {
        clearTimeout(parseInt(notification.dataset.timeoutId));
    }

    // Remove show class to trigger fade out animation
    notification.classList.remove('show');

    // Remove element after animation completes (faster animation)
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 75);
}

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
 * Load tool data including long description and similar tools
 * Uses the tools-data.js module to load real tool data
 */
function loadSimilarTools() {
    const similarToolsGrid = document.querySelector('.similar-tools-grid');
    const longDescriptionElement = document.querySelector('.tool-long-description');

    // Get the current tool name from the page title or h1
    const toolName = document.querySelector('.tool-title h1').textContent.trim();

    // Use the tools-data.js module to get tool data
    if (window.toolsDataModule) {
        window.toolsDataModule.getAllTools()
            .then(tools => {
                // Find the current tool
                const currentTool = tools.find(tool => tool.name === toolName);

                if (currentTool) {
                    // Update the long description in the title section
                    if (longDescriptionElement && currentTool.longDescription) {
                        longDescriptionElement.textContent = currentTool.longDescription;
                    }

                    // Get tools in the same category for similar tools section
                    let similarTools = tools.filter(tool =>
                        tool.category === currentTool.category &&
                        tool.name !== currentTool.name
                    );

                    // If we don't have enough tools in the same category, add popular tools from other categories
                    if (similarTools.length < 3) {
                        const popularTools = tools.filter(tool =>
                            tool.isPopular &&
                            tool.category !== currentTool.category &&
                            tool.name !== currentTool.name
                        );

                        // Add popular tools until we have 3 similar tools
                        similarTools = [...similarTools, ...popularTools].slice(0, 3);
                    } else {
                        // Limit to 3 similar tools
                        similarTools = similarTools.slice(0, 3);
                    }

                    if (similarTools.length > 0 && similarToolsGrid) {
                        // Clear existing placeholder content
                        similarToolsGrid.innerHTML = '';

                        // Add similar tools to the grid
                        similarTools.forEach(tool => {
                            const toolCard = document.createElement('div');
                            toolCard.className = 'similar-tool-card';

                            // Fix the image path to work from any subdirectory
                            const imagePath = tool.url.includes('../') ?
                                `assets/images/tool-icons/${tool.icon}.svg` :
                                `../assets/images/tool-icons/${tool.icon}.svg`;

                            // Fix the URL path to work from any subdirectory
                            const toolUrl = tool.url.startsWith('http') ?
                                tool.url :
                                (window.location.pathname.includes('/') ? '../' + tool.url : tool.url);

                            // Make the entire card clickable
                            toolCard.onclick = function() {
                                window.location.href = toolUrl;
                            };
                            toolCard.style.cursor = 'pointer';

                            toolCard.innerHTML = `
                                <div class="similar-tool-icon">
                                    <img src="${imagePath}" alt="${tool.name}">
                                </div>
                                <h3>${tool.name}</h3>
                                <p>${tool.shortDescription}</p>
                                <a href="${toolUrl}" class="tool-link" onclick="event.stopPropagation();">Try It</a>
                            `;
                            similarToolsGrid.appendChild(toolCard);
                        });
                    } else if (similarToolsGrid) {
                        // If no similar tools found, show a message
                        similarToolsGrid.innerHTML = '<p>No similar tools found.</p>';
                    }
                } else {
                    console.log('Current tool not found in data');
                }
            })
            .catch(error => {
                console.error('Error loading tool data:', error);
            });
    } else {
        console.log('tools-data.js not available');
    }
}

/**
 * Save data to localStorage with expiration
 * @param {string} key - The key to store the data under
 * @param {any} value - The value to store
 * @param {number} expirationInMinutes - How long to store the data (in minutes)
 */
function saveToLocalStorage(key, value, expirationInMinutes = 1440) { // Default: 1 day
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + (expirationInMinutes * 60 * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Get data from localStorage, checking for expiration
 * @param {string} key - The key to retrieve
 * @returns {any|null} - The stored value or null if expired/not found
 */
function getFromLocalStorage(key) {
    const itemStr = localStorage.getItem(key);

    // Return null if no item found
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    const now = new Date();

    // Return null if expired
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }

    return item.value;
}

/**
 * Format a date in a user-friendly way
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
    if (typeof date === 'string') {
        date = new Date(date);
    }

    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in ms
 * @returns {Function} - Debounced function
 */
function debounce(func, wait = 300) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Initialize mobile menu functionality
 */
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const searchToggle = document.getElementById('search-toggle');
    const mobileSearch = document.querySelector('.mobile-search');

    // Mobile menu toggle - ONLY opens when hamburger menu is clicked
    if (menuToggle && mainNav) {
        // Remove any existing event listeners
        const newMenuToggle = menuToggle.cloneNode(true);
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

        // Add click event listener to the hamburger menu
        newMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            e.preventDefault(); // Prevent default action

            // Toggle active classes
            this.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open');

            // Hide the search icon and hamburger menu when opening the sidebar
            if (mainNav.classList.contains('active')) {
                hideIcons();
            } else {
                showIcons();
            }

            // Hide search if it's open
            if (mobileSearch && mobileSearch.classList.contains('show')) {
                mobileSearch.classList.remove('show');
                if (searchToggle) searchToggle.style.display = 'flex';
            }

            // Reset all dropdown menus when opening the mobile menu
            const dropdowns = mainNav.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                dropdown.style.display = 'none';
            });

            // Reset active state on all nav items
            const navItems = mainNav.querySelectorAll('li');
            navItems.forEach(item => {
                item.classList.remove('active');
            });
        });
    }

    // Search toggle for mobile
    if (searchToggle && mobileSearch) {
        // Remove any existing event listeners
        const newSearchToggle = searchToggle.cloneNode(true);
        searchToggle.parentNode.replaceChild(newSearchToggle, searchToggle);

        // Add click event listener to the search icon
        newSearchToggle.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            e.preventDefault(); // Prevent default action

            mobileSearch.classList.toggle('show');

            // Focus the search input when shown
            if (mobileSearch.classList.contains('show')) {
                // Hide the search icon and hamburger menu when search is open
                this.style.display = 'none';
                if (menuToggle) menuToggle.style.display = 'none';

                // Position the search box below the header
                const header = document.querySelector('.site-header');
                if (header) {
                    const headerHeight = header.offsetHeight;
                    mobileSearch.style.top = headerHeight + 'px';
                }

                const searchInput = mobileSearch.querySelector('.search-box');
                if (searchInput) {
                    setTimeout(() => {
                        searchInput.focus();
                    }, 100); // Small delay to ensure focus works after animation
                }

                // Hide menu if it's open
                if (mainNav && mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    if (menuToggle) menuToggle.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            } else {
                // Show the search icon and hamburger menu when search is closed
                showIcons();
            }
        });

        // Add CSS for mobile search animation without close button
        if (!document.getElementById('mobile-search-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-search-styles';
            style.textContent = `
                /* Improve mobile search animation */
                .mobile-search {
                    transition: all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1);
                    opacity: 0;
                    transform: translateY(-10px);
                }

                .mobile-search.show {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Close menu when clicking on the overlay (the mainNav::before element)
    if (mainNav) {
        mainNav.addEventListener('click', function(e) {
            // Only close if clicking the overlay, not the menu content
            if (e.target === mainNav) {
                mainNav.classList.remove('active');
                if (menuToggle) menuToggle.classList.remove('active');
                document.body.classList.remove('menu-open');

                // Show the search icon and hamburger menu when closing the sidebar
                setTimeout(() => {
                    showIcons();
                    resetHamburgerMenu(); // Explicitly reset the hamburger menu
                }, 50);
            }
        });
    }

    // Close menu and search when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideNav = mainNav && (mainNav.contains(event.target) || (menuToggle && menuToggle.contains(event.target)));
        const isClickInsideSearch = mobileSearch && (mobileSearch.contains(event.target) || (searchToggle && searchToggle.contains(event.target)));

        // Only close the menu if clicking outside and not on the toggle button
        if (!isClickInsideNav && mainNav && mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
            if (menuToggle) menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');

            // Show the search icon and hamburger menu when closing the sidebar
            setTimeout(() => {
                showIcons();
                resetHamburgerMenu(); // Explicitly reset the hamburger menu
            }, 50);
        }

        // Close search when clicking outside
        if (!isClickInsideSearch && mobileSearch && mobileSearch.classList.contains('show')) {
            mobileSearch.classList.remove('show');
            // Show both icons when search is closed by clicking outside
            showIcons();
        }
    });

    // Handle dropdown menus in mobile view
    const navItems = document.querySelectorAll('.main-nav ul li');
    navItems.forEach(item => {
        // Get the link and dropdown elements
        const link = item.querySelector('a');
        const dropdown = item.querySelector('.dropdown-menu');

        if (link && dropdown) {
            // Remove existing event listeners to avoid duplicates
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);

            // Add click event only to the link, not the entire li
            newLink.addEventListener('click', function(e) {
                if (window.innerWidth <= 767) {
                    e.preventDefault();
                    e.stopPropagation();

                    // Only toggle if the mobile menu is active
                    if (mainNav.classList.contains('active')) {
                        // Toggle active class on the parent li
                        item.classList.toggle('active');

                        // Make sure the dropdown is displayed as flex when active
                        if (item.classList.contains('active')) {
                            dropdown.style.display = 'flex';

                            // Ensure the dropdown has content
                            if (dropdown.classList.contains('popular-tools-dropdown') &&
                                (!dropdown.querySelector('.dropdown-category') || dropdown.querySelectorAll('.dropdown-category').length === 0)) {
                                // Populate the dropdown if it's empty
                                window.headerToolsModule.populatePopularToolsDropdown();
                            } else if (dropdown.classList.contains('all-tools-dropdown') &&
                                      (!dropdown.querySelector('.dropdown-category') || dropdown.querySelectorAll('.dropdown-category').length === 0)) {
                                // Populate the dropdown if it's empty
                                window.headerToolsModule.populateAllToolsDropdown();
                            }
                        } else {
                            dropdown.style.display = 'none';
                        }

                        // Close other dropdowns
                        navItems.forEach(otherItem => {
                            if (otherItem !== item && otherItem.classList.contains('active')) {
                                otherItem.classList.remove('active');
                                const otherDropdown = otherItem.querySelector('.dropdown-menu');
                                if (otherDropdown) {
                                    otherDropdown.style.display = 'none';
                                }
                            }
                        });
                    }
                }
            });
        }
    });

    // Add a class to body when menu is open to prevent scrolling
    document.addEventListener('DOMContentLoaded', function() {
        if (menuToggle && mainNav) {
            menuToggle.addEventListener('click', function() {
                document.body.classList.toggle('menu-open');

                // Prevent body scrolling and fix width to prevent layout shift
                if (document.body.classList.contains('menu-open')) {
                    document.body.style.overflow = 'hidden';
                    document.body.style.width = '100%';
                    document.body.style.position = 'fixed';
                } else {
                    document.body.style.overflow = '';
                    document.body.style.width = '';
                    document.body.style.position = '';
                }
            });
        }
    });

    // Add CSS for menu-open class
    const style = document.createElement('style');
    style.textContent = `
        body.menu-open {
            overflow: hidden;
            width: 100%;
            position: fixed;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Function to hide the search icon and hamburger menu
 */
function hideIcons() {
    const searchToggle = document.getElementById('search-toggle');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (searchToggle) {
        searchToggle.style.display = 'none';
    }

    if (menuToggle) {
        menuToggle.style.display = 'none';
    }
}

/**
 * Function to reset the hamburger menu to its default state
 */
function resetHamburgerMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (menuToggle) {
        // Remove active class
        menuToggle.classList.remove('active');

        // Reset the spans inside the hamburger menu
        const spans = menuToggle.querySelectorAll('span');
        spans.forEach(span => {
            // Reset transform and opacity
            span.style.transform = 'none';
            span.style.opacity = '1';
        });

        // If the menu is still showing as X, recreate it completely
        if (menuToggle.classList.contains('active') || spans[0].style.transform.includes('rotate')) {
            recreateHamburgerMenu();
        }
    }
}

/**
 * Function to completely recreate the hamburger menu
 */
function recreateHamburgerMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (menuToggle) {
        // Create a new hamburger menu button
        const newMenuToggle = document.createElement('button');
        newMenuToggle.className = 'mobile-menu-toggle';
        newMenuToggle.setAttribute('type', 'button');
        newMenuToggle.setAttribute('aria-label', 'Toggle menu');

        // Create three spans for the hamburger icon
        for (let i = 0; i < 3; i++) {
            const span = document.createElement('span');
            newMenuToggle.appendChild(span);
        }

        // Replace the old button with the new one
        menuToggle.parentNode.replaceChild(newMenuToggle, menuToggle);

        // Add click event listener to the new button
        newMenuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();

            const mainNav = document.querySelector('.main-nav');
            const mobileSearch = document.querySelector('.mobile-search');
            const searchToggle = document.getElementById('search-toggle');

            // Toggle active classes
            this.classList.toggle('active');
            if (mainNav) {
                mainNav.classList.toggle('active');
                document.body.classList.toggle('menu-open');

                // Prevent body scrolling and fix width to prevent layout shift
                if (document.body.classList.contains('menu-open')) {
                    document.body.style.overflow = 'hidden';
                    document.body.style.width = '100%';
                    document.body.style.position = 'fixed';
                } else {
                    document.body.style.overflow = '';
                    document.body.style.width = '';
                    document.body.style.position = '';
                }

                // Hide the search icon and hamburger menu when opening the sidebar
                if (mainNav.classList.contains('active')) {
                    hideIcons();
                } else {
                    showIcons();
                }

                // Hide search if it's open
                if (mobileSearch && mobileSearch.classList.contains('show')) {
                    mobileSearch.classList.remove('show');
                    if (searchToggle) searchToggle.style.display = 'flex';
                }
            }
        });
    }
}

/**
 * Function to show the search icon and hamburger menu
 */
function showIcons() {
    const searchToggle = document.getElementById('search-toggle');
    const menuToggle = document.querySelector('.mobile-menu-toggle');

    if (searchToggle) {
        searchToggle.style.display = 'flex';
    }

    if (menuToggle) {
        menuToggle.style.display = 'block';

        // Reset the hamburger menu
        resetHamburgerMenu();

        // If the menu is still showing as X, recreate it completely
        if (menuToggle.classList.contains('active')) {
            recreateHamburgerMenu();
        }
    } else {
        // If the menu toggle doesn't exist, recreate it
        recreateHamburgerMenu();
    }
}

/**
 * Initialize search functionality
 */
function initSearchFunctionality() {
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const desktopSearchDropdown = document.getElementById('desktop-search-dropdown');
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchDropdown = document.getElementById('mobile-search-dropdown');
    const searchForms = document.querySelectorAll('.search-form');

    // Initialize desktop search
    if (desktopSearchInput && desktopSearchDropdown) {
        // Show dropdown on focus
        desktopSearchInput.addEventListener('focus', function() {
            desktopSearchDropdown.classList.add('show');

            // Load default content if empty
            if (this.value.trim() === '') {
                loadDefaultSearchContent(desktopSearchDropdown);
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!desktopSearchInput.contains(event.target) && !desktopSearchDropdown.contains(event.target)) {
                desktopSearchDropdown.classList.remove('show');
            }
        });

        // Handle search input
        desktopSearchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.trim().toLowerCase();

            // Show dropdown when typing
            desktopSearchDropdown.classList.add('show');

            if (searchTerm === '') {
                // Show default content when search is cleared
                loadDefaultSearchContent(desktopSearchDropdown);
                return;
            }

            // If tools-data.js is available, use it to filter results
            if (window.toolsDataModule) {
                window.toolsDataModule.searchTools(searchTerm)
                    .then(results => {
                        updateSearchResults(results, desktopSearchDropdown, searchTerm);
                    })
                    .catch(error => {
                        console.error('Error searching tools:', error);
                        desktopSearchDropdown.innerHTML = '<div class="search-error">Error searching tools. Please try again.</div>';
                    });
            }
        }, 300));
    }

    // Initialize mobile search
    if (mobileSearchInput && mobileSearchDropdown) {
        // Show dropdown on focus
        mobileSearchInput.addEventListener('focus', function() {
            mobileSearchDropdown.classList.add('show');

            // Load default content if empty
            if (this.value.trim() === '') {
                loadDefaultSearchContent(mobileSearchDropdown);
            }
        });

        // Handle search input
        mobileSearchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.trim().toLowerCase();

            // Show dropdown when typing
            mobileSearchDropdown.classList.add('show');

            if (searchTerm === '') {
                // Show default content when search is cleared
                loadDefaultSearchContent(mobileSearchDropdown);
                return;
            }

            // If tools-data.js is available, use it to filter results
            if (window.toolsDataModule) {
                window.toolsDataModule.searchTools(searchTerm)
                    .then(results => {
                        updateSearchResults(results, mobileSearchDropdown, searchTerm);
                    })
                    .catch(error => {
                        console.error('Error searching tools:', error);
                        mobileSearchDropdown.innerHTML = '<div class="search-error">Error searching tools. Please try again.</div>';
                    });
            }
        }, 300));

        // Handle clicking outside mobile search to close it
        document.addEventListener('click', function(event) {
            const searchToggle = document.getElementById('search-toggle');
            const mobileSearch = document.querySelector('.mobile-search');

            if (mobileSearch && mobileSearch.classList.contains('show') &&
                !mobileSearch.contains(event.target) &&
                (!searchToggle || !searchToggle.contains(event.target))) {
                mobileSearch.classList.remove('show');
                // Show both icons when search is closed
                showIcons();
            }
        });
    }

    // Handle search form submission for both desktop and mobile
    if (searchForms.length) {
        searchForms.forEach(form => {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                const searchInput = form.querySelector('.search-box');
                const searchTerm = searchInput.value.trim();

                if (searchTerm) {
                    // Fix the URL path to work from any subdirectory
                    const searchUrl = window.location.pathname.includes('/') ?
                        `../all-tools.html?search=${encodeURIComponent(searchTerm)}` :
                        `all-tools.html?search=${encodeURIComponent(searchTerm)}`;

                    // Redirect to all-tools.html with search parameter
                    window.location.href = searchUrl;
                }
            });
        });
    }

    // Load default search content on page load
    if (desktopSearchDropdown) {
        loadDefaultSearchContent(desktopSearchDropdown);
    }
    if (mobileSearchDropdown) {
        loadDefaultSearchContent(mobileSearchDropdown);
    }
}

/**
 * Load default search content (popular tools)
 * @param {HTMLElement} dropdown - The dropdown to populate
 */
function loadDefaultSearchContent(dropdown) {
    // Show loading indicator
    dropdown.innerHTML = '<div class="search-loading"><div class="loading-spinner">Loading search results...</div></div>';

    // Get popular tools
    if (window.toolsDataModule) {
        window.toolsDataModule.getPopularTools(6)
            .then(popularTools => {
                // Create HTML for recommended tools
                let html = `
                    <div class="search-category">
                        <h5>Recommended Tools</h5>
                        <div class="search-results">
                `;

                // Add popular tools
                popularTools.forEach(tool => {
                    // Fix the URL path to work from any subdirectory
                    const toolUrl = tool.url.startsWith('http') ?
                        tool.url :
                        (window.location.pathname.includes('/') ? '../' + tool.url : tool.url);

                    // Fix the image path to work from any subdirectory
                    const imagePath = window.location.pathname.includes('/') ?
                        `../assets/images/tool-icons/${tool.icon}.svg` :
                        `assets/images/tool-icons/${tool.icon}.svg`;

                    html += `
                        <a href="${toolUrl}" class="search-result-item">
                            <div class="search-result-icon">
                                <img src="${imagePath}" alt="${tool.name} Icon" width="24" height="24">
                            </div>
                            <div class="search-result-info">
                                <div class="search-result-title">
                                    ${tool.name}
                                    <span class="recommended-label">Popular</span>
                                    ${tool.isNew ? '<span class="new-label">New</span>' : ''}
                                </div>
                                <div class="search-result-description">${tool.shortDescription}</div>
                            </div>
                        </a>
                    `;
                });

                html += `
                        </div>
                    </div>
                `;

                // Add categories section
                html += `
                    <div class="search-category">
                        <h5>Categories</h5>
                        <div class="search-results">
                `;

                // Get categories
                window.toolsDataModule.getAllCategories()
                    .then(categories => {
                        // Add category links
                        categories.forEach(category => {
                            // Fix the URL path to work from any subdirectory
                            const categoryUrl = window.location.pathname.includes('/') ?
                                `../all-tools.html?category=${encodeURIComponent(category)}` :
                                `all-tools.html?category=${encodeURIComponent(category)}`;

                            html += `
                                <a href="${categoryUrl}" class="search-result-item">
                                    <div class="search-result-info">
                                        <div class="search-result-title">${category}</div>
                                    </div>
                                </a>
                            `;
                        });

                        html += `
                                </div>
                            </div>
                        `;

                        // Update dropdown content
                        dropdown.innerHTML = html;
                    })
                    .catch(error => {
                        console.error('Error getting categories:', error);
                        dropdown.innerHTML = '<div class="search-error">Error loading search content. Please try again.</div>';
                    });
            })
            .catch(error => {
                console.error('Error getting popular tools:', error);
                dropdown.innerHTML = '<div class="search-error">Error loading search content. Please try again.</div>';
            });
    } else {
        dropdown.innerHTML = '<div class="search-error">Search functionality is not available.</div>';
    }
}

/**
 * Update search results in dropdown
 * @param {Array} results - Search results
 * @param {HTMLElement} dropdown - Dropdown element to update
 * @param {string} searchTerm - The search term to highlight
 */
function updateSearchResults(results, dropdown, searchTerm) {
    // Clear previous results
    dropdown.innerHTML = '';

    if (results.length === 0) {
        dropdown.innerHTML = '<div class="no-results">No matching tools found</div>';
        return;
    }

    // Group results by category
    const categories = {};
    results.forEach(tool => {
        if (!categories[tool.category]) {
            categories[tool.category] = [];
        }
        categories[tool.category].push(tool);
    });

    // Create HTML for results
    Object.keys(categories).forEach(category => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'search-category';

        const heading = document.createElement('h5');
        heading.textContent = category;
        categoryDiv.appendChild(heading);

        const resultsDiv = document.createElement('div');
        resultsDiv.className = 'search-results';

        categories[category].forEach(tool => {
            const resultItem = document.createElement('a');

            // Fix the URL path to work from any subdirectory
            const toolUrl = tool.url.startsWith('http') ?
                tool.url :
                (window.location.pathname.includes('/') ? '../' + tool.url : tool.url);

            resultItem.href = toolUrl;
            resultItem.className = 'search-result-item';

            // Highlight the search term in the tool name and description
            let highlightedName = tool.name;
            let highlightedDescription = tool.shortDescription;

            if (searchTerm && searchTerm.length > 0) {
                // Create a regex that matches the search term (case insensitive)
                const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');

                // Highlight matches in the name
                highlightedName = tool.name.replace(regex, '<span class="highlight">$1</span>');

                // Highlight matches in the description
                highlightedDescription = tool.shortDescription.replace(regex, '<span class="highlight">$1</span>');
            }

            // Fix the image path to work from any subdirectory
            const imagePath = window.location.pathname.includes('/') ?
                `../assets/images/tool-icons/${tool.icon}.svg` :
                `assets/images/tool-icons/${tool.icon}.svg`;

            resultItem.innerHTML = `
                <div class="search-result-icon">
                    <img src="${imagePath}" alt="${tool.name} Icon" width="24" height="24">
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">
                        ${highlightedName}
                        ${tool.isNew ? '<span class="new-label">New</span>' : ''}
                        ${tool.isPopular ? '<span class="recommended-label">Popular</span>' : ''}
                    </div>
                    <div class="search-result-description">${highlightedDescription}</div>
                </div>
            `;

            resultsDiv.appendChild(resultItem);
        });

        categoryDiv.appendChild(resultsDiv);
        dropdown.appendChild(categoryDiv);
    });

    // Add CSS for highlighted text
    if (!document.getElementById('search-highlight-style')) {
        const style = document.createElement('style');
        style.id = 'search-highlight-style';
        style.textContent = `
            .highlight {
                background-color: rgba(255, 213, 79, 0.4);
                font-weight: bold;
                border-radius: 2px;
                padding: 0 2px;
            }

            .search-dropdown {
                display: none;
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: white;
                border-radius: 0 0 8px 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                z-index: 100;
                max-height: 400px;
                overflow-y: auto;
                padding: 1rem;
            }

            .search-dropdown.show {
                display: block;
            }

            /* Mobile search styles */
            .mobile-search {
                position: absolute;
                top: 100%;
                left: 0;
                width: 100%;
                background-color: white;
                z-index: 99;
                display: none;
                padding: 1rem;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .mobile-search.show {
                display: block;
            }

            .mobile-search .search-form {
                width: 100%;
                position: relative;
            }

            .mobile-search .search-box {
                width: 100%;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                border: 1px solid var(--gray-300);
                font-size: 1rem;
                padding-right: 40px;
            }

            .mobile-search .search-dropdown {
                position: relative;
                width: 100%;
                max-height: 300px;
                margin-top: 0.5rem;
            }

            .search-category {
                margin-bottom: 1rem;
            }

            .search-category h5 {
                font-size: 0.9rem;
                color: var(--gray-600);
                margin-bottom: 0.5rem;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .search-results {
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            }

            .search-result-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem;
                border-radius: 8px;
                text-decoration: none;
                color: var(--gray-800);
                transition: background-color 0.2s;
            }

            .search-result-item:hover {
                background-color: var(--gray-100);
            }

            .search-result-icon {
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: var(--gray-100);
                border-radius: 8px;
                flex-shrink: 0;
            }

            .search-result-info {
                flex: 1;
            }

            .search-result-title {
                font-weight: 600;
                margin-bottom: 0.25rem;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .search-result-description {
                font-size: 0.85rem;
                color: var(--gray-600);
                line-height: 1.4;
            }

            .recommended-label, .new-label {
                font-size: 0.7rem;
                padding: 0.1rem 0.4rem;
                border-radius: 4px;
                text-transform: uppercase;
                font-weight: 700;
                letter-spacing: 0.5px;
            }

            .recommended-label {
                background-color: #E3F2FD;
                color: #1976D2;
            }

            .new-label {
                background-color: #E8F5E9;
                color: #388E3C;
            }

            .no-results, .search-error {
                padding: 1rem;
                text-align: center;
                color: var(--gray-600);
            }

            .search-loading {
                display: flex;
                justify-content: center;
                padding: 2rem;
            }

            .loading-spinner {
                display: inline-block;
                width: 40px;
                height: 40px;
                border: 3px solid rgba(0, 0, 0, 0.1);
                border-radius: 50%;
                border-top-color: var(--primary-color);
                animation: spin 1s ease-in-out infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

/**
 * Escape special characters in a string for use in a regular expression
 * @param {string} string - The string to escape
 * @returns {string} - The escaped string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
