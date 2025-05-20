/**
 * Popular Tools JavaScript
 * Handles loading and displaying popular tools from the centralized tools-data.js file
 * Includes category filtering and tabs similar to the All Tools page
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize popular tools page
    initPopularToolsPage();
});

/**
 * Initialize the popular tools page
 */
function initPopularToolsPage() {
    const popularToolsContainer = document.getElementById('popular-tools-container');
    if (!popularToolsContainer) return;

    // Clear existing content
    popularToolsContainer.innerHTML = '<div class="loading-spinner">Loading popular tools...</div>';

    // Load popular tools from the centralized data source
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

            // Clear loading spinner
            popularToolsContainer.innerHTML = '';

            // Create filter tabs
            createFilterTabs(popularToolsContainer, Object.keys(categorizedTools));

            // Create tools grid
            const toolsGrid = document.createElement('div');
            toolsGrid.id = 'popular-tools-grid';
            toolsGrid.className = 'tools-grid';
            popularToolsContainer.appendChild(toolsGrid);

            // Add all tools to the grid
            popularTools.forEach(tool => {
                const toolCardHTML = window.toolsDataModule.createToolCardHTML(tool);
                toolsGrid.insertAdjacentHTML('beforeend', toolCardHTML);
            });

            // Initialize filter functionality
            initCategoryFilters();
        })
        .catch(error => {
            console.error('Error loading popular tools:', error);
            popularToolsContainer.innerHTML = '<div class="error-message">Error loading popular tools. Please try again later.</div>';
        });
}

/**
 * Create filter tabs for categories
 * @param {HTMLElement} container - The container to add the tabs to
 * @param {Array} categories - List of categories
 */
function createFilterTabs(container, categories) {
    // Create filter container
    const filterContainer = document.createElement('div');
    filterContainer.className = 'category-filters';

    // Add "All" button
    const allButton = document.createElement('button');
    allButton.className = 'category-filter active';
    allButton.setAttribute('data-category', 'all');
    allButton.textContent = 'All Popular Tools';
    filterContainer.appendChild(allButton);

    // Add category buttons
    categories.forEach(category => {
        const button = document.createElement('button');
        button.className = 'category-filter';
        button.setAttribute('data-category', category.toLowerCase().replace(/\\s+/g, '-'));
        button.textContent = category;
        filterContainer.appendChild(button);
    });

    // Add filter container to main container
    container.appendChild(filterContainer);
}

/**
 * Initializes the category filter buttons
 */
function initCategoryFilters() {
    const filterButtons = document.querySelectorAll('.category-filter');
    const toolCards = document.querySelectorAll('#popular-tools-grid .tool-card');

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

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .tool-card {
        transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .fade-in {
        animation: fadeIn 0.5s ease forwards;
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
`;
document.head.appendChild(style);
