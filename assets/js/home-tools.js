/**
 * Home Tools JavaScript
 * Handles loading and displaying tools on the home page from the centralized tools-data.js file
 */

document.addEventListener('DOMContentLoaded', function() {
    // Load additional styles
    loadAdditionalStyles();

    // Initialize home page tools
    initHomePageTools();
});

/**
 * Load additional styles for the home page
 */
function loadAdditionalStyles() {
    // Create a script element to load the styles
    const script = document.createElement('script');
    script.src = 'assets/js/home-tools-styles.js';
    document.head.appendChild(script);
}

/**
 * Initialize the home page tools
 */
function initHomePageTools() {
    // Populate featured tools
    populateFeaturedTools();

    // Populate popular tools
    populateHomePopularTools();

    // Populate all tools section
    populateAllToolsSection();

    // Populate new tools
    populateNewTools();

    // Populate tool categories
    populateToolCategories();
}

/**
 * Populate featured tools section
 */
function populateFeaturedTools() {
    const featuredToolsContainer = document.getElementById('featured-tools');
    if (!featuredToolsContainer) return;

    // Clear existing content
    featuredToolsContainer.innerHTML = '<div class="loading-spinner">Loading featured tools...</div>';

    // Get popular tools
    window.toolsDataModule.getPopularTools(3)
        .then(popularTools => {
            // Clear loading spinner
            featuredToolsContainer.innerHTML = '';

            // Add tools to the container
            popularTools.forEach(tool => {
                const toolCardHTML = window.toolsDataModule.createToolCardHTML(tool);
                featuredToolsContainer.insertAdjacentHTML('beforeend', toolCardHTML);
            });
        })
        .catch(error => {
            console.error('Error loading featured tools:', error);
            featuredToolsContainer.innerHTML = '<div class="error-message">Error loading featured tools. Please try again later.</div>';
        });
}

/**
 * Populate popular tools section on home page
 */
function populateHomePopularTools() {
    const popularToolsSection = document.querySelector('.popular-tools-section');
    const popularToolsContainer = document.getElementById('popular-tools');
    if (!popularToolsContainer) return;

    // Add section header with explore all button
    if (popularToolsSection) {
        const sectionHeader = popularToolsSection.querySelector('.section-header');
        if (sectionHeader) {
            // Create "Explore All" button if it doesn't exist
            if (!sectionHeader.querySelector('.explore-all-btn')) {
                const exploreAllBtn = document.createElement('a');
                exploreAllBtn.href = 'popular-tools.html';
                exploreAllBtn.className = 'explore-all-btn';
                exploreAllBtn.textContent = 'Explore All Popular Tools';
                sectionHeader.appendChild(exploreAllBtn);
            }
        }
    }

    // Clear existing content
    popularToolsContainer.innerHTML = '<div class="loading-spinner">Loading popular tools...</div>';

    // Get popular tools (10 cards)
    window.toolsDataModule.getPopularTools(10)
        .then(popularTools => {
            // Clear loading spinner
            popularToolsContainer.innerHTML = '';

            // Add tools to the container
            popularTools.forEach(tool => {
                const toolCardHTML = window.toolsDataModule.createToolCardHTML(tool);
                popularToolsContainer.insertAdjacentHTML('beforeend', toolCardHTML);
            });
        })
        .catch(error => {
            console.error('Error loading popular tools:', error);
            popularToolsContainer.innerHTML = '<div class="error-message">Error loading popular tools. Please try again later.</div>';
        });
}

/**
 * Populate all tools section between popular and latest sections
 */
