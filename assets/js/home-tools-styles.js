/**
 * Additional styles for the home page tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add styles for the small cards in the All Tools section
    addSmallCardsStyles();
    
    // Add styles for the explore all button
    addExploreAllButtonStyles();
});

/**
 * Add styles for small cards in the All Tools section
 */
function addSmallCardsStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Small cards for All Tools section */
        .tools-grid.small-cards {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            gap: 15px;
            margin-top: 20px;
        }
        
        .tools-grid.small-cards .tool-card {
            padding: 15px;
            min-height: 180px;
        }
        
        .tools-grid.small-cards .tool-card h3 {
            font-size: 16px;
            margin: 10px 0 5px;
        }
        
        .tools-grid.small-cards .tool-card p {
            font-size: 13px;
            margin-bottom: 10px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
        
        .tools-grid.small-cards .tool-card .tool-icon img {
            width: 32px;
            height: 32px;
        }
        
        .tools-grid.small-cards .tool-card .tool-link {
            padding: 6px 12px;
            font-size: 13px;
        }
        
        /* Category filters */
        .category-filters {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin: 20px 0;
        }
        
        .category-filter {
            background-color: #f5f5f5;
            border: 1px solid #e0e0e0;
            border-radius: 20px;
            padding: 6px 15px;
            font-size: 14px;
            cursor: pointer;
            transition: all 0.3s ease;
        }
        
        .category-filter.active {
            background-color: #00C4CC;
            color: white;
            border-color: #00C4CC;
        }
        
        .category-filter:hover:not(.active) {
            background-color: #e0e0e0;
        }
        
        /* All Tools section */
        .all-tools-section {
            margin: 50px 0;
        }
    `;
    document.head.appendChild(style);
}

/**
 * Add styles for the explore all button
 */
function addExploreAllButtonStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Section header with explore all button */
        .section-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        
        .explore-all-btn {
            display: inline-block;
            padding: 8px 16px;
            background-color: #00C4CC;
            color: white;
            border-radius: 4px;
            text-decoration: none;
            font-size: 14px;
            transition: background-color 0.3s ease;
        }
        
        .explore-all-btn:hover {
            background-color: #00a0a6;
        }
    `;
    document.head.appendChild(style);
}
