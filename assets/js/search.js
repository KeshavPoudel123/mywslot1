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
    // Desktop search inputs across different pages
    const desktopSearchInput = document.getElementById('desktop-search-input');
    const desktopSearchInputAll = document.getElementById('desktop-search-input-all');
    const desktopSearchInputPopular = document.getElementById('desktop-search-input-popular');

    // Desktop search dropdowns across different pages
    const desktopSearchDropdown = document.getElementById('desktop-search-dropdown');
    const desktopSearchDropdownAll = document.getElementById('desktop-search-dropdown-all');
    const desktopSearchDropdownPopular = document.getElementById('desktop-search-dropdown-popular');

    // Mobile search inputs across different pages
    const mobileSearchInput = document.getElementById('mobile-search-input');
    const mobileSearchInputAll = document.getElementById('mobile-search-input-all');
    const mobileSearchInputPopular = document.getElementById('mobile-search-input-popular');

    // Mobile search dropdowns across different pages
    const mobileSearchDropdown = document.getElementById('mobile-search-dropdown');
    const mobileSearchDropdownAll = document.getElementById('mobile-search-dropdown-all');
    const mobileSearchDropdownPopular = document.getElementById('mobile-search-dropdown-popular');

    // Use the centralized tools data module
    window.toolsDataModule.loadToolsData()
        .then(() => {
            return window.toolsDataModule.getAllTools();
        })
        .then(tools => {
            // Initialize search functionality for each page
            if (desktopSearchInput && desktopSearchDropdown) {
                initSearchFunctionality(tools, desktopSearchInput, desktopSearchDropdown);
            }

            if (mobileSearchInput && mobileSearchDropdown) {
                initSearchFunctionality(tools, mobileSearchInput, mobileSearchDropdown);
            }

            if (desktopSearchInputAll && desktopSearchDropdownAll) {
                initSearchFunctionality(tools, desktopSearchInputAll, desktopSearchDropdownAll);
            }

            if (mobileSearchInputAll && mobileSearchDropdownAll) {
                initSearchFunctionality(tools, mobileSearchInputAll, mobileSearchDropdownAll);
            }

            if (desktopSearchInputPopular && desktopSearchDropdownPopular) {
                initSearchFunctionality(tools, desktopSearchInputPopular, desktopSearchDropdownPopular);
            }

            if (mobileSearchInputPopular && mobileSearchDropdownPopular) {
                initSearchFunctionality(tools, mobileSearchInputPopular, mobileSearchDropdownPopular);
            }
        })
        .catch(error => {
            console.error('Error loading tools data:', error);
        });
}

/**
 * Initialize search functionality with loaded tools data
 * @param {Array} toolsData - The tools data loaded from JSON
 * @param {HTMLElement} searchInput - Search input element
 * @param {HTMLElement} searchDropdown - Search dropdown element
 */
function initSearchFunctionality(toolsData, searchInput, searchDropdown) {
    // Show dropdown on focus
    searchInput.addEventListener('focus', function() {
        searchDropdown.classList.add('show');

        // Load default content if empty
        if (this.value.trim() === '') {
            showDefaultRecommendations(searchDropdown, toolsData);
        }
    });

    // Filter results as user types
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.trim().toLowerCase();

        // Show dropdown when typing
        searchDropdown.classList.add('show');

        if (searchTerm === '') {
            // Show default content when search is cleared
            showDefaultRecommendations(searchDropdown, toolsData);
            return;
        }

        filterSearchResults(searchTerm, searchDropdown, toolsData);
    });

    // Hide dropdown when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchInput.contains(event.target) && !searchDropdown.contains(event.target)) {
            searchDropdown.classList.remove('show');
        }
    });

    // Load default search content on page load
    showDefaultRecommendations(searchDropdown, toolsData);
}

/**
 * Filter search results based on search term
 * @param {string} searchTerm - The search term
 * @param {HTMLElement} dropdownElement - The dropdown element to update
 * @param {Array} toolsData - The tools data to filter
 */
function filterSearchResults(searchTerm, dropdownElement, toolsData) {
    if (!searchTerm) {
        // If search term is empty, show default recommendations
        showDefaultRecommendations(dropdownElement, toolsData);
        return;
    }

    // Filter tools based on search term (exclude category from search)
    const filteredTools = toolsData.filter(tool => {
        return tool.name.toLowerCase().includes(searchTerm) ||
               tool.shortDescription.toLowerCase().includes(searchTerm);
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

    // Build HTML for search results
    let resultsHTML = `
        <div class="search-category">
            <h5>Search Results</h5>
            <div class="search-results">
    `;

    // Add each filtered tool
    filteredTools.forEach(tool => {
        const toolUrl = tool.url;
        const imagePath = `assets/images/tool-icons/${tool.icon}.svg`;

        // Highlight the search term in the tool name and description
        const highlightedName = highlightText(tool.name, searchTerm);
        const highlightedDescription = highlightText(tool.shortDescription, searchTerm);

        resultsHTML += `
            <a href="${toolUrl}" class="search-result-item">
                <div class="search-result-icon">
                    <img src="${imagePath}" alt="${tool.name} Icon" width="24" height="24" onerror="this.src='assets/images/tool-icons/photo_filter.svg'">
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">
                        ${highlightedName}
                        ${tool.isPopular ? '<span class="recommended-label">Popular</span>' : ''}
                        ${tool.isNew ? '<span class="new-label">New</span>' : ''}
                    </div>
                    <div class="search-result-description">${highlightedDescription}</div>
                </div>
            </a>
        `;
    });

    resultsHTML += `
            </div>
        </div>
    `;

    // Update dropdown content
    dropdownElement.innerHTML = resultsHTML;
}

/**
 * Show default recommendations in the search dropdown
 * @param {HTMLElement} dropdownElement - The dropdown element to update
 * @param {Array} toolsData - The tools data
 */
function showDefaultRecommendations(dropdownElement, toolsData) {
    // Get popular tools (limit to 6)
    const popularTools = toolsData.filter(tool => tool.isPopular).slice(0, 6);

    if (popularTools.length === 0) {
        dropdownElement.innerHTML = '<div class="no-results">No recommended tools found</div>';
        return;
    }

    // Build HTML for recommended tools
    let html = `
        <div class="search-category">
            <h5>Recommended Tools</h5>
            <div class="search-results">
    `;

    // Add each popular tool
    popularTools.forEach(tool => {
        const toolUrl = tool.url;
        const imagePath = `assets/images/tool-icons/${tool.icon}.svg`;

        html += `
            <a href="${toolUrl}" class="search-result-item">
                <div class="search-result-icon">
                    <img src="${imagePath}" alt="${tool.name} Icon" width="24" height="24" onerror="this.src='assets/images/tool-icons/photo_filter.svg'">
                </div>
                <div class="search-result-info">
                    <div class="search-result-title">
                        ${tool.name}
                        ${tool.isPopular ? '<span class="recommended-label">Popular</span>' : ''}
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

    // Update dropdown content
    dropdownElement.innerHTML = html;
}

/**
 * Highlight search term in text
 * @param {string} text - The text to highlight
 * @param {string} searchTerm - The search term to highlight
 * @returns {string} - Text with highlighted search term
 */
function highlightText(text, searchTerm) {
    if (!searchTerm) return text;

    // Create a regex that matches the search term (case insensitive)
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');

    // Replace matches with highlighted version
    return text.replace(regex, '<span class="highlight">$1</span>');
}

/**
 * Escape special characters in string for use in regex
 * @param {string} string - The string to escape
 * @returns {string} - Escaped string
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
