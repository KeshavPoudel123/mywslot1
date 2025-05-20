# Latest Online Tools

A modern, responsive static website showcasing a collection of free online tools and utilities. This project is designed to be deployed on GitHub Pages with a custom domain.

## 🚀 Features

- Responsive design that works on all devices
- Clean, modern UI with a focus on usability
- Tool categories with descriptive cards
- Latest tools showcase section
- Newsletter signup form with validation
- Optimized for performance and SEO
- GitHub Pages deployment with custom domain

## 📋 Project Structure

```
latestonlinetools/
├── index.html              # Main HTML file
├── assets/                 # Static assets
│   ├── css/
│   │   └── styles.css      # Main stylesheet
│   ├── js/
│   │   └── main.js         # JavaScript functionality
│   └── images/             # Image assets
│       └── tool-icons/     # Tool category icons
├── .github/
│   └── workflows/
│       └── pages.yml       # GitHub Actions workflow for Pages
├── CNAME                   # Custom domain configuration
├── .nojekyll               # Bypass Jekyll processing
└── README.md               # Project documentation
```

## 🛠️ Setup & Development

### Prerequisites

- A modern web browser
- Basic knowledge of HTML, CSS, and JavaScript
- Git (optional, for version control)

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/latestonlinetools.git
   cd latestonlinetools
   ```

2. Open the project in your favorite code editor.

3. For local testing, you can use any of these methods:
   - Open `index.html` directly in your browser
   - Use a local development server like [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) for VS Code
   - Use Python's built-in HTTP server:
     ```bash
     python -m http.server
     ```
     Then visit `http://localhost:8000` in your browser

4. Make your changes and test them locally before deploying.

## 🚢 Deployment

This project is configured to deploy automatically to GitHub Pages when changes are pushed to the main branch.

### Setting Up GitHub Pages

1. Create a new repository on GitHub.

2. Push your code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/latestonlinetools.git
   git push -u origin main
   ```

3. Go to your repository settings on GitHub:
   - Navigate to "Settings" > "Pages"
   - Set the source to "GitHub Actions"
   - The workflow file at `.github/workflows/pages.yml` will handle the deployment

4. Your site will be published at `https://yourusername.github.io/latestonlinetools/`

### Custom Domain Setup

1. Purchase a domain (if you don't already have one).

2. Add your custom domain in GitHub repository settings:
   - Navigate to "Settings" > "Pages"
   - Under "Custom domain", enter `latestonlinetools.com`
   - Check "Enforce HTTPS" for secure connections

3. Configure your domain provider's DNS settings:
   - Add an `A` record pointing to GitHub Pages IP addresses:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - Or add a `CNAME` record pointing to `yourusername.github.io`

4. The CNAME file in the repository will ensure your custom domain persists between deployments.

## 🧩 Customization

### Adding New Tools

To add a new tool to the categories section:

1. Add a new tool card in the `tools-grid` section of `index.html`:
   ```html
   <div class="tool-card">
       <div class="tool-icon">
           <img src="assets/images/tool-icons/your-tool.svg" alt="Tool Name Icon" width="48" height="48">
       </div>
       <h3>Tool Name</h3>
       <p>Description of your tool and its benefits.</p>
       <a href="#" class="tool-link">Launch Tool</a>
   </div>
   ```

2. Add the tool icon to `assets/images/tool-icons/`

### Adding to Latest Tools

To update the latest tools section:

1. Edit the `latestTools` array in `assets/js/main.js`:
   ```javascript
   const latestTools = [
       {
           name: 'Your New Tool',
           description: 'Description of your new tool.',
           icon: 'your-tool-icon',
           date: 'Current Date'
       },
       // Other tools...
   ];
   ```

2. Add the corresponding icon to `assets/images/tool-icons/`

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or feedback, please open an issue on GitHub or reach out via email at contact@latestonlinetools.com.
