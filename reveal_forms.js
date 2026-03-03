const fs = require('fs');
const path = require('path');

const dir = './';
const files = fs.readdirSync(dir).filter(file => file.endsWith('.html'));

files.forEach(file => {
    let content = fs.readFileSync(path.join(dir, file), 'utf8');
    let oldContent = content;

    // Remove style="display:none" from all <form tags. Case insensitive just in case.
    content = content.replace(/<form\s+style="display:none"/ig, '<form');

    if (content !== oldContent) {
        fs.writeFileSync(path.join(dir, file), content);
        console.log(`Updated ${file}`);
    }
});