function populateAllToolsSection() {
    // Check if the section already exists
    let allToolsSection = document.querySelector('.all-tools-section');

    // If the section doesn't exist, create it
    if (!allToolsSection) {
        // Find the popular tools section to insert after
        const popularToolsSection = document.querySelector('.popular-tools-section');
        if (!popularToolsSection) return;

        // Create the all tools section
        allToolsSection = document.createElement('section');
        allToolsSection.className = 'all-tools-section section';

        // Create section header
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = '<h2>All Tools</h2>';

        // Create "Explore All" button
        const exploreAllBtn = document.createElement('a');
        exploreAllBtn.href = 'all-tools.html';
        exploreAllBtn.className = 'explore-all-btn';
        exploreAllBtn.textContent = 'View All Tools';
        sectionHeader.appendChild(exploreAllBtn);

        // Create filter container
        const filterContainer = document.createElement('div');
        filterContainer.className = 'category-filters';
        filterContainer.innerHTML = '<div class="loading-spinner">Loading categories...</div>';

        // Create tools grid
        const toolsGrid = document.createElement('div');
        toolsGrid.id = 'all-tools-grid';
        toolsGrid.className = 'tools-grid small-cards';
        toolsGrid.innerHTML = '<div class="loading-spinner">Loading tools...</div>';

        // Add elements to section
        allToolsSection.appendChild(sectionHeader);
        allToolsSection.appendChild(filterContainer);
        allToolsSection.appendChild(toolsGrid);

        // Insert after popular tools section
        popularToolsSection.parentNode.insertBefore(allToolsSection, popularToolsSection.nextSibling);
    }

    // Get the filter container and tools grid
    const filterContainer = allToolsSection.querySelector('.category-filters');
    const toolsGrid = allToolsSection.querySelector('#all-tools-grid');

    // Load all tools and categories
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

            // Clear tools grid
            toolsGrid.innerHTML = '';

            // Add all tools to the grid
            tools.forEach(tool => {
                const toolCardHTML = window.toolsDataModule.createToolCardHTML(tool);
                toolsGrid.insertAdjacentHTML('beforeend', toolCardHTML);
            });

            // Create filter buttons
            filterContainer.innerHTML = '';

            // Add "All" button
            const allButton = document.createElement('button');
            allButton.className = 'category-filter active';
            allButton.setAttribute('data-category', 'all');
            allButton.textContent = 'All';
            filterContainer.appendChild(allButton);

            // Add category buttons
            Object.keys(categorizedTools).forEach(category => {
                const button = document.createElement('button');
                button.className = 'category-filter';
                button.setAttribute('data-category', category.toLowerCase().replace(/\\s+/g, '-'));
                button.textContent = category;
                filterContainer.appendChild(button);
            });

            // Initialize filter functionality
            initAllToolsFilters();
        })
        .catch(error => {
            console.error('Error loading all tools:', error);
            toolsGrid.innerHTML = '<div class="error-message">Error loading tools. Please try again later.</div>';
        });
}

/**
 * Initialize filter functionality for all tools section
 */
function initAllToolsFilters() {
    const filterButtons = document.querySelectorAll('.all-tools-section .category-filter');
    const toolCards = document.querySelectorAll('#all-tools-grid .tool-card');

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
            toolCards.forEach(card => {
                if (selectedCategory === 'all' || card.getAttribute('data-category') === selectedCategory) {
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
        });
    });
}

/**
 * Populate new tools section
 */
function populateNewTools() {
    const newToolsContainer = document.getElementById('latest-tools-container');
    if (!newToolsContainer) return;

    // Clear existing content
    newToolsContainer.innerHTML = '<div class="loading-spinner">Loading new tools...</div>';

    // Get new tools (10 cards)
    window.toolsDataModule.getNewTools(10)
        .then(newTools => {
            // Clear loading spinner
            newToolsContainer.innerHTML = '';

            // Add tools to the container
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

                newToolsContainer.appendChild(toolItem);
            });
        })
        .catch(error => {
            console.error('Error loading new tools:', error);
            newToolsContainer.innerHTML = '<div class="error-message">Error loading new tools. Please try again later.</div>';
        });
}

/**
 * Populate tool categories section
 */
function populateToolCategories() {
    const categoriesContainer = document.getElementById('tool-categories');
    if (!categoriesContainer) return;

    // Get all categories
    window.toolsDataModule.getAllCategories()
        .then(categories => {
            // Clear existing content
            categoriesContainer.innerHTML = '';

            // Add categories to the container
            categories.forEach(category => {
                const categoryItem = document.createElement('div');
                categoryItem.className = 'category-item';

                // Generate a random color for the category icon
                const colors = ['#00C4CC', '#6A3BE4', '#FF5722', '#FF9800', '#4CAF50', '#2196F3', '#E91E63', '#9C27B0', '#FFC107', '#03A9F4'];
                const randomColor = colors[Math.floor(Math.random() * colors.length)];

                categoryItem.innerHTML = `
                    <div class="category-icon" style="background-color: ${randomColor}">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#FFFFFF">
                            <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
                        </svg>
                    </div>
                    <h3>${category}</h3>
                    <a href="all-tools.html?category=${category.toLowerCase().replace(/\s+/g, '-')}" class="category-link">View Tools</a>
                `;

                categoriesContainer.appendChild(categoryItem);
            });
        })
        .catch(error => {
            console.error('Error loading tool categories:', error);
        });
}
