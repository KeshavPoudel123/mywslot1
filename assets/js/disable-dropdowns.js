/**
 * Disable Dropdowns JavaScript
 * Disables dropdown menus for specific pages
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the dropdown disabler
    disableDropdownsOnSpecificPages();
});

/**
 * Disables dropdown menus on specific pages
 */
function disableDropdownsOnSpecificPages() {
    // Get the current page URL
    const currentUrl = window.location.pathname;
    
    // Define patterns for pages where dropdowns should be disabled
    const pagesWithDisabledDropdowns = [
        // Connect page
        /\/contact\.html$/i,
        
        // Quick Search Pro page and its subpages
        /\/quick-search-pro\//i,
        /\/quick-search-pro\.html$/i,
        
        // Privacy page
        /\/privacy\.html$/i,
        /\/privacy-policy\//i,
        
        // Any tool page (typically follows a pattern like tool-name.html or tool-name/index.html)
        /\/[a-z0-9-]+\.html$/i, // For tool pages in root directory
        /\/[a-z0-9-]+\/index\.html$/i // For tool pages in subdirectories
    ];
    
    // Exclude specific pages from the disabling (like popular-tools.html, all-tools.html, index.html)
    const excludedPages = [
        /\/index\.html$/i,
        /\/popular-tools\.html$/i,
        /\/all-tools\.html$/i
    ];
    
    // Check if the current page should have dropdowns disabled
    const shouldDisableDropdowns = pagesWithDisabledDropdowns.some(pattern => pattern.test(currentUrl)) && 
                                  !excludedPages.some(pattern => pattern.test(currentUrl));
    
    if (shouldDisableDropdowns) {
        // Disable the dropdowns
        disableDropdowns();
    }
}

/**
 * Disables the dropdown functionality for Popular Tools and All Tools
 */
function disableDropdowns() {
    // Get all dropdown menu items
    const popularToolsItems = document.querySelectorAll('.main-nav ul li a[href*="popular-tools.html"]');
    const allToolsItems = document.querySelectorAll('.main-nav ul li a[href*="all-tools.html"]');
    
    // Function to disable a dropdown
    function disableDropdown(element) {
        if (!element) return;
        
        // Remove dropdown icon
        const dropdownIcon = element.querySelector('.dropdown-icon');
        if (dropdownIcon) {
            dropdownIcon.remove();
        }
        
        // Find the parent li element
        const parentLi = element.closest('li');
        if (parentLi) {
            // Find the dropdown menu
            const dropdownMenu = parentLi.querySelector('.dropdown-menu');
            if (dropdownMenu) {
                // Hide the dropdown menu
                dropdownMenu.style.display = 'none';
                
                // Remove any event listeners by cloning and replacing the element
                const newElement = element.cloneNode(true);
                element.parentNode.replaceChild(newElement, element);
                
                // Make sure the link works without dropdown
                newElement.addEventListener('click', function(e) {
                    // Allow the link to navigate normally
                    return true;
                });
            }
        }
    }
    
    // Disable Popular Tools dropdowns
    popularToolsItems.forEach(disableDropdown);
    
    // Disable All Tools dropdowns
    allToolsItems.forEach(disableDropdown);
    
    // Also prevent the mobile dropdown functionality for these items
    preventMobileDropdowns();
}

/**
 * Prevents mobile dropdown functionality for Popular Tools and All Tools
 */
function preventMobileDropdowns() {
    // Create a style element to override dropdown behavior
    const style = document.createElement('style');
    style.textContent = `
        .main-nav ul li a[href*="popular-tools.html"] + .dropdown-menu,
        .main-nav ul li a[href*="all-tools.html"] + .dropdown-menu {
            display: none !important;
        }
    `;
    document.head.appendChild(style);
    
    // Override any JavaScript that might try to show these dropdowns
    const originalAddEventListener = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
        if (type === 'click' && 
            this.tagName === 'A' && 
            (this.href.includes('popular-tools.html') || this.href.includes('all-tools.html'))) {
            // For these specific links, modify the click listener to allow navigation
            const modifiedListener = function(e) {
                // Don't prevent default or stop propagation
                return listener.call(this, e);
            };
            return originalAddEventListener.call(this, type, modifiedListener, options);
        }
        return originalAddEventListener.call(this, type, listener, options);
    };
}
