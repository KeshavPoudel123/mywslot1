/**
 * Quick Search Pro - Browser Extension
 * Latest Online Tools
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the tool content
    initializeExtensionContent();

    // Initialize similar tools
    initializeSimilarTools();

    // Initialize FAQ accordion
    initializeFAQ();

    // Initialize animation on scroll
    initializeAnimationOnScroll();
});

/**
 * Initialize the Quick Search Pro extension content
 */
function initializeExtensionContent() {
    const toolMainContent = document.getElementById('tool-main-content');

    // Create the extension HTML content
    const extensionHTML = `
        <!-- Extension Hero Section -->
        <section class="extension-hero">
            <div class="container">
                <div class="extension-logo">
                    <img src="images/logo.svg" alt="QuickSearchPro Logo">
                </div>
                <h1 class="extension-title">QuickSearchPro</h1>
                <p class="extension-subtitle">Enhance your browsing with powerful context menu search options. Select text and search across multiple engines with one click.</p>

                <a href="https://chrome.google.com/webstore/detail/quicksearchpro/YOUR-EXTENSION-ID" class="cta-button" target="_blank" rel="noopener">
                    <span class="material-icons">download</span> Download Extension
                </a>
            </div>
        </section>

        <!-- Features Section -->
        <section id="features" class="section">
            <div class="container">
                <h2 class="section-title">Powerful Features</h2>
                <p class="section-subtitle">QuickSearchPro comes packed with features designed to enhance your browsing and searching experience.</p>

                <div class="features-grid">
                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">search</span>
                        </div>
                        <h3 class="feature-title">Multiple Search Engines</h3>
                        <p class="feature-description">Access Google, Bing, DuckDuckGo, Yahoo, Brave Search, Ecosia, and more directly from your context menu.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">grid_view</span>
                        </div>
                        <h3 class="feature-title">Specialized Searches</h3>
                        <p class="feature-description">Quickly search for images, videos, news, maps, shopping, and more with specialized search options.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">smart_toy</span>
                        </div>
                        <h3 class="feature-title">AI Chatbot Integration</h3>
                        <p class="feature-description">Send selected text directly to ChatGPT, Perplexity, Copilot, and other AI assistants.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">folder</span>
                        </div>
                        <h3 class="feature-title">Customizable Categories</h3>
                        <p class="feature-description">Organize search providers into logical categories for easy access and better organization.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">tune</span>
                        </div>
                        <h3 class="feature-title">Full Personalization</h3>
                        <p class="feature-description">Enable/disable specific search options and reorder them to match your preferences.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">star</span>
                        </div>
                        <h3 class="feature-title">Favorites System</h3>
                        <p class="feature-description">Mark your most-used search providers as favorites for quick access.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- How to Use Section -->
        <section id="how-to-use" class="section">
            <div class="container">
                <h2 class="section-title">How to Use QuickSearchPro</h2>
                <p class="section-subtitle">Using QuickSearchPro is simple and intuitive. Follow these steps to enhance your browsing experience.</p>

                <div class="steps-container">
                    <div class="step animate-on-scroll">
                        <div class="step-number">1</div>
                        <div class="step-content">
                            <h3>Select Text on Any Webpage</h3>
                            <p>Highlight any text you want to search for. It can be a word, phrase, or even a paragraph.</p>
                        </div>
                        <div class="step-image">
                            <img src="images/step1.png" alt="Select text on webpage">
                        </div>
                    </div>

                    <div class="step animate-on-scroll">
                        <div class="step-number">2</div>
                        <div class="step-content">
                            <h3>Right-Click to Open Context Menu</h3>
                            <p>After selecting text, right-click to open the context menu which now includes QuickSearchPro options.</p>
                        </div>
                        <div class="step-image">
                            <img src="images/step2.png" alt="Right-click to open context menu">
                        </div>
                    </div>

                    <div class="step animate-on-scroll">
                        <div class="step-number">3</div>
                        <div class="step-content">
                            <h3>Choose Your Search Provider</h3>
                            <p>Navigate through the categories and select the search provider you want to use.</p>
                        </div>
                        <div class="step-image">
                            <img src="images/step3.png" alt="Choose search provider">
                        </div>
                    </div>

                    <div class="step animate-on-scroll">
                        <div class="step-number">4</div>
                        <div class="step-content">
                            <h3>View Search Results</h3>
                            <p>The search results will open in a new tab, showing you the results for your selected text.</p>
                        </div>
                        <div class="step-image">
                            <img src="images/step4.png" alt="View search results">
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Customization Section -->
        <section id="customization" class="section">
            <div class="container">
                <h2 class="section-title">Customize Your Experience</h2>
                <p class="section-subtitle">QuickSearchPro is fully customizable to match your preferences and workflow.</p>

                <div class="features-grid">
                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">add_circle</span>
                        </div>
                        <h3 class="feature-title">Add Custom Search Providers</h3>
                        <p class="feature-description">Add your own custom search providers with specific URLs and categories.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">visibility_off</span>
                        </div>
                        <h3 class="feature-title">Hide Unused Providers</h3>
                        <p class="feature-description">Disable search providers you don't use to keep your context menu clean and focused.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">sort</span>
                        </div>
                        <h3 class="feature-title">Reorder Categories and Providers</h3>
                        <p class="feature-description">Arrange categories and search providers in the order that works best for you.</p>
                    </div>

                    <div class="feature-card animate-on-scroll">
                        <div class="feature-icon">
                            <span class="material-icons">save_alt</span>
                        </div>
                        <h3 class="feature-title">Import/Export Configuration</h3>
                        <p class="feature-description">Backup your settings or transfer them to another device with easy import/export.</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- FAQ Section -->
        <section id="faq" class="section">
            <div class="container">
                <h2 class="section-title">Frequently Asked Questions</h2>
                <p class="section-subtitle">Find answers to common questions about QuickSearchPro.</p>

                <div class="faq-container">
                    <div class="faq-item">
                        <div class="faq-question">How do I install QuickSearchPro?</div>
                        <div class="faq-answer">
                            <p>Installing QuickSearchPro is simple:</p>
                            <ol>
                                <li>Visit the <a href="https://chrome.google.com/webstore/detail/quicksearchpro/YOUR-EXTENSION-ID" target="_blank" rel="noopener">Chrome Web Store listing</a></li>
                                <li>Click the "Add to Chrome" button</li>
                                <li>Confirm the installation when prompted</li>
                                <li>The extension will be installed and ready to use immediately</li>
                            </ol>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question">What permissions does QuickSearchPro require?</div>
                        <div class="faq-answer">
                            <p>QuickSearchPro requires minimal permissions to function:</p>
                            <ul>
                                <li><strong>Context Menus</strong>: To add search options to your right-click menu</li>
                                <li><strong>Storage</strong>: To save your preferences locally in your browser</li>
                                <li><strong>Tabs</strong>: To open search results in new tabs</li>
                            </ul>
                            <p>We request only the permissions necessary for the extension to work properly. Your data remains private and is never sent to external servers.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question">Does QuickSearchPro collect my data?</div>
                        <div class="faq-answer">
                            <p>No, QuickSearchPro does not collect, store, or transmit any user data outside of your browser. All configuration data is stored locally in your browser's storage and is never sent to external servers.</p>
                            <p>When you use QuickSearchPro to search with a particular provider, your search query will be sent to that provider's website (e.g., Google, Bing, etc.). This is necessary for the search functionality to work. Please refer to each search provider's privacy policy for information on how they handle your search data.</p>
                            <p>For more details, please see our <a href="privacy-policy">Privacy Policy</a>.</p>
                        </div>
                    </div>

                    <div class="faq-item">
                        <div class="faq-question">How do I customize the search providers?</div>
                        <div class="faq-answer">
                            <p>To customize search providers:</p>
                            <ol>
                                <li>Click on the QuickSearchPro icon in your browser toolbar</li>
                                <li>Click "Open Settings" to access the options page</li>
                                <li>In the options page, you can:
                                    <ul>
                                        <li>Add new search providers</li>
                                        <li>Edit existing providers</li>
                                        <li>Enable/disable providers</li>
                                        <li>Reorder categories and providers</li>
                                        <li>Mark providers as favorites</li>
                                    </ul>
                                </li>
                                <li>All changes are saved automatically</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </section>


        <!-- Version History Section -->
        <section id="version-changelog" class="section">
            <div class="container">
                <h2 class="section-title">Version History</h2>
                <p class="section-subtitle">See how QuickSearchPro has evolved over time with new features and improvements.</p>

                <div class="faq-container">
                    <div class="version-item">
                        <h3>Version 1.0 <span class="version-date">- May 2025</span></h3>
                        <ul>
                            <li>Initial release of QuickSearchPro</li>
                            <li>Support for major search engines (Google, Bing, DuckDuckGo, Yahoo)</li>
                            <li>Customization options</li>
                            <li>Context menu integration</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- Legal Information Section -->
        <section id="legal" class="section legal-section">
            <div class="container">
                <h2 class="section-title">Legal Information</h2>
                <p class="section-subtitle">Important information about our privacy policy.</p>

                <div class="legal-cards-container">
                    <div class="legal-card">
                        <span class="material-icons legal-card-icon">privacy_tip</span>
                        <h3 class="legal-card-title">Privacy Policy</h3>
                        <p class="legal-card-description">Learn how we protect your data and privacy.</p>
                        <a href="privacy-policy" class="btn btn-primary">View Privacy Policy</a>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <h2 class="cta-title">Ready to Transform Your Browsing Experience?</h2>
                <p class="cta-description">Join thousands of users who are saving time and enhancing their productivity with QuickSearchPro.</p>
                <a href="https://chrome.google.com/webstore/detail/quicksearchpro/YOUR-EXTENSION-ID" class="cta-button-large" target="_blank" rel="noopener">
                    <i class="fab fa-chrome"></i> Add to Chrome - Free
                </a>
            </div>
        </section>
    `;

    // Insert the HTML into the tool main content
    toolMainContent.innerHTML = extensionHTML;
}

/**
 * Initialize similar tools section
 */
function initializeSimilarTools() {
    // This will be populated by the tool-template.js script
    // which uses the tools-data.js to find similar tools
}

/**
 * Initialize FAQ accordion functionality
 */
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');

        question.addEventListener('click', () => {
            // Toggle active class on the clicked item
            item.classList.toggle('active');

            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
        });
    });
}

/**
 * Initialize animation on scroll
 */
function initializeAnimationOnScroll() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');

    // Function to check if an element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8
        );
    }

    // Function to handle scroll animation
    function handleScrollAnimation() {
        animatedElements.forEach(element => {
            if (isInViewport(element)) {
                element.classList.add('visible');
            }
        });
    }

    // Initial check on load
    handleScrollAnimation();

    // Check on scroll
    window.addEventListener('scroll', handleScrollAnimation);
}
