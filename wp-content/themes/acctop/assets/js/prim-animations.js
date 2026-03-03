/**
 * PRIM & Associates - Professional Design System
 * Scroll-triggered Fade Animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Define the elements we want to animate
    // We target typography, images, and buttons inside content sections
    const selectors = [
        '.guten-section h2:not(.prim-ignore-anim)',
        '.guten-section h3:not(.prim-ignore-anim)',
        '.guten-section p:not(.prim-ignore-anim)',
        '.guten-section .guten-image:not(.prim-ignore-anim)',
        '.guten-section img:not(.prim-ignore-anim)',
        '.guten-section .guten-button:not(.prim-ignore-anim)'
    ];

    // Select all target elements
    const elementsToAnimate = document.querySelectorAll(selectors.join(', '));

    // 2. Add initial hidden class
    elementsToAnimate.forEach(el => {
        // Skip elements that are part of the pre-existing Hero animations or specific widgets
        if (el.closest('.prim-hero-card') || el.closest('.guten-icon-box-wrapper') || el.closest('.prim-glass-nav')) {
            return;
        }
        el.classList.add('prim-fade-elem');
    });

    // 3. Set up Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before the element fully enters the viewport
        threshold: 0.15 // 15% of element must be visible
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add a slight stagger effect based on order
                setTimeout(() => {
                    entry.target.classList.add('prim-in-view');
                }, index * 100); // 100ms stagger per element intersecting at the same time

                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // 4. Start observing the elements with the initial class
    const observerTargets = document.querySelectorAll('.prim-fade-elem');
    observerTargets.forEach(target => {
        animationObserver.observe(target);
    });
});
