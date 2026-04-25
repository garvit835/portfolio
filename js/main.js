/* ============================================================
   main.js  –  Portfolio interactive behaviours
   ============================================================ */

// ── Typed text effect ──────────────────────────────────────
const typedEl = document.getElementById("typedText");
const phrases = [
  "CS Student",
  "Cybersecurity Enthusiast",
  "Web Developer",
  "Cloud Learner",
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const TYPING_SPEED = 100;
const DELETING_SPEED = 60;
const PAUSE_AFTER_PHRASE = 1800;
const PAUSE_BEFORE_TYPE = 400;

function type() {
  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typedEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
  } else {
    typedEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
  }

  let delay = isDeleting ? DELETING_SPEED : TYPING_SPEED;

  if (!isDeleting && charIndex === currentPhrase.length) {
    // Finished typing — pause then start deleting
    delay = PAUSE_AFTER_PHRASE;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    // Finished deleting — move to next phrase
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    delay = PAUSE_BEFORE_TYPE;
  }

  setTimeout(type, delay);
}

if (typedEl) {
  setTimeout(type, PAUSE_BEFORE_TYPE);
}

// ── Navbar: scroll shadow + active link ───────────────────
const navbar = document.getElementById("navbar");
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("section[id]");

function onScroll() {
  // Shadow on scroll
  if (window.scrollY > 20) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }

  // Active nav link based on current section
  let currentId = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 90;
    if (window.scrollY >= sectionTop) {
      currentId = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${currentId}`) {
      link.classList.add("active");
    }
  });

  // Back-to-top visibility
  backToTop.classList.toggle("visible", window.scrollY > 400);
}

window.addEventListener("scroll", onScroll, { passive: true });

// ── Mobile hamburger menu ──────────────────────────────────
const hamburger = document.getElementById("hamburger");
const navLinksContainer = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("open");
  navLinksContainer.classList.toggle("open", isOpen);
  hamburger.setAttribute("aria-expanded", isOpen);
});

// Close mobile menu when a link is clicked
navLinksContainer.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("open");
    navLinksContainer.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
  });
});

// ── Back to top button ─────────────────────────────────────
const backToTop = document.getElementById("backToTop");
backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ── Scroll reveal ──────────────────────────────────────────
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Apply reveal to key elements
const revealSelectors = [
  ".project-card",
  ".skill-category",
  ".timeline-item",
  ".about-grid > *",
  ".contact-grid > *",
  ".stat-card",
];
document.querySelectorAll(revealSelectors.join(",")).forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// ── Contact form validation ────────────────────────────────
const contactForm = document.getElementById("contactForm");
const formSuccess = document.getElementById("formSuccess");

function validateField(id, errorId, validator, message) {
  const input = document.getElementById(id);
  const errorEl = document.getElementById(errorId);
  if (!validator(input.value.trim())) {
    errorEl.textContent = message;
    input.classList.add("input-error");
    return false;
  }
  errorEl.textContent = "";
  input.classList.remove("input-error");
  return true;
}

function isNotEmpty(value) {
  return value.length > 0;
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const validName = validateField(
    "name",
    "nameError",
    isNotEmpty,
    "Please enter your name."
  );
  const validEmail = validateField(
    "email",
    "emailError",
    isValidEmail,
    "Please enter a valid email address."
  );
  const validSubject = validateField(
    "subject",
    "subjectError",
    isNotEmpty,
    "Please enter a subject."
  );
  const validMessage = validateField(
    "message",
    "messageError",
    (v) => v.length >= 10,
    "Message must be at least 10 characters."
  );

  if (validName && validEmail && validSubject && validMessage) {
    // In a real deployment this would POST to a backend or service like Formspree.
    // For now, show a success message and reset the form.
    contactForm.reset();
    formSuccess.classList.add("visible");
    setTimeout(() => formSuccess.classList.remove("visible"), 5000);
  }
});

// Clear individual field errors on input
["name", "email", "subject", "message"].forEach((id) => {
  const input = document.getElementById(id);
  input.addEventListener("input", () => {
    input.classList.remove("input-error");
    const errorEl = document.getElementById(`${id}Error`);
    if (errorEl) errorEl.textContent = "";
  });
});
