const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                replaceInFiles(fullPath);
            }
        } else if (fullPath.endsWith('.html')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Exact string replacement
            content = content.replace(/background: rgba\(248, 246, 242, 0\.95\) !important;/g, 'background: rgba(255, 255, 255, 0.92) !important;');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Replaced background in ' + fullPath);
            }
        }
    }
}

replaceInFiles('./');
