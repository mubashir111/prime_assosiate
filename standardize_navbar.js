const fs = require('fs');

const cssToAdd = `	<style id="custom-prim-glass-nav">
		/* Navbar Redesign - Pro Upgrade */
		.prim-glass-nav {
			background: rgba(248, 246, 242, 0.95) !important;
			backdrop-filter: blur(12px) !important;
			-webkit-backdrop-filter: blur(12px) !important;
			border-bottom: 1px solid rgba(45, 62, 80, 0.04) !important;
			box-shadow: 0 8px 32px 0 rgba(19, 89, 137, 0.04) !important;
			transition: all 0.3s ease !important;
		}

		.prim-glass-nav .gutenverse-menu>li>a {
			color: #2d3e50 !important;
			font-weight: 500 !important;
			position: relative;
			transition: color 0.3s ease !important;
		}

		.prim-glass-nav .gutenverse-menu>li>a:hover,
		.prim-glass-nav .gutenverse-menu>li.current-menu-item>a {
			color: #135989 !important;
		}

		.prim-glass-nav .gutenverse-menu>li>a::after {
			content: '';
			position: absolute;
			width: 0%;
			height: 2px;
			bottom: -4px;
			left: 50%;
			transform: translateX(-50%);
			background-color: #135989;
			transition: width 0.3s ease;
			border-radius: 2px;
			opacity: 0.8;
		}

		.prim-glass-nav .gutenverse-menu>li>a:hover::after,
		.prim-glass-nav .gutenverse-menu>li.current-menu-item>a::after {
			width: 80%;
		}

		.prim-glass-nav .guten-b01p9O .guten-button {
			background-color: #eec58b !important;
			color: #2d3e50 !important;
			border-radius: 8px !important;
			box-shadow: 0 4px 12px rgba(238, 197, 139, 0.3) !important;
			font-weight: 600 !important;
			transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) !important;
			border: 1px solid transparent !important;
		}

		.prim-glass-nav .guten-b01p9O .guten-button:hover {
			transform: translateY(-2px) !important;
			box-shadow: 0 6px 16px rgba(45, 62, 80, 0.1) !important;
			background-color: #ffffff !important;
			color: #135989 !important;
			border-color: rgba(19, 89, 137, 0.1) !important;
		}
	</style>
</head>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));

files.forEach(f => {
    if (f === 'index.html') return; // index already has the class and updated CSS

    let content = fs.readFileSync(f, 'utf8');
    let changed = false;

    // Add the CSS before </head> if it's missing
    if (!content.includes('custom-prim-glass-nav')) {
        content = content.replace('</head>', cssToAdd);
        changed = true;
    }

    // Add sticky inline styles and the class to the navbar section
    const targetSectionStart = `class="wp-block-gutenverse-section guten-element guten-section guten-2VyYGc layout-fullwidth align-stretch">`;
    const newSectionStart = `class="wp-block-gutenverse-section guten-element guten-section guten-2VyYGc layout-fullwidth align-stretch prim-glass-nav" style="position: sticky; top: 0; z-index: 9999;">`;

    if (content.includes(targetSectionStart)) {
        content = content.replace(targetSectionStart, newSectionStart);
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(f, content);
        console.log('Standardized', f);
    }
});
