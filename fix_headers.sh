#!/bin/bash

# Script to fix the header structure in all tool pages
# This script corrects any issues with the header structure

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
  echo "Fixing $dir..."
  
  # Check if index.html exists
  if [ -f "$dir/index.html" ]; then
    # Replace the entire header section with the correct structure
    sed -i '/<header class="site-header">/,/<\/header>/c\    <header class="site-header">\n    <div class="container">\n        <div class="header-left">\n            <div class="logo">\n                <a href="../index.html">\n                    <img src="../assets/images/favicon.svg" alt="Latest Online Tools Logo" class="brand-logo">\n                    <span>LatestOnlineTools<\/span>\n                <\/a>\n            <\/div>\n            <nav class="main-nav">\n                <ul>\n                    <li>\n                        <a href="../popular-tools.html">Popular Tools<\/a>\n                    <\/li>\n                    <li>\n                        <a href="../all-tools.html">All Tools<\/a>\n                    <\/li>\n                <\/ul>\n            <\/nav>\n        <\/div>\n        <div class="nav-actions">\n            <button type="button" class="mobile-menu-toggle" aria-label="Toggle menu">\n                <span><\/span>\n                <span><\/span>\n                <span><\/span>\n            <\/button>\n        <\/div>\n    <\/div>\n<\/header>' "$dir/index.html"
    
    echo "  Fixed $dir/index.html"
  else
    echo "  Warning: $dir/index.html not found"
  fi
  
  # Check for subdirectories like privacy-policy
  for subdir in "$dir"/*; do
    if [ -d "$subdir" ] && [ -f "$subdir/index.html" ]; then
      echo "  Fixing subdirectory $subdir..."
      
      # Replace the entire header section with the correct structure
      sed -i '/<header class="site-header">/,/<\/header>/c\    <header class="site-header">\n    <div class="container">\n        <div class="header-left">\n            <div class="logo">\n                <a href="../../index.html">\n                    <img src="../../assets/images/favicon.svg" alt="Latest Online Tools Logo" class="brand-logo">\n                    <span>LatestOnlineTools<\/span>\n                <\/a>\n            <\/div>\n            <nav class="main-nav">\n                <ul>\n                    <li>\n                        <a href="../../popular-tools.html">Popular Tools<\/a>\n                    <\/li>\n                    <li>\n                        <a href="../../all-tools.html">All Tools<\/a>\n                    <\/li>\n                <\/ul>\n            <\/nav>\n        <\/div>\n        <div class="nav-actions">\n            <button type="button" class="mobile-menu-toggle" aria-label="Toggle menu">\n                <span><\/span>\n                <span><\/span>\n                <span><\/span>\n            <\/button>\n        <\/div>\n    <\/div>\n<\/header>' "$subdir/index.html"
      
      echo "    Fixed $subdir/index.html"
    fi
  done
done

echo "Header fixes completed!"
