import os

def bundle():
    css_dir = 'css'
    font_import = "/* Google Fonts Import */\n@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&display=swap');\n\n"
    
    files_to_bundle = [
        ('gutenverse-presets.css', 'gutenverse-presets.css'),
        ('gutenverse-core.css', 'gutenverse-core.css'),
        ('variables.css', 'variables.css'),
        ('base.css', 'base.css'),
        ('components.css', 'components.css'),
        ('services.css', 'services.css')
    ]
    
    bundled_content = font_import
    bundled_content += "/*\n   PRIM & Associates - Centralized & Bundled Core Stylesheet\n   This bundle contains presets, core grids, custom branding, components, and animations.\n   Enables compatibility with file:// protocol by avoiding local CORS-blocked @imports.\n*/\n\n"
    
    for filename, display_name in files_to_bundle:
        filepath = os.path.join(css_dir, filename)
        if not os.path.exists(filepath):
            print(f"Error: {filepath} does not exist.")
            return
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        bundled_content += f"/* ==========================================================================\n   FILE: {display_name}\n   ========================================================================== */\n"
        bundled_content += content
        bundled_content += "\n\n"
        
    output_path = os.path.join(css_dir, 'main.css')
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(bundled_content)
        
    print("CSS successfully bundled into css/main.css!")

if __name__ == "__main__":
    bundle()
