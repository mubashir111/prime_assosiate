const fs = require('fs');

const oldCSS = `	<style id="custom-prim-glass-nav">
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
	</style>`;

const newCSS = `	<style id="custom-prim-glass-nav">
		/* Navbar Ultra Clean Corporate */
		.prim-glass-nav {
			background: rgba(255, 255, 255, 0.92) !important;
			backdrop-filter: blur(16px) !important;
			-webkit-backdrop-filter: blur(16px) !important;
			border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -2px rgba(0, 0, 0, 0.02) !important;
			transition: all 0.3s ease !important;
		}

		.prim-glass-nav .gutenverse-menu>li>a {
			color: #4a5568 !important;
			font-weight: 500 !important;
			transition: color 0.15s ease-in-out !important;
		}

		.prim-glass-nav .gutenverse-menu>li>a:hover,
		.prim-glass-nav .gutenverse-menu>li.current-menu-item>a {
			color: #135989 !important;
		}

		.prim-glass-nav .guten-b01p9O .guten-button {
			background-color: #135989 !important;
			color: #ffffff !important;
			border-radius: 4px !important;
			box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06) !important;
			font-weight: 500 !important;
			letter-spacing: 0.025em !important;
			transition: all 0.2s ease-in-out !important;
			border: 1px solid transparent !important;
		}

		.prim-glass-nav .guten-b01p9O .guten-button:hover {
			transform: translateY(-1px) !important;
			box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06) !important;
			background-color: #0e4468 !important;
		}
	</style>`;

const files = fs.readdirSync('.').filter(f => f.endsWith('.html'));
files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');

    // Remove the old oldCSS block from index.html that might be slightly different.
    // Index.html has "/* Navbar Redesign - Pro Upgrade */" inside <style id="custom-prim-glass-nav">
    // wait, earlier I replaced oldCSS starting with `/* Navbar Redesign */` in index.html, but I did not include `<style id="custom-prim-glass-nav">` in index.html initially. Wait!
    // let me use a regex to replace everything inside <style id="custom-prim-glass-nav"> to </style>

    const regex = /<style id="custom-prim-glass-nav">[\s\S]*?<\/style>/;

    if (regex.test(content)) {
        content = content.replace(regex, newCSS);
        fs.writeFileSync(f, content);
        console.log('Updated', f);
    } else {
        console.log('Target CSS not found in', f);
    }
});
