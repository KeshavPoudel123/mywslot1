/**
 * Search Functionality
 * Handles search dropdown and filtering
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initSearch();
});

/**
 * Initialize search functionality
 */
function initSearch() {
    // Desktop search
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const desktopSearchDropdown = document.getElementById('desktop-search-dropdown');

    // Mobile search
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchDropdown = document.getElementById('mobile-search-dropdown');

    // Use the centralized tools data module
    window.toolsDataModule.loadToolsData()
        .then(() => {
            return window.toolsDataModule.getAllTools();
        })
        .then(tools => {
            const toolsData = tools.map(tool => ({
                id: tool.id,
                name: tool.name,
                description: tool.shortDescription,
                category: tool.category,
                icon: tool.icon + '.svg',
                isPopular: tool.isPopular,
                isNew: tool.isNew,
                url: tool.url
            }));

            // Initialize search functionality once data is loaded
            initSearchFunctionality(toolsData, desktopSearchInput, desktopSearchDropdown, mobileSearchInput, mobileSearchDropdown);
        })
        .catch(error => {
            console.error('Error loading tools data:', error);
            // Fallback to empty array if data can't be loaded
            initSearchFunctionality([], desktopSearchInput, desktopSearchDropdown, mobileSearchInput, mobileSearchDropdown);
        });
}

/**
 * Initialize search functionality with loaded tools data
 * @param {Array} toolsData - The tools data loaded from JSON
 * @param {HTMLElement} desktopSearchInput - Desktop search input element
 * @param {HTMLElement} desktopSearchDropdown - Desktop search dropdown element
 * @param {HTMLElement} mobileSearchInput - Mobile search input element
 * @param {HTMLElement} mobileSearchDropdown - Mobile search dropdown element
 */
function initSearchFunctionality(toolsData, desktopSearchInput, desktopSearchDropdown, mobileSearchInput, mobileSearchDropdown) {
    // Handle desktop search
    if (desktopSearchInput && desktopSearchDropdown) {
        // Show dropdown on focus
        desktopSearchInput.addEventListener('focus', function() {
            desktopSearchDropdown.classList.add('show');
        });

        // Filter results as user types
        desktopSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            filterSearchResults(searchTerm, desktopSearchDropdown, toolsData);
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!desktopSearchInput.contains(event.target) && !desktopSearchDropdown.contains(event.target)) {
                desktopSearchDropdown.classList.remove('show');
            }
        });
    }

    // Handle mobile search
    if (mobileSearchInput && mobileSearchDropdown) {
        // Show dropdown on focus
        mobileSearchInput.addEventListener('focus', function() {
            mobileSearchDropdown.classList.add('show');
        });

        // Filter results as user types
        mobileSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.trim().toLowerCase();
            filterSearchResults(searchTerm, mobileSearchDropdown, toolsData);
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(event) {
            if (!mobileSearchInput.contains(event.target) && !mobileSearchDropdown.contains(event.target)) {
                mobileSearchDropdown.classList.remove('show');
            }
        });
    }
}

/**
 * Filter search results based on search term
 * @param {string} searchTerm - The search term
 * @param {HTMLElement} dropdownElement - The dropdown element to update
 * @param {Array} toolsData - The tools data to filter
 */
function filterSearchResults(searchTerm, dropdownElement, toolsData) {
    if (!searchTerm) {
        // If search term is empty, show default categories
        showDefaultCategories(dropdownElement, toolsData);
        return;
    }

    // Filter tools based on search term
    const filteredTools = toolsData.filter(tool => {
        return tool.name.toLowerCase().includes(searchTerm) ||
               tool.description.toLowerCase().includes(searchTerm) ||
               tool.category.toLowerCase().includes(searchTerm);
    });

    if (filteredTools.length === 0) {
        // No results found
        dropdownElement.innerHTML = `
            <div class="search-no-results">
                <p>No tools found matching "${searchTerm}"</p>
            </div>
        `;
        return;
    }

    // Group results by category
    const groupedResults = groupByCategory(filteredTools);

    // Build HTML for search results
    let resultsHTML = '';

    // Add recommended tools first (if any)
    const recommendedTools = filteredTools.filter(tool => tool.isPopular);
    if (recommendedTools.length > 0) {
        resultsHTML += `
            <div class="search-category">
                <h5>Recommended Results</h5>
                <div class="search-results">
                    ${recommendedTools.map(tool => createToolItemHTML(tool)).join('')}
                </div>
            </div>
        `;
    }

    // Add other results grouped by category
    Object.keys(groupedResults).forEach(category => {
        resultsHTML += `
            <div class="search-category">
                <h5>${category}</h5>
                <div class="search-results">
                    ${groupedResults[category].map(tool => createToolItemHTML(tool)).join('')}
                </div>
            </div>
        `;
    });

    // Update dropdown content
    dropdownElement.innerHTML = resultsHTML;
}

/**
 * Show default categories in the search dropdown
 * @param {HTMLElement} dropdownElement - The dropdown element to update
 * @param {Array} toolsData - The tools data
 */
function showDefaultCategories(dropdownElement, toolsData) {
    // Get popular tools (limit to 6)
    const popularTools = toolsData.filter(tool => tool.isPopular).slice(0, 6);

    // Group tools by category
    const groupedTools = {};
    toolsData.forEach(tool => {
        if (!groupedTools[tool.category]) {
            groupedTools[tool.category] = [];
        }
        groupedTools[tool.category].push(tool);
    });

    // Build HTML
    let html = `
        <div class="search-category">
            <h5>Recommended Tools</h5>
            <div class="search-results">
                ${popularTools.map(tool => createToolItemHTML(tool)).join('')}
            </div>
        </div>
    `;

    // Add categories with their tools
    Object.keys(groupedTools).forEach(category => {
        html += `
            <div class="search-category">
                <h5>${category}</h5>
                <div class="search-results">
                    ${groupedTools[category].map(tool => createToolItemHTML(tool)).join('')}
                </div>
            </div>
        `;
    });

    // Update dropdown content
    dropdownElement.innerHTML = html;
}

/**
 * Group tools by category
 * @param {Array} tools - The tools to group
 * @returns {Object} - Object with categories as keys and arrays of tools as values
 */
function groupByCategory(tools) {
    return tools.reduce((acc, tool) => {
        if (!acc[tool.category]) {
            acc[tool.category] = [];
        }
        acc[tool.category].push(tool);
        return acc;
    }, {});
}

/**
 * Create HTML for a tool item
 * @param {Object} tool - The tool data
 * @returns {string} - HTML for the tool item
 */
function createToolItemHTML(tool) {
    // Ensure the URL is correct
    const url = tool.url || '#' + tool.id;

    // Add popular label if tool is popular
    const popularLabel = tool.isPopular ? '<span class="recommended-label">Popular</span>' : '';

    // Add new label if tool is new
    const newLabel = tool.isNew ? '<span class="recommended-label" style="background: linear-gradient(to right, #FF5722, #FF9800);">New</span>' : '';

    return `
        <a href="${url}" class="search-result-item">
            <div class="search-result-icon">
                <img src="assets/images/tool-icons/${tool.icon}" alt="${tool.name} Icon" width="24" height="24">
            </div>
            <div class="search-result-info">
                <div class="search-result-title">
                    ${tool.name} ${popularLabel} ${newLabel}
                </div>
                <div class="search-result-description">${tool.description}</div>
            </div>
        </a>
    `;
}
