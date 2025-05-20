#!/bin/bash

# Script to update headers in all tool pages
# This script applies the simplified header to all tool pages

# List of tool directories to modify
TOOL_DIRS=(
  "bmp-to-jpg"
  "bmp-to-png"
  "bmp-to-webp"
  "gif-to-jpg"
  "gif-to-png"
  "gif-to-webp"
  "image-converter"
  "jpg-to-pdf"
  "jpg-to-png"
  "jpg-to-webp"
  "png-to-jpg"
  "png-to-webp"
  "svg-to-jpg"
  "svg-to-png"
  "svg-to-webp"
  "webp-to-png"
)

# For each tool directory
for dir in "${TOOL_DIRS[@]}"; do
  echo "Processing $dir..."
  
  # Check if index.html exists
  if [ -f "$dir/index.html" ]; then
    # 1. Add simplified-header.css link
    sed -i 's|<link rel="stylesheet" href="../assets/css/fixes.css">|<link rel="stylesheet" href="../assets/css/fixes.css">\n    <link rel="stylesheet" href="../assets/css/simplified-header.css">|' "$dir/index.html"
    
    # 2. Replace navigation with simplified version
    sed -i '/<nav class="main-nav">/,/<\/nav>/c\            <nav class="main-nav">\n                <ul>\n                    <li>\n                        <a href="../popular-tools.html">Popular Tools<\/a>\n                    <\/li>\n                    <li>\n                        <a href="../all-tools.html">All Tools<\/a>\n                    <\/li>\n                <\/ul>\n            <\/nav>' "$dir/index.html"
    
    # 3. Replace nav-actions with simplified version
    sed -i '/<div class="nav-actions">/,/<\/div>/c\        <div class="nav-actions">\n            <button type="button" class="mobile-menu-toggle" aria-label="Toggle menu">\n                <span><\/span>\n                <span><\/span>\n                <span><\/span>\n            <\/button>\n        <\/div>' "$dir/index.html"
    
    # 4. Remove mobile search
    sed -i '/<div class="mobile-search">/,/<\/div>/d' "$dir/index.html"
    
    echo "  Updated $dir/index.html"
  else
    echo "  Warning: $dir/index.html not found"
  fi
  
  # Check for subdirectories like privacy-policy
  for subdir in "$dir"/*; do
    if [ -d "$subdir" ] && [ -f "$subdir/index.html" ]; then
      echo "  Processing subdirectory $subdir..."
      
      # 1. Add simplified-header.css link
      sed -i 's|<link rel="stylesheet" href="../../assets/css/fixes.css">|<link rel="stylesheet" href="../../assets/css/fixes.css">\n    <link rel="stylesheet" href="../../assets/css/simplified-header.css">|' "$subdir/index.html"
      
      # 2. Replace navigation with simplified version
      sed -i '/<nav class="main-nav">/,/<\/nav>/c\            <nav class="main-nav">\n                <ul>\n                    <li>\n                        <a href="../../popular-tools.html">Popular Tools<\/a>\n                    <\/li>\n                    <li>\n                        <a href="../../all-tools.html">All Tools<\/a>\n                    <\/li>\n                <\/ul>\n            <\/nav>' "$subdir/index.html"
      
      # 3. Replace nav-actions with simplified version
      sed -i '/<div class="nav-actions">/,/<\/div>/c\        <div class="nav-actions">\n            <button type="button" class="mobile-menu-toggle" aria-label="Toggle menu">\n                <span><\/span>\n                <span><\/span>\n                <span><\/span>\n            <\/button>\n        <\/div>' "$subdir/index.html"
      
      # 4. Remove mobile search
      sed -i '/<div class="mobile-search">/,/<\/div>/d' "$subdir/index.html"
      
      echo "    Updated $subdir/index.html"
    fi
  done
done

echo "Header updates completed!"
