# PRIM & Associates — website

Static marketing site for PRIM & Associates, Chartered Accountants (Kozhikode, Kerala).
Plain HTML, CSS and JavaScript — no build step. Open `index.html` in a browser, or serve
the folder with any static host.

## Structure

```
index.html, about.html, services.html, team.html, contact.html,
appointment.html, blog.html          Main pages
<service>.html (12)                  Service detail pages
<article>.html (3)                   Blog articles
css/
  tokens.css      Colours, type, spacing scale (edit here first)
  base.css        Reset, element defaults, vertical rhythm
  components.css  Buttons, header/nav, cards, forms, carousel, footer …
  home.css        Home page layout
  inner.css       About, Services, Team, Contact, Appointment, Blog
  detail.css      Service detail and blog article pages
  motion.css      Styles supporting the scroll animations
js/
  main.js         Menu, accordion, service filter, carousel, counters (no dependencies)
  story.js        Scroll-story animations (GSAP 3.13 from CDN)
assets/img/       Only the images the site uses
```

## Animation

`js/story.js` uses GSAP (ScrollTrigger, SplitText, Flip), loaded from the jsDelivr CDN.
It is progressive enhancement: if GSAP fails to load, or the visitor prefers reduced
motion, the page shows its final state and `js/main.js` keeps everything working.

## Notes

- Forms (contact, appointment, newsletter, search) are markup only (`action="#"`); they
  need a backend or form service before going live.
- Fonts (Inter, DM Sans) load from Google Fonts; icons from Font Awesome 6.4.2 (cdnjs).
