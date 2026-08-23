// MD Rifatur Rahman portfolio — vanilla JS (typing animation, scroll-spy nav, fade-in-on-scroll)

// ---------- Typing animation ----------
const TYPING_PHRASES = [
  "Senior Business Development Executive",
  "Sales Strategy & Revenue Growth",
  "Consultative Selling",
  "Client Acquisition & Lead Generation",
  "Key Account Management",
];

function initTypingAnimation() {
  const el = document.getElementById("typing-text");
  if (!el) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    el.textContent = TYPING_PHRASES[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let deleting = false;

  function tick() {
    const phrase = TYPING_PHRASES[phraseIndex];
    if (!deleting) {
      charIndex++;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === phrase.length) {
        deleting = true;
        setTimeout(tick, 1600);
        return;
      }
    } else {
      charIndex--;
      el.textContent = phrase.slice(0, charIndex);
      if (charIndex === 0) {
        deleting = false;
        phraseIndex = (phraseIndex + 1) % TYPING_PHRASES.length;
      }
    }
    setTimeout(tick, deleting ? 35 : 65);
  }
  tick();
}

// ---------- Avatar image loader ----------
// Reveals the photo once it has actually finished loading, so a slow or
// missing image never flashes a broken-image icon.
function initAvatarFallback() {
  const img = document.getElementById("avatar-img");
  if (!img) return;

  const showPhoto = () => {
    img.classList.add("is-loaded");
    const fallback = document.getElementById("avatar-fallback");
    if (fallback) fallback.classList.add("is-hidden");
  };

  // A local or cached image can finish loading BEFORE this script runs, so
  // its "load" event has already fired and a listener would never trigger.
  // Check img.complete (with a real decoded size) and reveal it immediately;
  // otherwise wait for the load event as usual.
  if (img.complete && img.naturalWidth > 0) {
    showPhoto();
  } else {
    img.addEventListener("load", showPhoto);
  }
}

// ---------- Scroll-spy floating nav ----------
function initScrollSpy() {
  const links = document.querySelectorAll(".floating-nav__link");
  const sections = document.querySelectorAll("main .section");
  if (!links.length || !sections.length) return;

  const lastSectionId = sections[sections.length - 1].id;

  const setActive = (id) => {
    links.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.section === id);
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => observer.observe(section));

  // The IntersectionObserver band sits around the vertical middle of the
  // viewport, so once the page is pinned at the very bottom, the last
  // section can never pass through it (there's no more room to scroll).
  // Force the last nav link active whenever we're at (or essentially at)
  // the bottom of the page so "Contact" doesn't stay stuck on the
  // previous section.
  const checkAtBottom = () => {
    const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2;
    if (atBottom) setActive(lastSectionId);
  };
  window.addEventListener("scroll", checkAtBottom, { passive: true });
  window.addEventListener("resize", checkAtBottom);
  checkAtBottom();

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      document.getElementById(link.dataset.section)?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ---------- Fade-in on scroll ----------
function initScrollReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

// ---------- Dark / light mode toggle ----------
// The <head> script already set data-theme on <html> before first paint;
// this just wires up the button to flip and persist it.
function initThemeToggle() {
  const button = document.getElementById("theme-toggle");
  if (!button) return;
  const root = document.documentElement;

  const syncButton = (theme) => {
    button.setAttribute("aria-pressed", String(theme === "dark"));
    button.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  };
  syncButton(root.getAttribute("data-theme") || "light");

  button.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (e) { }
    syncButton(next);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initTypingAnimation();
  initAvatarFallback();
  initScrollSpy();
  initScrollReveal();
  initThemeToggle();
});
