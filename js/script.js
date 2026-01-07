// Full script without Lenis: menu toggle, typewriter, WhatsApp, FAQ accordion,
// mailto handlers, and a non-blocking fallback smooth-scroll implementation.
//
// This version does NOT use Lenis or any external smooth-scroll library,
// so it won't block the browser's native scrolling.

document.addEventListener("DOMContentLoaded", function () {
  /* =========================
     Mobile menu toggle
     ========================= */
  const menuIcon = document.getElementById("menu-icon");
  const navbar = document.getElementById("navbar");
  if (menuIcon && navbar) {
    menuIcon.addEventListener("click", function (e) {
      e.stopPropagation();
      navbar.classList.toggle("active");
    });
    document.addEventListener("click", function (e) {
      if (!menuIcon.contains(e.target) && !navbar.contains(e.target)) {
        navbar.classList.remove("active");
      }
    });
  }

  /* =========================
     Typewriter effect
     ========================= */
  class TypeWriter {
    constructor(element, words = [], typeSpeed = 80, deleteSpeed = 40, pause = 1500) {
      this.el = element;
      this.words = words;
      this.typeSpeed = typeSpeed;
      this.deleteSpeed = deleteSpeed;
      this.pause = pause;
      this.txt = "";
      this.wordIndex = 0;
      this.isDeleting = false;
      this.el.classList.add("typing");
      this.type();
    }

    type() {
      const current = this.wordIndex % this.words.length;
      const fullTxt = this.words[current];

      if (this.isDeleting) {
        this.txt = fullTxt.substring(0, this.txt.length - 1);
      } else {
        this.txt = fullTxt.substring(0, this.txt.length + 1);
      }

      this.el.textContent = this.txt;

      let timeout = this.isDeleting ? this.deleteSpeed : this.typeSpeed;

      if (!this.isDeleting && this.txt === fullTxt) {
        timeout = this.pause;
        this.isDeleting = true;
      } else if (this.isDeleting && this.txt === "") {
        this.isDeleting = false;
        this.wordIndex++;
        timeout = 400;
      }

      setTimeout(() => this.type(), timeout);
    }
  }

  const dynamicEl = document.querySelector(".dynamic-text");
  if (dynamicEl) {
    const words = [
      "Frontend Designer",
      "Web Designer",
      "UI / UX Designer",
      "Web Developer",
      "Logo Designer",
      "Banner Designer",
      "Rapper"
    ];
    new TypeWriter(dynamicEl, words, 80, 40, 1600);
  }

  /* =========================
     WhatsApp link builder (data-phone)
     ========================= */
  const wa = document.getElementById("whatsapp-chat");
  if (wa) {
    const dataPhone = wa.getAttribute("data-phone");
    const dataText = wa.getAttribute("data-text") || "Hello! I want to talk about a project.";
    if (dataPhone && dataPhone.trim() !== "") {
      const encoded = encodeURIComponent(dataText);
      wa.href = `https://wa.me/${dataPhone}?text=${encoded}`;
    } else {
      console.warn("WhatsApp button has no data-phone. Add data-phone=\"923...\"");
    }
  }

  /* =========================
     FAQ accordion
     ========================= */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    btn.addEventListener("click", () => {
      const isOpen = item.classList.contains("open");

      // Close all items (single-open behaviour)
      faqItems.forEach(i => {
        i.classList.remove("open");
        const q = i.querySelector(".faq-question");
        if (q) q.setAttribute("aria-expanded", "false");
        const a = i.querySelector(".faq-answer");
        if (a) a.hidden = true;
      });

      // Toggle this item
      if (!isOpen) {
        item.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
        if (answer) answer.hidden = false;
      }
    });

    // keyboard support: toggle on Enter/Space
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
  });

  /* =========================
     Mailto handlers (Contact & Hire)
     ========================= */
  // Replace this with your Gmail address:
  const recipientEmail = "your.email@gmail.com"; // <<--- UPDATE this

  function capitalizeLabel(label) {
    return label
      .replace(/_/g, " ")
      .replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
  }

  function buildMailtoFromForm(form, subjectPrefix) {
    const formData = new FormData(form);
    const subjectField = formData.get("subject") || formData.get("project_details") || "";
    const subject = subjectPrefix + (subjectField ? " - " + subjectField : "");
    let body = "";
    for (const [key, value] of formData.entries()) {
      body += `${capitalizeLabel(key)}: ${value || "-"}\n`;
    }
    return `mailto:${recipientEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]')?.value?.trim();
      const email = contactForm.querySelector('[name="email"]')?.value?.trim();
      if (!name || !email) {
        alert("Please provide your name and email.");
        return;
      }
      const mailto = buildMailtoFromForm(contactForm, "Contact from website");
      window.location.href = mailto;
    });
  }

  const hireForm = document.getElementById("hire-form");
  if (hireForm) {
    hireForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const clientName = hireForm.querySelector('[name="client_name"]')?.value?.trim();
      const clientEmail = hireForm.querySelector('[name="client_email"]')?.value?.trim();
      if (!clientName || !clientEmail) {
        alert("Please provide your name and email.");
        return;
      }
      const mailto = buildMailtoFromForm(hireForm, "Hire inquiry");
      window.location.href = mailto;
    });
  }

  /* =========================
     Smooth scroll fallback (non-blocking)
     ========================= */

  // This fallback attaches to anchor links and animates via requestAnimationFrame.
  // It never disables native scrolling; it only intercepts clicks on anchors.
  (function initFallbackSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]:not([href="#"])');

    // Ease function
    const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    function smoothScrollTo(targetY, duration = 700) {
      const startY = window.scrollY || window.pageYOffset;
      const diff = targetY - startY;
      let startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        const elapsed = timestamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeInOutCubic(progress);
        window.scrollTo(0, startY + diff * eased);
        if (elapsed < duration) {
          requestAnimationFrame(step);
        }
      }
      requestAnimationFrame(step);
    }

    anchors.forEach(a => {
      a.addEventListener("click", function (e) {
        const href = this.getAttribute("href");
        if (!href || href === "#") return;
        const targetEl = document.querySelector(href);
        if (targetEl) {
          e.preventDefault();
          const rect = targetEl.getBoundingClientRect();
          const headerOffset = 72; // adjust if header height changes
          const targetY = rect.top + window.pageYOffset - headerOffset;
          smoothScrollTo(targetY, 800);
        }
      });
    });

    console.log("Fallback smooth scroll initialized (non-blocking).");
  })();

  /* =========================
     End of DOMContentLoaded
     ========================= */
});
// Site loader controller
// Place this script near the top of your main JS (or as a separate file included before other heavy scripts).
// It needs the HTML element with id="site-loader" you already added.
// It will:
//  - keep loader visible at least MIN_SHOW_MS
//  - hide on window.load (or after MAX_WAIT_MS fallback)
//  - add body overflow:hidden while loader is visible to prevent scroll
//  - add the CSS class "fade-out" to trigger your CSS transition, then remove the node
//  - respect prefers-reduced-motion (minimize animations if requested)

(function () {
  const LOADER_ID = "site-loader";
  const MIN_SHOW_MS = 600;    // minimum time to show loader (ms)
  const MAX_WAIT_MS = 10000;  // fallback hide after this many ms if load doesn't fire

  const loader = document.getElementById(LOADER_ID);
  if (!loader) return;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = Date.now();

  // lock scroll while loader is visible
  const prevBodyOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  // mark loader visible for screen readers
  loader.setAttribute("aria-hidden", "false");

  let hidden = false;
  function doHide() {
    if (hidden) return;
    hidden = true;

    // restore scrolling
    document.body.style.overflow = prevBodyOverflow || "";

    // mark for assistive tech
    loader.setAttribute("aria-hidden", "true");

    // If user prefers reduced motion, remove immediately without transition
    if (prefersReduced) {
      if (loader.parentNode) loader.parentNode.removeChild(loader);
      return;
    }

    // add class that triggers CSS fade (your CSS uses .fade-out)
    loader.classList.add("fade-out");

    // remove element after transition completes (or force remove after 800ms)
    const cleanup = () => {
      if (loader && loader.parentNode) loader.parentNode.removeChild(loader);
    };

    // Listen for transitionend; otherwise fallback removal
    const onTransitionEnd = (e) => {
      // ensure it's the opacity/visibility transition
      if (e.target === loader) {
        cleanup();
        loader.removeEventListener("transitionend", onTransitionEnd);
      }
    };
    loader.addEventListener("transitionend", onTransitionEnd);

    // safety fallback
    setTimeout(() => {
      if (document.getElementById(LOADER_ID)) cleanup();
    }, 900);
  }

  // Public hook: allow manual hide from other scripts
  window.hideSiteLoader = doHide;

  // Hide when the page finishes loading
  function onLoadHide() {
    const elapsed = Date.now() - start;
    const wait = Math.max(0, MIN_SHOW_MS - elapsed);
    setTimeout(doHide, wait);
  }
  window.addEventListener("load", onLoadHide, { once: true });

  // Fallback: ensure loader doesn't block forever
  setTimeout(() => {
    if (!hidden) doHide();
  }, MAX_WAIT_MS);

  // If DOM was already loaded and load event already fired, try to hide quickly
  if (document.readyState === "complete") {
    onLoadHide();
  }
})();