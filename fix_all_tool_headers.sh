#!/bin/bash

# Script to fix all tool page headers
# This script applies the simplified header to all tool pages

# List of tool directories to fix
TOOL_DIRS=(
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

# First, ensure all tool pages have the simplified-header.css link
for dir in "${TOOL_DIRS[@]}"; do
  echo "Processing $dir..."
  
  # Check if index.html exists
  if [ -f "$dir/index.html" ]; then
    # Add simplified-header.css if it doesn't exist
    if ! grep -q "simplified-header.css" "$dir/index.html"; then
      sed -i 's|<link rel="stylesheet" href="../assets/css/fixes.css">|<link rel="stylesheet" href="../assets/css/fixes.css">\n    <link rel="stylesheet" href="../assets/css/simplified-header.css">|' "$dir/index.html"
      echo "  Added simplified-header.css to $dir/index.html"
    fi
    
    # Replace the header section with the simplified version
    sed -i '/<header class="site-header">/,/<\/header>/c\    <header class="site-header">\n    <div class="container">\n        <div class="header-left">\n            <div class="logo">\n                <a href="../index.html">\n                    <img src="../assets/images/favicon.svg" alt="Latest Online Tools Logo" class="brand-logo">\n                    <span>LatestOnlineTools<\/span>\n                <\/a>\n            <\/div>\n            <nav class="main-nav">\n                <ul>\n                    <li>\n                        <a href="../popular-tools.html">Popular Tools<\/a>\n                    <\/li>\n                    <li>\n                        <a href="../all-tools.html">All Tools<\/a>\n                    <\/li>\n                <\/ul>\n            <\/nav>\n        <\/div>\n        <div class="nav-actions">\n            <button type="button" class="mobile-menu-toggle" aria-label="Toggle menu">\n                <span><\/span>\n                <span><\/span>\n                <span><\/span>\n            <\/button>\n        <\/div>\n    <\/div>\n<\/header>' "$dir/index.html"
    
    echo "  Updated header in $dir/index.html"
  else
    echo "  Warning: $dir/index.html not found"
  fi
  
  # Check for subdirectories like privacy-policy
  for subdir in "$dir"/*; do
    if [ -d "$subdir" ] && [ -f "$subdir/index.html" ]; then
      echo "  Processing subdirectory $subdir..."
      
      # Add simplified-header.css if it doesn't exist
      if ! grep -q "simplified-header.css" "$subdir/index.html"; then
        sed -i 's|<link rel="stylesheet" href="../../assets/css/fixes.css">|<link rel="stylesheet" href="../../assets/css/fixes.css">\n    <link rel="stylesheet" href="../../assets/css/simplified-header.css">|' "$subdir/index.html"
        echo "    Added simplified-header.css to $subdir/index.html"
      fi
      
      # Replace the header section with the simplified version
      sed -i '/<header class="site-header">/,/<\/header>/c\    <header class="site-header">\n    <div class="container">\n        <div class="header-left">\n            <div class="logo">\n                <a href="../../index.html">\n                    <img src="../../assets/images/favicon.svg" alt="Latest Online Tools Logo" class="brand-logo">\n                    <span>LatestOnlineTools<\/span>\n                <\/a>\n            <\/div>\n            <nav class="main-nav">\n                <ul>\n                    <li>\n                        <a href="../../popular-tools.html">Popular Tools<\/a>\n                    <\/li>\n                    <li>\n                        <a href="../../all-tools.html">All Tools<\/a>\n                    <\/li>\n                <\/ul>\n            <\/nav>\n        <\/div>\n        <div class="nav-actions">\n            <button type="button" class="mobile-menu-toggle" aria-label="Toggle menu">\n                <span><\/span>\n                <span><\/span>\n                <span><\/span>\n            <\/button>\n        <\/div>\n    <\/div>\n<\/header>' "$subdir/index.html"
      
      echo "    Updated header in $subdir/index.html"
    fi
  done
done

echo "Header updates completed!"
