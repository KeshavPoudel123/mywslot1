/**
 * Tools Filter JavaScript
 * Handles category filtering and search functionality for the All Tools page
 * Uses the centralized tools-data.js file as the data source
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load tools data and populate the page
    loadToolsAndInitialize();
});

/**
 * Load tools data and initialize the page
 */
function loadToolsAndInitialize() {
    const toolsGrid = document.getElementById('tools-grid');
    if (!toolsGrid) return;

    // Clear existing content
    toolsGrid.innerHTML = '<div class="loading-spinner">Loading tools...</div>';

    // Load tools data
    window.toolsDataModule.loadToolsData()
        .then(() => {
            // Populate tools grid
            populateToolsGrid();

            // Initialize category filters
            initCategoryFilters();

            // Check for search parameter in URL
            handleSearchParam();
        })
        .catch(error => {
            console.error('Error initializing tools page:', error);
            toolsGrid.innerHTML = '<div class="error-message">Error loading tools. Please try again later.</div>';
        });
}

/**
 * Populate the tools grid with tools from the JSON data
 */
function populateToolsGrid() {
    const toolsGrid = document.getElementById('tools-grid');
    if (!toolsGrid) return;

    // Clear existing content
    toolsGrid.innerHTML = '';

    // Get all tools
    window.toolsDataModule.getAllTools()
        .then(tools => {
            // Group tools by category
            const categorizedTools = {};
            tools.forEach(tool => {
                if (!categorizedTools[tool.category]) {
                    categorizedTools[tool.category] = [];
                }
                categorizedTools[tool.category].push(tool);
            });

            // Create tool cards for each category
            Object.keys(categorizedTools).forEach(category => {
                categorizedTools[category].forEach(tool => {
                    const toolCardHTML = window.toolsDataModule.createToolCardHTML(tool);
                    toolsGrid.insertAdjacentHTML('beforeend', toolCardHTML);
                });
            });

            // Initialize category filter buttons
            initCategoryFilterButtons(Object.keys(categorizedTools));
        });
}

/**
 * Initialize category filter buttons based on available categories
 * @param {Array} categories - List of categories
 */
function initCategoryFilterButtons(categories) {
    const filterContainer = document.querySelector('.category-filters');
    if (!filterContainer) return;

    // Clear existing buttons
    filterContainer.innerHTML = '';

    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = 'category-filter active';
    allButton.setAttribute('data-category', 'all');
    allButton.textContent = 'All Tools';
    filterContainer.appendChild(allButton);

    // Add category buttons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-filter';
        button.setAttribute('data-category', category.toLowerCase().replace(/\s+/g, '-'));
        button.textContent = category;
        filterContainer.appendChild(button);
    });

    // Initialize filter functionality
    initCategoryFilters();
}

/**
 * Initializes the category filter buttons
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    const toolCards = document.querySelectorAll('.tool-card');

    if (!filterButtons.length || !toolCards.length) return;

    // Add click event to each filter button
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Get selected category
            const selectedCategory = this.getAttribute('data-category');

            // Filter tools
            filterTools(selectedCategory, toolCards);
        });
    });
}

/**
 * Filters tool cards based on selected category
 * @param {string} category - The category to filter by
 * @param {NodeList} toolCards - The collection of tool cards
 */
function filterTools(category, toolCards) {
    toolCards.forEach(card => {
        if (category === 'all' || card.getAttribute('data-category') === category) {
            card.style.display = '';
            // Add animation class
            card.classList.add('fade-in');
            setTimeout(() => {
                card.classList.remove('fade-in');
            }, 500);
        } else {
            card.style.display = 'none';
        }
    });
}

/**
 * Checks for search parameter in URL and filters tools accordingly
 */
function handleSearchParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTerm = urlParams.get('search');

    if (searchTerm) {
        // Display search term
        const pageHeader = document.querySelector('.page-header .subtitle');
        if (pageHeader) {
            pageHeader.textContent = `Search results for: "${searchTerm}"`;
        }

        // Search tools using the centralized data source
        window.toolsDataModule.searchTools(searchTerm)
            .then(matchingTools => {
                const toolCards = document.querySelectorAll('.tool-card');
                const filterButtons = document.querySelectorAll('.category-filter');
                let matchFound = false;

                // Reset category filters
                filterButtons.forEach(btn => {
                    if (btn.getAttribute('data-category') === 'all') {
                        btn.classList.add('active');
                    } else {
                        btn.classList.remove('active');
                    }
                });

                // Get matching tool IDs
                const matchingIds = matchingTools.map(tool => tool.id);

                // Filter tool cards
                toolCards.forEach(card => {
                    const toolId = card.getAttribute('data-id');

                    if (matchingIds.includes(toolId)) {
                        card.style.display = '';
                        card.classList.add('search-match');
                        matchFound = true;
                    } else {
                        card.style.display = 'none';
                    }
                });

                // Show message if no matches found
                const toolsGrid = document.getElementById('tools-grid');
                const existingMessage = document.querySelector('.no-results-message');

                if (!matchFound) {
                    if (!existingMessage) {
                        const noResultsMessage = document.createElement('div');
                        noResultsMessage.className = 'no-results-message';
                        noResultsMessage.innerHTML = `
                            <h3>No tools found</h3>
                            <p>No tools match your search term "${searchTerm}". Try a different search term or browse all tools.</p>
                        `;
                        toolsGrid.appendChild(noResultsMessage);
                    }
                } else if (existingMessage) {
                    existingMessage.remove();
                }
            });
    }
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .tool-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-in {
        animation: fadeIn 0.5s ease forwards;
    }

    .search-match {
        animation: highlight 1s ease;
    }

    .no-results-message {
        text-align: center;
        padding: 2rem;
        background-color: #f8f9fa;
        border-radius: 8px;
        margin: 2rem 0;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(10px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @keyframes highlight {
        0%, 100% {
            background-color: transparent;
        }
        50% {
            background-color: rgba(0, 196, 204, 0.1);
        }
    }
`;
document.head.appendChild(style);
