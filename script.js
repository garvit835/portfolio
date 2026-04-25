document.addEventListener("DOMContentLoaded", () => {
  
  // === Page Loader ===
  const loader = document.getElementById("loader");
  if (loader) loader.style.display = "none";

  document.body.classList.add("loaded");

  const themeToggle = document.getElementById("theme-toggle");

  // On load, apply saved or preferred theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.setAttribute("data-theme", "light");
    themeToggle.textContent = "☀️";
  } else if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    themeToggle.textContent = "🌙";
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.body.setAttribute("data-theme", prefersDark ? "dark" : "light");
    themeToggle.textContent = prefersDark ? "🌙" : "☀️";
  }

  // === Theme Toggle ===
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.body.getAttribute("data-theme");
    if (currentTheme === "light") {
      document.body.setAttribute("data-theme", "dark");
      themeToggle.textContent = "🌙";
      localStorage.setItem("theme", "dark");
    } else {
      document.body.setAttribute("data-theme", "light");
      themeToggle.textContent = "☀️";
      localStorage.setItem("theme", "light");
    }
  });

  // === Custom Cursor ===
  // Only run this on devices that are not touch-based
  if (window.matchMedia("(pointer: fine)").matches) {
    const cursor = document.querySelector(".custom-cursor");
    if (cursor) {
      window.addEventListener("mousemove", (e) => {
        cursor.style.top = e.y + "px";
        cursor.style.left = e.x + "px";
      });

      document.addEventListener("mousedown", () => cursor.classList.add("click"));
      document.addEventListener("mouseup", () => cursor.classList.remove("click"));
    }
  }

  // === Hamburger Menu Logic ===
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.getElementById("nav-links-list");

  if (hamburger && navLinks) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navLinks.classList.toggle("active");
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navLinks.classList.remove("active");
      });
    });
  }

  // === Project Modal Logic ===
  const modalTriggers = document.querySelectorAll('.modal-trigger-btn');
  const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
  const overlay = document.getElementById('modal-overlay');

  // Function to open a modal
  function openModal(modal) {
    if (modal == null) return;
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  // Function to close a modal
  function closeModal(modal) {
    if (modal == null) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = 'auto'; // Allow background scrolling
  }

  // Helper function to find the currently active modal
  function getActiveModal() {
    return document.querySelector('.project-modal.active');
  }

  // Add click listeners to all modal trigger buttons
  modalTriggers.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetModal = document.querySelector(btn.dataset.modalTarget);
      openModal(targetModal);
    });
  });

  // Add click listeners to all modal "X" close buttons
  modalCloseBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const modal = btn.closest('.project-modal');
      closeModal(modal);
    });
  });

  // Add click listener to the overlay to close
  if (overlay) {
    overlay.addEventListener("click", () => {
      closeModal(getActiveModal());
    });
  }

  // Close modal on "Escape" key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal(getActiveModal());
    }
  });

}); // --- This is the closing brace for DOMContentLoaded ---