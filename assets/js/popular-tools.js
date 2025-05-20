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
            // Clear loading spinner
            popularToolsContainer.innerHTML = '';

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

        })
        .catch(error => {
            console.error('Error loading popular tools:', error);
            popularToolsContainer.innerHTML = '<div class="error-message">Error loading popular tools. Please try again later.</div>';
        });
}

// Filter functions removed as per requirement to show all tools without filtering

// All filter functionality removed as per requirement to show all tools without filtering

// Filter function removed as per requirement to show all tools without filtering

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
