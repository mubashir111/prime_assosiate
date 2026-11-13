/**
 * PRIM & Associates — scroll story (GSAP 3.13: ScrollTrigger, SplitText, Flip).
 *
 * The homepage is told as one story, "from scattered paperwork to clear growth".
 * On desktop the key chapters are scroll-scrubbed scenes — the scrollbar is the
 * playhead, and pinned sections hold still while their scene plays:
 *
 *   1 Promise   hero headline rises; on scroll the illustration zooms in and the
 *               copy drifts away, pulling the reader "into" the story
 *   2 People    portrait opens like a curtain, service cards settle like files
 *   3 Proof     counters and bars fill in sync; photos open from small frames
 *   4 Journey   PINNED — steps light up one by one, then the photo expands from
 *               its frame to full screen while zooming in, a caption lands and the
 *               growth comparison plays out over it
 *   5 Voices    PINNED — testimonial rows glide sideways in opposite directions
 *   6 Invite    insights zoom into focus, the closing banner grows into place
 *
 * Phones get the lighter, non-pinned version of every chapter.
 * Reduced motion or missing GSAP: this file exits and main.js shows final state.
 */
(() => {
  "use strict";

  const root = document.documentElement;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !window.gsap || !window.ScrollTrigger) {
    root.classList.remove("motion");
    return;
  }

  // Tell main.js that counters, bars, reveals (and on desktop the carousels) are handled here.
  const DESKTOP = window.matchMedia("(min-width: 1025px)").matches;
  window.PRIM_STORY = true;
  window.PRIM_STORY_DESKTOP = DESKTOP;
  root.classList.add("story");

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger, ...[window.SplitText, window.Flip].filter(Boolean));
  // Pinned scenes resize their spacers; stop the browser "anchoring" the scroll
  // position against that (it can push the reader back down when scrolling up).
  document.documentElement.style.overflowAnchor = "none";
  ScrollTrigger.config({ ignoreMobileResize: true });

  const EASE = "expo.out";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const handled = new Set(); // elements a bespoke chapter already animates

  /* ---- helpers ------------------------------------------------------------ */

  const own = (els) => [els].flat().filter(Boolean).forEach((el) => el.classList.add("story-anim"));
  const release = (els) => [els].flat().filter(Boolean).forEach((el) => el.classList.remove("story-anim"));

  const splitWords = (el) =>
    window.SplitText ? window.SplitText.create(el, { type: "words", mask: "words", wordsClass: "story-word" }).words : [el];

  const drawHighlight = (tl, el, at) => {
    const marks = $$(".highlight", el);
    if (marks.length) tl.fromTo(marks, { backgroundSize: "0% 8px" }, { backgroundSize: "100% 8px", duration: 0.9, ease: "power3.inOut" }, at);
  };

  const formatCount = (v, decimals) => (decimals ? v.toFixed(decimals) : Math.round(v).toLocaleString("en-US"));

  const fillTween = (tl, { counter, meter, duration = 1.8, at = 0, ease = "power3.out" }) => {
    if (counter) {
      const raw = counter.dataset.count;
      const target = parseFloat(raw);
      const decimals = (raw.split(".")[1] || "").length;
      const state = { v: 0 };
      counter.textContent = formatCount(0, decimals);
      tl.to(state, { v: target, duration, ease, onUpdate: () => (counter.textContent = formatCount(state.v, decimals)) }, at);
    }
    if (meter) {
      const fill = $(".meter__fill", meter);
      const value = getComputedStyle(meter).getPropertyValue("--value").trim() || "0%";
      tl.fromTo(fill, { width: "0%" }, { width: value, duration, ease }, at);
    }
  };

  // Move a frame's background photo onto an inner layer we can zoom.
  const zoomLayer = (host) => {
    const bg = getComputedStyle(host).backgroundImage;
    if (!bg || bg === "none") return null;
    const layer = document.createElement("div");
    layer.className = "zoom-layer";
    layer.style.backgroundImage = bg;
    host.classList.add("zoom-host");
    host.prepend(layer);
    return layer;
  };

  // Clip-path inset (px) that frames `frame` inside `stage`'s box.
  const insetOf = (frame, stage, radius = 12) => {
    const f = frame.getBoundingClientRect();
    const s = stage.getBoundingClientRect();
    return `inset(${f.top - s.top}px ${s.right - f.right}px ${s.bottom - f.bottom}px ${f.left - s.left}px round ${radius}px)`;
  };

  /* ---- global --------------------------------------------------------------- */

  function header() {
    const bar = $(".site-header");
    if (!bar) return;
    ScrollTrigger.create({ start: 12, end: "max", onToggle: (self) => bar.classList.toggle("is-scrolled", self.isActive) });
    const progress = document.createElement("div");
    progress.className = "scroll-progress";
    progress.setAttribute("aria-hidden", "true");
    document.body.append(progress);
    gsap.to(progress, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: 0.3 } });
  }

  function headings() {
    $$("main h1, main h2.title-lg, main h2.title-xl, main .cta__title").forEach((h) => {
      if (handled.has(h)) return;
      const words = splitWords(h);
      const tl = gsap.timeline({ scrollTrigger: { trigger: h, start: "top 85%", once: true } });
      tl.from(words, { yPercent: 110, duration: 1, ease: EASE, stagger: 0.05 });
      drawHighlight(tl, h, `-=${Math.max(0.2, 1 - words.length * 0.05)}`);
    });
  }

  function reveals() {
    const selector = [
      ".lead", ".btn-row", ".info-card", ".pillar", ".post-card", ".recent", ".newsletter", ".search",
      ".card--lg", ".tabs", ".accordion__item", ".channel", ".form-card", ".widget", ".advice",
      ".feature", ".pillars", ".author", ".pagination", ".insights__head .btn", ".faq__head .btn", ".prose > *",
    ].join(",");
    const items = $$(selector).filter(
      (el) => !handled.has(el) && !el.closest(".hero, .carousel, .grow-card, .chapter-pin") && !el.parentElement.closest(selector)
    );
    items.forEach((el) => el.classList.remove("reveal"));
    own(items);
    gsap.set(items, { autoAlpha: 0, y: 32 });
    ScrollTrigger.batch(items, {
      start: "top 90%",
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, { autoAlpha: 1, y: 0, duration: 0.9, ease: EASE, stagger: 0.08, clearProps: "transform", onComplete: () => release(batch) }),
    });
  }

  function looseStats() {
    $$(".stat-card, .member__card").forEach((card) => {
      if (handled.has(card)) return;
      own(card);
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 88%", once: true } });
      tl.from(card, { autoAlpha: 0, y: 28, duration: 0.9, ease: EASE, clearProps: "transform", onComplete: () => release(card) });
      fillTween(tl, { counter: $("[data-count]", card), meter: $(".meter", card), at: 0.2 });
    });
  }

  /* ---- images: zoom inside frames, open from small frames -------------------- */

  function images() {
    // Photos open out of a smaller rounded frame while easing out of a zoom.
    const opening = $$(".photo-stack__photo, .content-card__image, .article__image, .media--about, .media--benefits, .contact-hero__photo");
    opening.forEach((el) => {
      if (el.closest(".chapter-pin")) return;
      // A framed <img> zooms inside its frame; a background photo moves to a layer.
      const framed = el.tagName !== "IMG" && el.querySelector(":scope > img");
      const layer = el.tagName === "IMG" ? null : framed || zoomLayer(el);
      // Collage photos stop at 1.08 so there is room for the idle pan below.
      const rest = framed ? 1.08 : 1;
      const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 95%", end: "center 55%", scrub: 0.8 } });
      tl.fromTo(el, { clipPath: "inset(12% 10% 12% 10% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 12px)", ease: "none" }, 0);
      tl.fromTo(layer || el, { scale: 1.3 }, { scale: rest, ease: "none" }, 0);
      // Slow, endless Ken Burns pan inside the frame.
      if (framed) gsap.fromTo(framed, { xPercent: -3 }, { xPercent: 3, duration: 9 + Math.random() * 3, ease: "sine.inOut", yoyo: true, repeat: -1 });
    });

    // Post thumbnails zoom into focus as they travel through the viewport.
    $$(".post-card__thumb img, .recent-mini img").forEach((img) =>
      gsap.fromTo(img, { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: { trigger: img, start: "top bottom", end: "center 40%", scrub: 0.6 } })
    );

    // Depth: framed photos drift against the scroll (desktop).
    if (DESKTOP) {
      $$(".photo-stack__photo").forEach((el, i) => {
        const amount = i % 2 ? 36 : 60;
        gsap.fromTo(el, { y: amount / 2 }, { y: -amount / 2, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true } });
      });
    }
  }

  /* ---- chapter 1: hero ------------------------------------------------------ */

  // Typewriter: the headline types out letter by letter behind a blinking
  // cursor, then keeps going — "Modern Finance" is backspaced and retyped on a
  // loop. Hidden letters keep their space, so the layout never shifts.
  function typeHeadline(tl, title, at) {
    if (!window.SplitText) return;
    // Words stay intact as units so a line never breaks mid-word while typing.
    const chars = window.SplitText.create(title, { type: "words,chars", wordsClass: "type-word", charsClass: "type-char" }).chars;
    const caret = document.createElement("span");
    caret.className = "type-caret";
    caret.setAttribute("aria-hidden", "true");

    const PER_CHAR = 0.055;
    gsap.set(chars, { autoAlpha: 0 });
    tl.call(() => chars[0].before(caret), null, at);
    chars.forEach((ch, i) => {
      tl.call(() => {
        gsap.set(ch, { autoAlpha: 1 });
        ch.after(caret); // the cursor runs just ahead of the newest letter
      }, null, at + 0.12 + i * PER_CHAR);
    });

    const typed = at + 0.12 + chars.length * PER_CHAR;
    // The pen-stroke underline draws once "Modern" is on the page.
    const lastMarked = $$(".highlight .type-char", title).pop();
    const drawAt = lastMarked ? at + 0.12 + (chars.indexOf(lastMarked) + 1) * PER_CHAR : typed;
    drawHighlight(tl, title, drawAt);

    // ---- Continuous loop: hold, backspace "Modern Finance", retype it. ----
    const firstMarked = $(".highlight .type-char", title);
    if (!firstMarked) return;
    const tail = chars.slice(chars.indexOf(firstMarked));          // "ModernFinance"
    const marks = $$(".highlight", title);
    const HOLD = 3.5, BACK = 0.04, RETYPE = 0.07;
    const show = (ch) => { gsap.set(ch, { autoAlpha: 1 }); ch.after(caret); };
    const hide = (ch) => { gsap.set(ch, { autoAlpha: 0 }); ch.before(caret); };

    const loop = gsap.timeline({ repeat: -1, paused: true });
    loop.to(marks, { backgroundSize: "0% 8px", duration: 0.35, ease: "power2.in" }, HOLD);
    [...tail].reverse().forEach((ch, i) => loop.call(() => hide(ch), null, HOLD + 0.1 + i * BACK));
    const retypeAt = HOLD + 0.1 + tail.length * BACK + 0.5;
    tail.forEach((ch, i) => loop.call(() => show(ch), null, retypeAt + i * RETYPE));
    const lastMarkedInTail = tail.indexOf(lastMarked);
    loop.to(marks, { backgroundSize: "100% 8px", duration: 0.8, ease: "power3.inOut" }, retypeAt + (lastMarkedInTail + 1) * RETYPE);
    loop.to({}, { duration: 0.01 }, retypeAt + tail.length * RETYPE); // end of one cycle

    // Start after the first full type-out; pause while the hero is off screen.
    let started = false;
    tl.call(() => { started = true; loop.play(); }, null, typed + 0.2);
    ScrollTrigger.create({
      trigger: title,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => (self.isActive ? started && loop.play() : loop.pause()),
    });
  }

  function hero() {
    const section = $(".hero");
    if (!section) return;
    const title = $(".hero__title", section);
    const media = $(".hero__media", section);
    const img = $(".hero__art", section);
    const parts = [$(".hero__badge", section), $(".hero__text", section), ...$$(".hero .btn", section), img];
    own(parts);
    handled.add(title);

    const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1, onComplete: () => release(parts) });
    tl.from(".hero__badge", { y: 14, autoAlpha: 0, duration: 0.8 }, 0)
      .from(".hero__text", { y: 18, autoAlpha: 0, duration: 0.9 }, 0.55)
      .from(".hero .btn", { y: 16, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.7)
      .from(img, { y: 60, scale: 0.94, autoAlpha: 0, duration: 1.4, transformOrigin: "50% 100%" }, 0.2);
    typeHeadline(tl, title, 0.25);
    // Clients card rises in over the art, then its number counts up.
    const card = $(".hero-card", section);
    if (card && getComputedStyle(card).display !== "none") {
      tl.from(card, { y: 30, autoAlpha: 0, duration: 0.9, ease: "back.out(1.4)" }, 1.1)
        .from($$(".avatars img", card), { x: -10, autoAlpha: 0, duration: 0.5, stagger: 0.08 }, 1.5);
      fillTween(tl, { counter: $("[data-count]", card), at: 1.2, duration: 1.6 });
    }

    // Scroll cue arrives last (children animate in; the parent fades on scroll).
    const cue = $(".scroll-cue", section);
    if (cue) {
      tl.from(cue.children, { y: -10, autoAlpha: 0, duration: 0.8, stagger: 0.1 }, 1.7);
      gsap.to(cue, { autoAlpha: 0, y: 12, ease: "none", scrollTrigger: { start: 0, end: 160, scrub: true } });
    }
    tl.add(() => heroLoops(section), 1.4);

    // Scroll: the illustration zooms in while the copy drifts away.
    const out = gsap.timeline({ scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.6 } });
    out.to(media, { yPercent: 10, ease: "none" }, 0)
      .to(img, { scale: DESKTOP ? 1.3 : 1.12, ease: "none", transformOrigin: "60% 40%" }, 0)
      .to(section.querySelector(".hero__grid > div"), { y: -80, autoAlpha: 0.15, ease: "none" }, 0);
  }

  // Continuous life in the hero art: papers lift, the coin drops. The drawing itself stays grounded (no whole-image float).
  function heroLoops(section) {

    // A sheet now and then lifts off the stack and fades, staying inside the
    // arch so it reads as part of the drawing, not stray specks (the chaos).
    $$(".hero-fx__paper", section).forEach((paper, i) => {
      const dir = i % 2 ? 1 : -1;
      gsap.timeline({ repeat: -1, delay: 0.8 + i * 2.2, repeatDelay: 4 })
        .set(paper, { xPercent: 0, yPercent: 20, rotation: dir * 6, scale: 0.85, autoAlpha: 0 })
        .to(paper, { autoAlpha: 0.95, duration: 0.5 })
        .to(paper, { xPercent: 40 + i * 25, yPercent: -90, rotation: dir * 24, duration: 2.6, ease: "sine.out" }, 0)
        .to(paper, { autoAlpha: 0, duration: 0.8 }, 1.8);
    });

    // The coin drops into the piggy bank and sparkles (the saving).
    const coin = $(".hero-fx__coin", section);
    const sparkle = $(".hero-fx__sparkle", section);
    gsap.timeline({ repeat: -1, repeatDelay: 1.4, delay: 0.6 })
      .set(coin, { yPercent: 0, scaleX: 1, autoAlpha: 1 })
      .to(coin, { yPercent: 30, scaleX: 0.3, duration: 0.35, ease: "power1.in" }) // turns edge-on
      .to(coin, { yPercent: 95, autoAlpha: 0, duration: 0.35, ease: "power2.in" })
      .fromTo(sparkle, { scale: 0, rotation: 0, autoAlpha: 1 }, { scale: 1, rotation: 90, autoAlpha: 0, duration: 0.7, ease: "power2.out" }, "-=0.1");

    // Depth: the card and papers lean toward the pointer (mouse devices only).
    if (DESKTOP && window.matchMedia("(pointer: fine)").matches) {
      const layers = [
        { el: $(".hero-card", section), depth: 14 },
        { el: $(".hero-fx", section), depth: 8 },
      ].map(({ el, depth }) => ({
        depth,
        x: gsap.quickTo(el, "x", { duration: 0.8, ease: "power3.out" }),
        y: gsap.quickTo(el, "y", { duration: 0.8, ease: "power3.out" }),
      }));
      section.addEventListener("pointermove", (e) => {
        const nx = e.clientX / innerWidth - 0.5;
        const ny = e.clientY / innerHeight - 0.5;
        layers.forEach((l) => {
          l.x(nx * l.depth);
          l.y(ny * l.depth);
        });
      });
    }
  }

  function pageIntro() {
    const intro = $(".page-hero, .service-banner, .booking, .contact-hero, .detail--article");
    const title = intro && $("h1", intro);
    if (!title) return;
    handled.add(title);
    const words = splitWords(title);
    const tl = gsap.timeline({ defaults: { ease: EASE }, delay: 0.1 });
    tl.from(words, { yPercent: 110, duration: 1.05, stagger: 0.05 }, 0);
    drawHighlight(tl, title, 0.6);
    const scope = intro.querySelector(".page-hero__grid, .booking__panel, .contact-hero__form") || intro;
    const supporting = $$(":scope .lead, :scope .author, :scope p, :scope .article__meta, :scope .tag", scope)
      .filter((el) => !el.closest(".form-card") && !title.contains(el))
      .slice(0, 3);
    supporting.forEach((el) => handled.add(el));
    if (supporting.length) tl.from(supporting, { y: 18, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.4);
  }

  /* ---- running text: services ticker ---------------------------------------- */

  // An endless loop whose speed follows the reader: scrolling fast speeds it
  // up (backwards when scrolling up), then it eases back to its cruising pace.
  function ticker() {
    const band = $(".ticker");
    const track = band && $(".ticker__track", band);
    if (!track) return;

    const loop = gsap.to(track, { xPercent: -50, ease: "none", duration: 50, repeat: -1 });
    loop.totalTime(loop.duration() * 100); // headroom so it can run backwards
    let paused = false;
    let speed; // the current speed-change timeline; replaced, never stacked
    const setSpeed = (build) => {
      speed?.kill();
      speed = build(gsap.timeline());
    };

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (paused) return;
        const boost = Math.min(Math.abs(self.getVelocity()) / 250, 6);
        setSpeed((tl) =>
          tl.to(loop, { timeScale: (1 + boost) * self.direction, duration: 0.25, ease: "power1.out" })
            .to(loop, { timeScale: 1, duration: 1.4, ease: "power2.out" }, "+=0.15")
        );
      },
    });

    band.addEventListener("mouseenter", () => {
      paused = true;
      setSpeed((tl) => tl.to(loop, { timeScale: 0, duration: 0.5 }));
    });
    band.addEventListener("mouseleave", () => {
      paused = false;
      setSpeed((tl) => tl.to(loop, { timeScale: 1, duration: 0.8 }));
    });
  }

  /* ---- chapter 2: people & services ----------------------------------------- */

  function people() {
    $$(".portrait, .member, .booking__portrait").forEach((frame) => {
      const card = $(".portrait__card, .member__card, .stat-card", frame);
      const photo = $("img", frame);
      if (card) handled.add(card);
      own([frame, card]);
      const tl = gsap.timeline({ scrollTrigger: { trigger: frame, start: "top 80%", once: true }, onComplete: () => release([frame, card]) });
      tl.fromTo(frame, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.4, ease: "expo.inOut" });
      if (photo) tl.from(photo, { scale: 1.2, duration: 1.8, ease: EASE }, 0);
      if (card) {
        tl.from(card, { y: 30, autoAlpha: 0, duration: 0.9, ease: EASE }, "-=0.6");
        fillTween(tl, { counter: $("[data-count]", card), meter: $(".meter", card), at: "-=0.5" });
        // Once landed, the card floats gently so the portrait never feels frozen.
        tl.add(() => gsap.to(card, { y: -8, duration: 3, ease: "sine.inOut", yoyo: true, repeat: -1 }));
      }
      // The photo drifts inside its arch as the page scrolls past.
      if (photo && frame.classList.contains("portrait")) {
        gsap.fromTo(photo, { yPercent: -3 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: frame.closest("section"), start: "top bottom", end: "bottom top", scrub: true } });
      }
    });

    // Service cards are scrubbed by scroll: each one settles out of a tilt as
    // it travels up the viewport, so the reader sees them arrive.
    $$(".service-grid .card").forEach((card, i) => {
      const tilt = (i % 2 ? 1 : -1) * 3;
      gsap.fromTo(
        card,
        { autoAlpha: 0, y: 90, rotation: tilt, transformOrigin: "50% 100%" },
        {
          autoAlpha: 1, y: 0, rotation: 0, ease: "power1.out",
          scrollTrigger: { trigger: card, start: "top 100%", end: "top 70%", scrub: 0.7 },
        }
      );
      // Icon chips pop in once their card is mostly in place.
      gsap.from($(".service-card__icon", card), {
        scale: 0.4, rotation: -30, autoAlpha: 0, duration: 0.7, ease: "back.out(2.2)",
        scrollTrigger: { trigger: card, start: "top 78%", once: true },
      });
    });
  }

  /* ---- chapter 3: proof ------------------------------------------------------ */

  function proof() {
    $$(".photo-stack .stat-card, .media .stat-card, .contact-hero__photo .stat-card").forEach((card) => {
      handled.add(card);
      own(card);
      const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true } });
      tl.from(card, { autoAlpha: 0, y: 40, scale: 0.96, duration: 1, ease: EASE, clearProps: "transform", onComplete: () => release(card) });
      fillTween(tl, { counter: $("[data-count]", card), meter: $(".meter", card), at: 0.25 });
      // Collage stat cards keep bobbing on their own rhythm after the count.
      if (card.closest(".photo-stack")) {
        const i = $$(".photo-stack .stat-card").indexOf(card);
        tl.add(() => gsap.to(card, { y: i ? 9 : -9, duration: 3 + i * 0.7, ease: "sine.inOut", yoyo: true, repeat: -1 }));
      }
    });
  }

  /* ---- chapter 4: journey — pinned photo zoom (desktop) ----------------------- */

  const CAPTIONS = { why: "Scale with a reliable CA partner" };

  function journeyPinned(section, { steps, text, frame, card, caption }) {
    // Read the photo before pinned mode strips it from the frame.
    const photo = getComputedStyle(frame).backgroundImage;
    section.classList.add("chapter-pin");

    // Full-bleed stage behind the content, carrying the frame's photo.
    const stage = document.createElement("div");
    stage.className = "zoom-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = `<div class="zoom-stage__img"></div><div class="zoom-stage__shade"></div>${caption ? `<p class="zoom-stage__caption">${caption}</p>` : ""}`;
    $(".zoom-stage__img", stage).style.backgroundImage = photo;
    section.prepend(stage);

    const [before, after] = card ? $$(".compare", card) : [];
    if (card) {
      handled.add(card);
      gsap.set(card, { autoAlpha: 0, y: 40 });
    }
    steps.forEach((s) => gsap.set(s, { "--line-progress": 0 }));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "+=130%",
        pin: true,
        scrub: 0.4,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: 1,
        onUpdate: (self) => {
          // Steps light up in sequence across the first part of the scene.
          steps.forEach((s, i) => s.classList.toggle("is-active", self.progress > 0.04 + i * 0.09));
          after?.classList.toggle("is-winner", self.progress > 0.9);
        },
      },
    });

    // Beat 1: the journey line draws through each step.
    steps.forEach((s, i) => tl.to(s, { "--line-progress": 1, duration: 1 }, i));
    const t = steps.length;

    // Beat 2: the photo opens from its frame to the whole screen, zooming in.
    tl.fromTo(stage, { clipPath: () => insetOf(frame, stage) }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 2.6, ease: "power2.inOut" }, t + 0.2)
      .fromTo($(".zoom-stage__img", stage), { scale: 1 }, { scale: 1.18, duration: 4.2 }, t + 0.2)
      .to(text, { autoAlpha: 0, x: -60, duration: 1.2 }, t + 0.2)
      .to($(".zoom-stage__shade", stage), { opacity: 1, duration: 1.6 }, t + 1.2);
    if (caption) tl.fromTo($(".zoom-stage__caption", stage), { autoAlpha: 0, yPercent: -30 }, { autoAlpha: 1, yPercent: -50, duration: 1.2, ease: "power2.out" }, t + 2.2);

    // Beat 3: the growth comparison plays out over the photo.
    if (card) {
      tl.to(card, { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }, t + 2.6);
      if (before) fillTween(tl, { meter: $(".meter", before), duration: 0.9, at: t + 3.2, ease: "power1.out" });
      if (after) fillTween(tl, { meter: $(".meter", after), duration: 1.2, at: t + 4.2, ease: "power2.out" });
    }
    tl.to({}, { duration: 0.6 }); // hold the final frame briefly before unpinning
  }

  function journeyLight(steps) {
    steps.forEach((step) => {
      own(step);
      gsap.from(step, { autoAlpha: 0, x: -24, duration: 0.9, ease: EASE, scrollTrigger: { trigger: step, start: "top 88%", once: true }, clearProps: "transform", onComplete: () => release(step) });
      gsap.fromTo(step, { "--line-progress": 0 }, { "--line-progress": 1, ease: "none", scrollTrigger: { trigger: step, start: "top 65%", end: "bottom 65%", scrub: 0.6 } });
      ScrollTrigger.create({ trigger: step, start: "top 70%", onEnter: () => step.classList.add("is-active"), onLeaveBack: () => step.classList.remove("is-active") });
    });
  }

  function payoffLight(card) {
    const [before, after] = $$(".compare", card);
    own(card);
    const tl = gsap.timeline({ scrollTrigger: { trigger: card, start: "top 85%", once: true } });
    tl.from(card, { autoAlpha: 0, y: 40, duration: 1, ease: EASE, clearProps: "transform", onComplete: () => release(card) });
    if (before) fillTween(tl, { meter: $(".meter", before), duration: 1.3, at: 0.4, ease: "power2.out" });
    if (after) {
      fillTween(tl, { meter: $(".meter", after), duration: 1.5, at: 2, ease: "expo.out" });
      tl.add(() => after.classList.add("is-winner"), 2.6);
    }
  }

  function journey() {
    // Sections that pair a step list with a photo frame holding the grow card.
    const pinned = new Set();
    if (DESKTOP) {
      $$(".grow-card").forEach((card) => {
        const frame = card.parentElement;
        const section = frame.closest("main > section");
        const list = section && $(".steps", section);
        if (!list) return;
        const text = list.parentElement;
        const caption = section.classList.contains("why") ? CAPTIONS.why : "";
        journeyPinned(section, { steps: $$(".step", list), text, frame, card, caption });
        pinned.add(list);
        handled.add(text);
        $$(".lead, h2", text).forEach((el) => handled.add(el));
      });
    }
    $$(".steps").forEach((list) => !pinned.has(list) && journeyLight($$(".step", list)));
    $$(".grow-card").forEach((card) => !handled.has(card) && payoffLight(card));
  }

  /* ---- about: the intro video opens to full screen (desktop) ------------------ */

  function videoScene() {
    const frame = $(".video");
    if (!frame || !DESKTOP) return;
    const section = frame.closest("main > section");
    const photo = getComputedStyle(frame).backgroundImage; // read before pinned mode strips it
    section.classList.add("chapter-pin");
    const stage = document.createElement("div");
    stage.className = "zoom-stage";
    stage.setAttribute("aria-hidden", "true");
    stage.innerHTML = `<div class="zoom-stage__img"></div><div class="zoom-stage__shade" style="background: rgb(4 21 32 / 0.35)"></div>`;
    $(".zoom-stage__img", stage).style.backgroundImage = photo;
    section.prepend(stage);
    const play = $(".video__play", frame);

    gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: section, start: "top top", end: "+=100%", pin: true, scrub: 0.4, invalidateOnRefresh: true, refreshPriority: 1 },
    })
      .fromTo(stage, { clipPath: () => insetOf(frame, stage) }, { clipPath: "inset(0px 0px 0px 0px round 0px)", duration: 2, ease: "power2.inOut" }, 0)
      .fromTo($(".zoom-stage__img", stage), { scale: 1 }, { scale: 1.15, duration: 3 }, 0)
      .to($(".zoom-stage__shade", stage), { opacity: 1, duration: 1.5 }, 0.8)
      .fromTo(play, { scale: 0.6, autoAlpha: 0.6 }, { scale: 1.35, autoAlpha: 1, duration: 1.2, ease: "back.out(2)" }, 1.6)
      .to({}, { duration: 0.6 });
  }

  /* ---- chapter 5: voices — rows glide sideways while pinned (desktop) ---------- */

  function voices() {
    const section = $(".testimonials");
    const rows = section ? $$(".carousel", section) : [];
    if (!rows.length) return;

    rows.forEach((row, i) =>
      gsap.from($$(".carousel__slide", row), { autoAlpha: 0, y: 40, duration: 0.9, ease: EASE, stagger: 0.08, delay: i * 0.15, scrollTrigger: { trigger: row, start: "top 88%", once: true } })
    );
    if (!DESKTOP) return;

    const tracks = rows.map((row) => $(".carousel__track", row));
    own(tracks);
    const distance = (i) => tracks[i].scrollWidth - rows[i].clientWidth;
    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: section,
        // Tall sections pin once their rows are fully on screen.
        start: () => (section.offsetHeight > innerHeight ? "bottom bottom" : "center center"),
        end: () => "+=" + Math.max(...tracks.map((_, i) => distance(i))) * 1.1,
        pin: true,
        scrub: 0.4,
        invalidateOnRefresh: true,
        refreshPriority: 1,
      },
    });
    tracks.forEach((track, i) =>
      tl.fromTo(track, { x: () => (i % 2 ? -distance(i) : 0) }, { x: () => (i % 2 ? 0 : -distance(i)), duration: 1 }, 0)
    );
  }

  /* ---- chapter 6: invitation -------------------------------------------------- */

  function invite() {
    const panel = $(".cta__panel");
    if (!panel) return;
    const btn = $(".btn", panel);
    own(panel);
    gsap.fromTo(panel, { scale: 0.86, y: 80 }, { scale: 1, y: 0, ease: "none", scrollTrigger: { trigger: panel, start: "top bottom", end: "top 55%", scrub: 0.6 } });
    ScrollTrigger.create({ trigger: panel, start: "top 60%", once: true, onEnter: () => btn?.classList.add("is-ringing") });
  }

  /* ---- services filter (Flip) ------------------------------------------------- */

  window.primFlip = (cards, applyFilter) => {
    // Cards still waiting for their scroll reveal must be shown now.
    gsap.killTweensOf(cards);
    gsap.set(cards, { autoAlpha: 1, y: 0, clearProps: "transform" });
    release(cards);
    if (!window.Flip) return applyFilter();
    const state = window.Flip.getState(cards);
    applyFilter();
    window.Flip.from(state, {
      duration: 0.6,
      ease: "power2.inOut",
      stagger: 0.03,
      absolute: true,
      onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.5 }),
      onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.4 }),
      onComplete: () => ScrollTrigger.refresh(),
    });
  };

  /* ---- boot ------------------------------------------------------------------- */

  const boot = () => {
    header();
    hero();
    ticker();
    pageIntro();
    videoScene();
    people();
    proof();
    journey();
    voices();
    invite();
    images();
    looseStats();
    headings();
    reveals();
    root.classList.add("story-ready");
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
    window.addEventListener("load", () => ScrollTrigger.refresh());
  };

  (document.fonts?.ready ?? Promise.resolve()).then(boot);
})();
