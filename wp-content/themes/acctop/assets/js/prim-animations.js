/**
 * PRIM & Associates - Professional Design System
 * GSAP & ScrollTrigger Animations
 */

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initScrollAnimations();
});

function initPreloader() {
    const preloader = document.getElementById('prim-preloader');
    const logo = document.querySelector('.preloader-logo');
    const bar = document.querySelector('.preloader-bar');

    if (!preloader || !logo || !bar) return;

    // Safety fallback: ensure preloader is removed AFTER 5 seconds no matter what
    const safetyTimeout = setTimeout(() => {
        dismissPreloader();
    }, 5000);

    function dismissPreloader() {
        clearTimeout(safetyTimeout);
        if (window.gsap) {
            const outroTl = gsap.timeline();
            outroTl.to(logo, { scale: 1.1, opacity: 0, duration: 0.6 })
                .to(preloader, { yPercent: -100, duration: 0.8, ease: "expo.inOut" }, "-=0.2")
                .set(preloader, { display: 'none' });
        } else {
            preloader.style.transition = "opacity 0.8s ease, transform 0.8s ease";
            preloader.style.opacity = "0";
            preloader.style.transform = "translateY(-100%)";
            setTimeout(() => { preloader.style.display = 'none'; }, 800);
        }
    }

    // Intro Animation
    if (window.gsap) {
        const tl = gsap.timeline();
        tl.to(logo, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" })
          .to(bar, { width: "70%", duration: 2, ease: "power1.inOut" });
    } else {
        logo.style.opacity = "1";
        bar.style.width = "70%";
    }

    // Handle Finish Loading
    window.addEventListener('load', () => {
        if (window.gsap) {
            gsap.to(bar, {
                width: "100%",
                duration: 0.5,
                ease: "power1.out",
                onComplete: dismissPreloader
            });
        } else {
            bar.style.width = "100%";
            setTimeout(dismissPreloader, 500);
        }
    });
}

function initScrollAnimations() {
    // 1. Text Scaling & Fading (Starvium Style)
    // Target main headings (H1, H2, H3)
    const headings = document.querySelectorAll('.guten-section h1, .guten-section h2, .guten-section h3, .guten-section h4');

    headings.forEach(heading => {
        // Skip elements with ignore class
        if (heading.classList.contains('prim-ignore-anim')) return;

        // Set initial state
        gsap.set(heading, {
            opacity: 0,
            scale: 0.88,
            y: 30,
            transformOrigin: "center center"
        });

        // Create the scroll-bound animation
        gsap.to(heading, {
            scrollTrigger: {
                trigger: heading,
                start: "top 90%", // Start when top of heading hits 90% of viewport
                end: "top 60%",   // Full opacity/scale by secondary point
                scrub: 1,         // Smoothly tie animation to scroll (1sec catch up)
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out"
        });
    });

    // 2. Card Entrance (Staggered)
    // Target columns or boxes inside services/features
    const cardContainers = document.querySelectorAll('.guten-column, .guten-icon-box-wrapper');

    // We want to animate the inner box of cards
    const cards = document.querySelectorAll('.prim-glass-card, .guten-icon-box-wrapper');

    cards.forEach(card => {
        gsap.set(card, {
            opacity: 0,
            y: 50
        });

        gsap.to(card, {
            scrollTrigger: {
                trigger: card,
                start: "top 95%",
                end: "top 80%",
                scrub: 1,
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power1.out"
        });
    });

    // 3. Special Hero Animation (Immediate or faster scroll)
    const heroTitle = document.querySelector('.guten-hero-section h1, .guten-pCnxvl'); // .guten-pCnxvl is the 'About' but maybe hero has similar
    if (heroTitle) {
        gsap.to(heroTitle, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 1.2,
            ease: "expo.out",
            delay: 0.3
        });
    }
}
