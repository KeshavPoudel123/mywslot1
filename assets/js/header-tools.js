/**
 * Header Tools JavaScript
 * Handles populating the header dropdowns with tools from the centralized tools-data.js file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize header dropdowns
    initHeaderDropdowns();
});

/**
 * Initialize header dropdowns
 */
function initHeaderDropdowns() {
    // Populate Popular Tools dropdown
    populatePopularToolsDropdown();

    // Populate All Tools dropdown
    populateAllToolsDropdown();

    // Populate search results
    initializeSearchDropdowns();
}

/**
 * Populate Popular Tools dropdown
 */
function populatePopularToolsDropdown() {
    const popularToolsDropdowns = document.querySelectorAll('.popular-tools-dropdown');
    if (!popularToolsDropdowns.length) return;

    // Load tools data
    window.toolsDataModule.loadToolsData()
        .then(() => {
            // Get popular tools
            window.toolsDataModule.getPopularTools()
                .then(popularTools => {
                    // Group tools by category
                    const categorizedTools = {};
                    popularTools.forEach(tool => {
                        if (!categorizedTools[tool.category]) {
                            categorizedTools[tool.category] = [];
                        }
                        categorizedTools[tool.category].push(tool);
                    });

                    // Update each dropdown
                    popularToolsDropdowns.forEach(dropdown => {
                        // Clear existing content except "View All" link
                        const viewAllLink = dropdown.querySelector('.view-all');
                        dropdown.innerHTML = '';

                        // Add categories and tools
                        Object.keys(categorizedTools).forEach((category, index) => {
                            // Create category section
                            const categoryDiv = document.createElement('div');
                            categoryDiv.className = 'dropdown-category';

                            // Add category heading
                            const heading = document.createElement('h5');
                            heading.textContent = category;
                            categoryDiv.appendChild(heading);

                            // Add tools to category
                            const tools = categorizedTools[category];
                            tools.forEach(tool => {
                                // Generate a color based on category
                                const colors = ['#00C4CC', '#6A3BE4', '#FF5722', '#FF9800', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0'];
                                const color = colors[index % colors.length];

                                // Create tool HTML
                                const toolHTML = window.toolsDataModule.createToolDropdownHTML(tool, color);
                                categoryDiv.insertAdjacentHTML('beforeend', toolHTML);
                            });

                            // Add category to dropdown
                            dropdown.appendChild(categoryDiv);
                        });

                        // Add "View All" link back
                        if (viewAllLink) {
                            dropdown.appendChild(viewAllLink);
                        } else {
                            const newViewAll = document.createElement('div');
                            newViewAll.className = 'view-all';

                            // Fix the URL path to work from any subdirectory
                            const viewAllUrl = window.location.pathname.includes('/') ?
                                '../popular-tools.html' :
                                'popular-tools.html';

                            newViewAll.innerHTML = `<a href="${viewAllUrl}">View All</a>`;
                            dropdown.appendChild(newViewAll);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error populating Popular Tools dropdown:', error);
                });
        })
        .catch(error => {
            console.error('Error loading tools data:', error);
        });
}

/**
 * Populate All Tools dropdown
 */
function populateAllToolsDropdown() {
    const allToolsDropdowns = document.querySelectorAll('.all-tools-dropdown');
    if (!allToolsDropdowns.length) return;

    // Load tools data
    window.toolsDataModule.loadToolsData()
        .then(() => {
            // Get all categories
            window.toolsDataModule.getAllCategories()
                .then(categories => {
                    // Update each dropdown
                    allToolsDropdowns.forEach(dropdown => {
                        // Clear existing content except "View All" link
                        const viewAllLink = dropdown.querySelector('.view-all');
                        dropdown.innerHTML = '';

                        // Add categories
                        categories.forEach(category => {
                            // Create category section
                            const categoryDiv = document.createElement('div');
                            categoryDiv.className = 'dropdown-category';

                            // Add category heading
                            const heading = document.createElement('h5');
                            heading.textContent = category;
                            categoryDiv.appendChild(heading);

                            // Get tools for this category
                            window.toolsDataModule.getToolsByCategory(category)
                                .then(tools => {
                                    // Limit to 3 tools per category in dropdown
                                    const limitedTools = tools.slice(0, 3);

                                    // Add tools to category
                                    limitedTools.forEach((tool, index) => {
                                        // Generate a color based on category
                                        const colors = ['#00C4CC', '#6A3BE4', '#FF5722', '#FF9800', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0'];
                                        const color = colors[index % colors.length];

                                        // Create tool HTML with icon
                                        const toolHTML = window.toolsDataModule.createToolDropdownHTML(tool, color);
                                        categoryDiv.insertAdjacentHTML('beforeend', toolHTML);
                                    });
                                })
                                .catch(error => {
                                    console.error(`Error getting tools for category ${category}:`, error);
                                });

                            // Add category to dropdown
                            dropdown.appendChild(categoryDiv);
                        });

                        // Add "View All" link back
                        if (viewAllLink) {
                            dropdown.appendChild(viewAllLink);
                        } else {
                            const newViewAll = document.createElement('div');
                            newViewAll.className = 'view-all';

                            // Fix the URL path to work from any subdirectory
                            const viewAllUrl = window.location.pathname.includes('/') ?
                                '../all-tools.html' :
                                'all-tools.html';

                            newViewAll.innerHTML = `<a href="${viewAllUrl}">View All</a>`;
                            dropdown.appendChild(newViewAll);
                        }
                    });
                })
                .catch(error => {
                    console.error('Error getting categories:', error);
                });
        })
        .catch(error => {
            console.error('Error loading tools data:', error);
        });
}

/**
 * Initialize search dropdowns
 */
function initializeSearchDropdowns() {
    // Get search dropdowns
    const desktopSearchDropdown = document.getElementById('desktop-search-dropdown');
    const mobileSearchDropdown = document.getElementById('mobile-search-dropdown');

    // Load default content for search dropdowns
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

// Export functions for use in other files
window.headerToolsModule = {
    initHeaderDropdowns,
    populatePopularToolsDropdown,
    populateAllToolsDropdown,
    initializeSearchDropdowns,
    loadDefaultSearchContent
};
