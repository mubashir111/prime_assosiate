
import os
import re

PRO_FOOTER = """
			<div class="section-wrapper" data-id="footer-main" style="background-color: #041520 !important; width: 100% !important; display: block !important; clear: both !important; margin-top: 100px;">
				<footer class="wp-block-gutenverse-section guten-element guten-section layout-boxed align-stretch" style="background-color: #041520 !important; color: #ffffff !important; padding: 160px 0 40px; border-top: 5px solid #135989;">
					<div class="guten-container" style="display: flex; justify-content: space-between; gap: 40px; flex-wrap: wrap; max-width: 1200px; margin: 0 auto; padding: 0 20px; background: transparent !important;">
						<div class="footer-col" style="flex: 1; min-width: 200px;">
							<h6 style="color: #2a76ad !important; font-size: 18px; font-weight: 700; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px;">Support</h6>
							<ul style="list-style: none; padding: 0; margin: 0;">
								<li style="margin-bottom: 12px;"><a href="contact.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Contact Us</a></li>
								<li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Privacy & Policy</a></li>
								<li style="margin-bottom: 12px;"><a href="#" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Terms & Conditions</a></li>
							</ul>
						</div>
						<div class="footer-col" style="flex: 2; min-width: 300px;">
							<div style="margin-bottom: 25px;">
								<img src="images/Prim_Blue.png" alt="PRIM Logo" style="height: 60px; filter: brightness(0) invert(1);">
							</div>
							<p style="color: rgba(255,255,255,0.8) !important; line-height: 1.8; margin-bottom: 20px;">Your Trusted Partner in Financial Excellence. Empowering businesses through strategic audits and expert tax solutions.</p>
							<div style="color: rgba(255,255,255,0.7) !important; font-size: 14px; line-height: 1.6;">
								<p style="margin-bottom: 10px; color: white !important;"><strong>Office Address:</strong> Orris Tower, Opp. Hilite Mall, Palazhi Junction, Kozhikode-673014, Kerala</p>
								<p style="margin-bottom: 10px; color: white !important;"><strong>Phone:</strong> 9656757373</p>
								<p style="color: white !important;"><strong>Email:</strong> primcaclt@gmail.com</p>
							</div>
						</div>
						<div class="footer-col" style="flex: 1; min-width: 150px;">
							<h6 style="color: #2a76ad !important; font-size: 18px; font-weight: 700; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px;">Quick Links</h6>
							<ul style="list-style: none; padding: 0; margin: 0;">
								<li style="margin-bottom: 12px;"><a href="index.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Home</a></li>
								<li style="margin-bottom: 12px;"><a href="about.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">About Us</a></li>
								<li style="margin-bottom: 12px;"><a href="appointment.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Appointment</a></li>
							</ul>
						</div>
						<div class="footer-col" style="flex: 1.5; min-width: 200px;">
							<h6 style="color: #2a76ad !important; font-size: 18px; font-weight: 700; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px;">Services</h6>
							<ul style="list-style: none; padding: 0; margin: 0;">
								<li style="margin-bottom: 12px;"><a href="audit-assurance.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Audit & Assurance</a></li>
								<li style="margin-bottom: 12px;"><a href="tax-regulatory.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Tax & Regulatory</a></li>
								<li style="margin-bottom: 12px;"><a href="corporate-law.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Corporate Law</a></li>
								<li style="margin-bottom: 12px;"><a href="accounting-outsourcing.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Accounting Outsourcing</a></li>
								<li style="margin-bottom: 12px;"><a href="outsourced-cfo.html" style="color: rgba(255,255,255,0.8) !important; text-decoration: none !important; transition: color 0.3s;">Outsourced CFO</a></li>
							</ul>
						</div>
					</div>
					<div class="guten-container" style="margin-top: 60px; padding-top: 30px; border-top: 1px solid rgba(255,255,255,0.1); text-align: center; background: transparent !important;">
						<p style="color: rgba(255,255,255,0.5) !important; font-size: 14px;">Copyright © PRIM & Associates 2026. All rights reserved.</p>
					</div>
				</footer>
			</div>
"""

def fix_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 1. Clean existing footer occurrences
    content = re.sub(r"<div class=\"section-wrapper\" data-id=\"footer-main\".*?</footer>\s*</div>", "", content, flags=re.DOTALL)
    content = re.sub(r"<!-- Column 1: Support -->.*?</footer>\s*</div>", "", content, flags=re.DOTALL)
    # Also clean older KPot0H footer if present
    content = re.sub(r"<div class=\"section-wrapper\" data-id=\"KPot0H\".*?</footer>\s*</div>", "", content, flags=re.DOTALL)
    
    # 2. Find insertion point
    # Priority: skip-link script > first script tag near bottom > </body>
    insertion_marker = '<script id="wp-block-template-skip-link-js-after">'
    if insertion_marker not in content:
        insertion_marker = '</body>'
    
    if insertion_marker not in content:
        return
    
    parts = content.split(insertion_marker)
    main_body = parts[0]
    scripts = insertion_marker + parts[1]
    
    # 3. Ensure main_body ends with necessary closing tags
    open_divs = main_body.count('<div') - main_body.count('</div')
    open_sections = main_body.count('<section') - main_body.count('</section')
    
    closers = ("</div>" * max(0, open_divs)) + ("</section>" * max(0, open_sections))
    
    new_content = main_body + closers + "\n" + PRO_FOOTER + "\n" + scripts
    
    with open(path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print(f"Standardized {path}")

files = [f for f in os.listdir('.') if f.endswith('.html')]
for f in files:
    fix_file(f)
