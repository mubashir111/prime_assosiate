const fs = require('fs');
const path = require('path');

function replaceInFiles(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceInFiles(fullPath);
        } else if (fullPath.endsWith('.html') || fullPath.endsWith('.css')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let originalContent = content;

            // Case insensitive replace
            content = content.replace(/#04151f/gi, '#135989');

            if (content !== originalContent) {
                fs.writeFileSync(fullPath, content);
                console.log('Replaced in ' + fullPath);
            }
        }
    }
}

replaceInFiles('./');
