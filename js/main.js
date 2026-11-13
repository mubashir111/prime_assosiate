/**
 * PRIM & Associates — site behaviour.
 * Dependency-free. Every feature is progressive enhancement: with JS
 * disabled the page is fully readable (the `js` class gates hidden states).
 */
(() => {
  "use strict";

  const root = document.documentElement;
  root.classList.add("js");

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  /* ---- Mobile navigation ------------------------------------------------ */

  function initNavigation() {
    const toggle = $(".nav-toggle");
    const overlay = $(".nav-overlay");
    if (!toggle) return;

    const setOpen = (open) => {
      root.classList.toggle("nav-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };

    toggle.addEventListener("click", () => setOpen(!root.classList.contains("nav-open")));
    overlay?.addEventListener("click", () => setOpen(false));
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setOpen(false);
    });

    // On small screens the chevron opens the sub-menu; the label still navigates.
    $$(".nav__item--has-menu").forEach((item) => {
      $(".nav__chevron", item)?.addEventListener("click", (event) => {
        if (window.innerWidth > 1024) return;
        event.preventDefault();
        item.classList.toggle("is-open");
      });
    });
  }

  /* ---- Scroll-triggered reveals, counters, meters ----------------------- */

  const formatNumber = (value, decimals) =>
    decimals ? value.toFixed(decimals) : Math.round(value).toLocaleString("en-US");

  function animateCounter(element) {
    const raw = element.dataset.count;
    const target = parseFloat(raw);
    const decimals = (raw.split(".")[1] || "").length;
    if (prefersReducedMotion) {
      element.textContent = formatNumber(target, decimals);
      return;
    }
    const duration = 1800;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = formatNumber(target * eased, decimals);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  function initScrollEffects() {
    // js/story.js (GSAP) owns reveals, counters and bars when it is running.
    if (window.PRIM_STORY) return;
    const targets = $$(".reveal, [data-count], .meter");
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      $$("[data-count]").forEach(animateCounter);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          el.classList.add("is-visible");
          if (el.dataset.count) animateCounter(el);
          observer.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
  }

  /* ---- Accordion --------------------------------------------------------- */

  function initAccordions() {
    $$(".accordion__item").forEach((item) => {
      const trigger = $(".accordion__trigger", item);
      trigger.addEventListener("click", () => {
        const open = item.classList.toggle("is-open");
        trigger.setAttribute("aria-expanded", String(open));
      });
    });
  }

  /* ---- Service filter tabs ---------------------------------------------- */

  function initFilters() {
    const tabs = $$("[data-filter]");
    const cards = $$("[data-category]");
    if (!tabs.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        const filter = tab.dataset.filter;
        tabs.forEach((t) => {
          const active = t === tab;
          t.classList.toggle("is-active", active);
          t.setAttribute("aria-pressed", String(active));
        });
        const apply = () =>
          cards.forEach((card) => {
            card.hidden = filter !== "all" && card.dataset.category !== filter;
          });
        // Animate the re-layout with GSAP Flip when the story layer is present.
        if (window.primFlip) window.primFlip(cards, apply);
        else apply();
      });
    });
  }

  /* ---- Testimonial carousel --------------------------------------------- */

  function initCarousels() {
    // On desktop the story layer scrubs the rows with scroll instead.
    if (window.PRIM_STORY_DESKTOP) return;
    $$("[data-carousel]").forEach((carousel) => {
      const track = $(".carousel__track", carousel);
      const slides = $$(".carousel__slide", track);
      const interval = Number(carousel.dataset.interval) || 3500;
      const reverse = carousel.hasAttribute("data-reverse");
      let index = 0;
      let timer;

      const visible = () => Number(getComputedStyle(carousel).getPropertyValue("--carousel-visible")) || 3;
      const maxIndex = () => Math.max(slides.length - visible(), 0);

      // Tablets and phones: the row is a native swipe strip (see components.css).
      const swipeMode = () => getComputedStyle(carousel).overflowX === "auto";

      const render = () => {
        const slide = slides[0];
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        track.style.transform = `translateX(${-index * (slide.getBoundingClientRect().width + gap)}px)`;
      };

      const next = () => {
        if (swipeMode()) {
          if (carousel.offsetParent === null) return; // hidden duplicate row
          const step = slides[0].getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
          const atEnd = carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 4;
          carousel.scrollTo({ left: atEnd ? 0 : carousel.scrollLeft + step, behavior: "smooth" });
          return;
        }
        const last = maxIndex();
        if (reverse) index = index <= 0 ? last : index - 1;
        else index = index >= last ? 0 : index + 1;
        render();
      };

      const start = () => {
        if (prefersReducedMotion) return;
        stop();
        timer = setInterval(next, interval);
      };
      const stop = () => clearInterval(timer);

      if (reverse) index = maxIndex();
      render();
      carousel.addEventListener("mouseenter", stop);
      carousel.addEventListener("mouseleave", start);
      // A reader swiping takes over; autoplay resumes a few seconds later.
      let resume;
      carousel.addEventListener("touchstart", () => {
        stop();
        clearTimeout(resume);
      }, { passive: true });
      carousel.addEventListener("touchend", () => {
        clearTimeout(resume);
        resume = setTimeout(start, 6000);
      }, { passive: true });
      window.addEventListener("resize", () => {
        index = Math.min(index, maxIndex());
        render();
      });
      start();
    });
  }

  /* ---- Boot -------------------------------------------------------------- */

  initNavigation();
  initScrollEffects();
  initAccordions();
  initFilters();
  initCarousels();
})();
