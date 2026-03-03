const fs = require('fs');

const cssToAddStr = `		.prim-glass-nav .guten-b01p9O .guten-button span,
		.prim-glass-nav .guten-b01p9O .guten-button i {
			color: #ffffff !important;
		}

		.prim-glass-nav .guten-b01p9O .guten-button:hover span,
		.prim-glass-nav .guten-b01p9O .guten-button:hover i {
			color: #ffffff !important;
		}
	</style>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    if (content.includes('custom-prim-glass-nav') && !content.includes('.guten-button span,')) {
        let parts = content.split('<style id="custom-prim-glass-nav">');
        if (parts.length > 1) {
            let styleBlock = parts[1];
            styleBlock = styleBlock.replace('</style>', cssToAddStr);
            content = parts[0] + '<style id="custom-prim-glass-nav">' + styleBlock;
            fs.writeFileSync(f, content);
            console.log('Fixed button text color in', f);
        }
    }
});
