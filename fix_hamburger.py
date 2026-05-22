#!/usr/bin/env python3
"""
Fix hamburger menu visibility in all layout CSS files.
The layout files override the hamburger button with:
  - Green background (accent-link color)
  - Light/white icon color (primary color) — making it invisible on white header

This script replaces those overrides with the correct premium dark navy styles.
"""

import os
import re

LAYOUTS_DIR = os.path.join(os.path.dirname(__file__), "css", "layouts")

# The broken rule (global, not inside media query)
OLD_GLOBAL_HAMBURGER = (
    "#guten-RgkjUx.guten-nav-menu .gutenverse-hamburger-menu {\n"
    "    background: var(--wp--preset--color--accent-link);\n"
    "}"
)
NEW_GLOBAL_HAMBURGER = (
    "#guten-RgkjUx.guten-nav-menu .gutenverse-hamburger-menu {\n"
    "    background: #0f4b6b !important;\n"
    "    display: flex !important;\n"
    "    align-items: center !important;\n"
    "    justify-content: center !important;\n"
    "    width: 44px !important;\n"
    "    height: 44px !important;\n"
    "    padding: 0 !important;\n"
    "    border: none !important;\n"
    "    border-radius: 8px !important;\n"
    "    cursor: pointer !important;\n"
    "    box-shadow: 0 4px 15px rgba(15, 75, 107, 0.3) !important;\n"
    "}"
)

# The broken rules inside @media only screen and (max-width: 1024px)
OLD_MEDIA_ICON = (
    "    #guten-RgkjUx.guten-nav-menu .gutenverse-hamburger-menu i {\n"
    "        font-size: 16px;\n"
    "    }"
)
NEW_MEDIA_ICON = (
    "    #guten-RgkjUx.guten-nav-menu .gutenverse-hamburger-menu i {\n"
    "        font-size: 20px !important;\n"
    "        color: #ffffff !important;\n"
    "        display: block !important;\n"
    "        line-height: 1 !important;\n"
    "    }"
)

OLD_MEDIA_HAMBURGER = (
    "    #guten-RgkjUx.guten-nav-menu .gutenverse-hamburger-menu {\n"
    "        padding-top: 12px;\n"
    "        padding-right: 12px;\n"
    "        padding-bottom: 12px;\n"
    "        padding-left: 12px;\n"
    "        color: var(--wp--preset--color--primary);\n"
    "        border-style: none;\n"
    "        border-top-left-radius: 8px;\n"
    "        border-top-right-radius: 8px;\n"
    "        border-bottom-right-radius: 8px;\n"
    "        border-bottom-left-radius: 8px;\n"
    "    }"
)
NEW_MEDIA_HAMBURGER = (
    "    #guten-RgkjUx.guten-nav-menu .gutenverse-hamburger-menu {\n"
    "        background: #0f4b6b !important;\n"
    "        display: flex !important;\n"
    "        align-items: center !important;\n"
    "        justify-content: center !important;\n"
    "        width: 44px !important;\n"
    "        height: 44px !important;\n"
    "        padding: 0 !important;\n"
    "        border-style: none !important;\n"
    "        border-radius: 8px !important;\n"
    "        cursor: pointer !important;\n"
    "        box-shadow: 0 4px 15px rgba(15, 75, 107, 0.3) !important;\n"
    "    }"
)

layout_files = [f for f in os.listdir(LAYOUTS_DIR) if f.endswith(".css")]

for filename in layout_files:
    filepath = os.path.join(LAYOUTS_DIR, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    original = content

    # Fix global hamburger background
    content = content.replace(OLD_GLOBAL_HAMBURGER, NEW_GLOBAL_HAMBURGER)

    # Fix media query icon color
    content = content.replace(OLD_MEDIA_ICON, NEW_MEDIA_ICON)

    # Fix media query hamburger padding/color
    content = content.replace(OLD_MEDIA_HAMBURGER, NEW_MEDIA_HAMBURGER)

    if content != original:
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Fixed: {filename}")
    else:
        print(f"⚠️  No changes needed (or pattern not matched): {filename}")

print("\nDone! All layout files processed.")
