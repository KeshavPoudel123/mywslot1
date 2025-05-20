#!/bin/bash

# Script to completely replace the header section in all tool pages
# This script ensures consistent header structure across all tool pages

# List of tool directories to fix
TOOL_DIRS=(
  "bmp-to-jpg"
  "bmp-to-png"
  "bmp-to-webp"
  "gif-to-jpg"
  "gif-to-png"
  "image-converter"
  "jpg-to-pdf"
  "jpg-to-png"
  "jpg-to-webp"
  "png-to-jpg"
  "png-to-webp"
  "svg-to-jpg"
  "svg-to-webp"
)

# For each tool directory
for dir in "${TOOL_DIRS[@]}"; do
  echo "Processing $dir..."
  
  # Check if index.html exists
  if [ -f "$dir/index.html" ]; then
    # Create a temporary file with the correct header
    cat > temp_header.html << 'EOL'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
EOL

    # Extract the title, description, and other meta tags
    title=$(grep -o '<title>.*</title>' "$dir/index.html")
    description=$(grep -o '<meta name="description" content=".*">' "$dir/index.html")
    
    # Add them to the temp file
    echo "    $description" >> temp_header.html
    echo "    $title" >> temp_header.html
    
    # Add the CSS links
    cat >> temp_header.html << 'EOL'
    <link rel="stylesheet" href="../assets/css/styles.css">
    <link rel="stylesheet" href="../assets/css/tool-template.css">
    <link rel="stylesheet" href="../assets/css/fixes.css">
    <link rel="stylesheet" href="../assets/css/simplified-header.css">
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="../assets/images/favicon.svg">
EOL

    # Extract Open Graph tags
    og_title=$(grep -o '<meta property="og:title" content=".*">' "$dir/index.html")
    og_description=$(grep -o '<meta property="og:description" content=".*">' "$dir/index.html")
    og_image=$(grep -o '<meta property="og:image" content=".*">' "$dir/index.html")
    og_url=$(grep -o '<meta property="og:url" content=".*">' "$dir/index.html")
    
    # Add them to the temp file
    echo "    <!-- Open Graph tags for social sharing -->" >> temp_header.html
    echo "    $og_title" >> temp_header.html
    echo "    $og_description" >> temp_header.html
    echo "    $og_image" >> temp_header.html
    echo "    $og_url" >> temp_header.html
    
    # Add tool-specific CSS and Font Awesome
    cat >> temp_header.html << 'EOL'
    <!-- Tool-specific CSS -->
    <link rel="stylesheet" href="assets/css/styles.css">
    <!-- Font Awesome for icons -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
</head>
<body>
    <header class="site-header">
    <div class="container">
        <div class="header-left">
            <div class="logo">
                <a href="../index.html">
                    <img src="../assets/images/favicon.svg" alt="Latest Online Tools Logo" class="brand-logo">
                    <span>LatestOnlineTools</span>
                </a>
            </div>
            <nav class="main-nav">
                <ul>
                    <li>
                        <a href="../popular-tools.html">Popular Tools</a>
                    </li>
                    <li>
                        <a href="../all-tools.html">All Tools</a>
                    </li>
                </ul>
            </nav>
        </div>
        <div class="nav-actions">
            <button type="button" class="mobile-menu-toggle" aria-label="Toggle menu">
                <span></span>
                <span></span>
                <span></span>
            </button>
        </div>
    </div>
</header>
EOL

    # Get the content after the header
    sed -n '/<main class="tool-content">/,$p' "$dir/index.html" > temp_content.html
    
    # Combine the new header with the existing content
    cat temp_header.html temp_content.html > "$dir/index.html.new"
    mv "$dir/index.html.new" "$dir/index.html"
    
    echo "  Updated $dir/index.html"
  else
    echo "  Warning: $dir/index.html not found"
  fi
done

# Clean up temporary files
rm -f temp_header.html temp_content.html

echo "Header updates completed!"
