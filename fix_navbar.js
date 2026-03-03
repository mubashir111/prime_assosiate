const fs = require('fs');

const oldCSS = `		/* Navbar Redesign */
		.prim-glass-nav {
			background: #f8f6f2 !important;
			border-bottom: none !important;
		}

		.prim-glass-nav .gutenverse-menu>li>a {
			color: #2d3e50 !important;
			font-weight: 500 !important;
		}

		.prim-glass-nav .guten-b01p9O .guten-button {
			background-color: #eec58b !important;
			color: #2d3e50 !important;
			border-radius: 8px !important;
			box-shadow: none !important;
			font-weight: 600 !important;
		}`;

const newCSS = `		/* Navbar Redesign - Pro Upgrade */
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
		}`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
	let content = fs.readFileSync(f, 'utf8');
	if (content.includes(oldCSS)) {
		content = content.replace(oldCSS, newCSS);
		fs.writeFileSync(f, content);
		console.log('Updated', f);
	} else {
		console.log('Target CSS not found in', f);
	}
});
