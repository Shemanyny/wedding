const menuToggle = document.querySelector(".menu-toggle");
const mobileNav = document.querySelector(".mobile-nav");

menuToggle.addEventListener("click", () => {
  const isOpen = mobileNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  menuToggle.querySelector(".menu-label").textContent = isOpen ? "Close" : "Menu";
});

document.querySelectorAll(".mobile-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open menu");
    menuToggle.querySelector(".menu-label").textContent = "Menu";
  });
});

const form = document.querySelector("#rsvp-form");
const message = document.querySelector(".form-message");

if (form && message) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const guestName = document.querySelector("#name").value.trim();
    const answer = document.querySelector("#attendance").value;
    message.textContent =
      answer === "Joyfully accepting"
        ? `Thank you, ${guestName}. We cannot wait to celebrate with you!`
        : `Thank you, ${guestName}. We will miss you on the day.`;
    form.reset();
  });
}

// Scroll-triggered reveal animation using IntersectionObserver
(function () {
  const prefersReduced = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const selector =
    "main div, .hero-content, footer, .story-images > *, .gallery-grid figure";
  const elements = Array.from(document.querySelectorAll(selector));
  if (elements.length === 0) return;

  // Ensure elements start hidden via the `.reveal` class
  elements.forEach((el) => el.classList.add("reveal"));

  if (prefersReduced) {
    elements.forEach((el) => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // allow optional per-element delay via `data-reveal-delay` (ms)
        const attr = el.getAttribute("data-reveal-delay");
        const baseIndex = elements.indexOf(el);
        const computedDelay = attr ? parseInt(attr, 10) : (baseIndex % 6) * 60; // stagger small groups
        el.style.transitionDelay = `${computedDelay}ms`;
        el.classList.add("visible");
        obs.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
  );

  elements.forEach((el) => observer.observe(el));
})();

// Simple gallery lightbox
(function () {
  const gallery = document.querySelector(".gallery-grid");
  const lightbox = document.querySelector(".lightbox");
  if (!gallery || !lightbox) return;

  const imgs = Array.from(gallery.querySelectorAll("figure"));
  const lbImg = lightbox.querySelector(".lightbox__stage img");
  const lbCaption = lightbox.querySelector(".lightbox__caption");
  const btnClose = lightbox.querySelector(".lightbox__close");
  const btnNext = lightbox.querySelector(".lightbox__next");
  const btnPrev = lightbox.querySelector(".lightbox__prev");
  let current = 0;

  function show(index) {
    const fig = imgs[index];
    const img = fig.querySelector("img");
    lbImg.src = img.src;
    lbImg.alt = img.alt || "";
    lbCaption.textContent = fig.querySelector("figcaption")?.textContent || "";
    lightbox.setAttribute("aria-hidden", "false");
    current = index;
    document.body.style.overflow = "hidden";
  }

  function hide() {
    lightbox.setAttribute("aria-hidden", "true");
    lbImg.src = "";
    document.body.style.overflow = "";
  }

  function next() {
    show((current + 1) % imgs.length);
  }
  function prev() {
    show((current - 1 + imgs.length) % imgs.length);
  }

  imgs.forEach((fig, i) => {
    fig.addEventListener("click", () => show(i));
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") show(i);
    });
  });

  btnClose.addEventListener("click", hide);
  btnNext.addEventListener("click", next);
  btnPrev.addEventListener("click", prev);

  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) hide();
  });

  document.addEventListener("keydown", (e) => {
    if (lightbox.getAttribute("aria-hidden") === "false") {
      if (e.key === "Escape") hide();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
  });
})();

// Countdown timer to wedding date
(function () {
  const el = document.getElementById("countdown");
  if (!el) return;

  // Target: April 24, 2027 at 16:00 local time
  const target = new Date("2027-04-24T16:00:00");

  const daysEl = document.getElementById("cd-days");
  const hoursEl = document.getElementById("cd-hours");
  const minsEl = document.getElementById("cd-minutes");
  const secsEl = document.getElementById("cd-seconds");

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function update() {
    const now = new Date();
    let diff = target - now;
    if (diff <= 0) {
      el.innerHTML =
        '<div class="countdown-inner"><div class="countdown-item"><span class="count">00</span><span class="label">Event started</span></div></div>';
      clearInterval(timer);
      return;
    }
    const days = Math.floor(diff / 86400000);
    diff %= 86400000;
    const hours = Math.floor(diff / 3600000);
    diff %= 3600000;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    if (daysEl) daysEl.textContent = pad(days);
    if (hoursEl) hoursEl.textContent = pad(hours);
    if (minsEl) minsEl.textContent = pad(mins);
    if (secsEl) secsEl.textContent = pad(secs);
  }

  update();
  const timer = setInterval(update, 1000);
})();
