
import re

file_path = '/Users/mubashirt/websites/acctop/index.html'

with open(file_path, 'r') as f:
    content = f.read()

# Pattern for the profile isolation
pattern = r'(<div class="profile-image">\s*<img decoding="async"\s*src="index.html"\s*alt="([^"]+)"\s*data-image-placeholder="gutenverse-image-placeholder" />\s*</div>)'

def replace_with_initials(match):
    name = match.group(2)
    initials = "".join([n[0] for n in name.split()]).upper()
    return f'''<div class="profile-image" style="background: #C5A059; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; border-radius: 50%; width: 50px; height: 50px; flex-shrink: 0; margin-right: 15px;">{initials}</div>'''

new_content = re.sub(pattern, replace_with_initials, content)

with open(file_path, 'w') as f:
    f.write(new_content)
print("Successfully replaced profile images with initials.")
