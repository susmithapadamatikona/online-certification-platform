document.addEventListener("DOMContentLoaded", () => {
  setupPageLoader();

  const year = document.querySelector("[data-year]");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }

  const goBackButton = document.querySelector("[data-go-back]");
  if (goBackButton) {
    goBackButton.addEventListener("click", () => {
      if (window.history.length > 1) {
        window.history.back();
        return;
      }

      window.location.href = "index.html";
    });
  }

  const activePath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    const linkPath = link.getAttribute("href");
    if (linkPath === activePath) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });

  const hamburger = document.querySelector("[data-hamburger]");
  const navPanel = document.querySelector("[data-nav-panel]");
  if (hamburger && navPanel) {
    const syncHamburgerState = () => {
      const isOpen = navPanel.classList.contains("open");
      hamburger.classList.toggle("is-open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
      hamburger.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    };

    hamburger.addEventListener("click", () => {
      navPanel.classList.toggle("open");
      syncHamburgerState();
    });

    navPanel.querySelectorAll("a, button").forEach((item) => {
      item.addEventListener("click", () => {
        navPanel.classList.remove("open");
        syncHamburgerState();
      });
    });

    syncHamburgerState();
  }

  const contactForm = document.querySelector("[data-contact-form]");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = contactForm.querySelector("[data-form-status]");
      status.className = "alert success";
      status.textContent = "Thanks! Your message has been sent successfully.";
      contactForm.reset();
    });
  }

  setupLiveCounters();

  document.querySelectorAll("[data-icon]").forEach((node) => {
    const icon = node.getAttribute("data-icon");
    if (icon) {
      node.innerHTML = renderIcon(icon);
    }
  });

  document.querySelectorAll("[data-password-toggle]").forEach((button) => {
    const targetId = button.getAttribute("data-password-toggle");
    const input = targetId ? document.getElementById(targetId) : null;
    if (!input) {
      return;
    }

    const syncToggleState = () => {
      const isVisible = input.type === "text";
      button.setAttribute("aria-pressed", isVisible ? "true" : "false");
      button.setAttribute("aria-label", isVisible ? "Hide password" : "Show password");
      const iconNode = button.querySelector("[data-icon]");
      if (iconNode) {
        const iconType = isVisible ? "eyeOff" : "eye";
        iconNode.setAttribute("data-icon", iconType);
        iconNode.innerHTML = renderIcon(iconType);
      }
    };

    button.addEventListener("click", () => {
      input.type = input.type === "password" ? "text" : "password";
      syncToggleState();
      input.focus({ preventScroll: true });
    });

    syncToggleState();
  });

  document.querySelectorAll("[data-role-picker]").forEach((picker) => {
    const trigger = picker.querySelector("[data-role-trigger]");
    const hiddenInput = picker.querySelector("[name='role']");
    const label = picker.querySelector("[data-role-label]");
    const options = Array.from(picker.querySelectorAll("[data-role-option]"));
    if (!trigger || !hiddenInput || !label || !options.length) {
      return;
    }

    const closePicker = () => {
      picker.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
    };

    const openPicker = () => {
      picker.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
    };

    const setRole = (value) => {
      hiddenInput.value = value;
      label.textContent = value || "Choose role";
      hiddenInput.dispatchEvent(new Event("input", { bubbles: true }));
      hiddenInput.dispatchEvent(new Event("change", { bubbles: true }));
    };

    trigger.addEventListener("click", () => {
      if (picker.classList.contains("is-open")) {
        closePicker();
      } else {
        openPicker();
      }
    });

    options.forEach((option) => {
      option.addEventListener("click", () => {
        setRole(option.getAttribute("data-role-option") || "");
        closePicker();
        trigger.focus({ preventScroll: true });
      });
    });

    document.addEventListener("click", (event) => {
      if (!picker.contains(event.target)) {
        closePicker();
      }
    });

    picker.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closePicker();
        trigger.focus({ preventScroll: true });
      }
    });

    setRole(hiddenInput.value.trim());
  });

  setupAosAnimations();
});

function iconSvg(type) {
  const icons = {
    search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
    bell: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 17H5l1.5-1.5V11a5.5 5.5 0 0 1 11 0v4.5L19 17h-4"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/><path d="M13 5l7 7-7 7"/></svg>',
    shield: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z"/></svg>',
    book: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5z"/><path d="M5 4.5A2.5 2.5 0 0 1 7.5 2H19v17H7.5A2.5 2.5 0 0 0 5 21.5z"/></svg>',
    users: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    cap: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l10 5-10 5L2 8l10-5z"/><path d="M6 10v5c0 1.9 2.7 4 6 4s6-2.1 6-4v-5"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="m12 2.5 3.09 6.27 6.91 1-5 4.87 1.18 6.88L12 18.9 5.82 21.52 7 14.64 2 9.77l6.91-1z"/></svg>',
    clock: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    home: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 11l9-8 9 8"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
    info: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 10v7"/><path d="M12 7h.01"/></svg>',
    courses: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16v12H4z"/><path d="M8 6V4h8v2"/><path d="M8 10h8"/><path d="M8 14h5"/></svg>',
    services: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h16"/><circle cx="8" cy="7" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="16" cy="17" r="1"/></svg>',
    certificate: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3h12v14H6z"/><path d="M9 17l-1 4 4-2 4 2-1-4"/><path d="M9 7h6"/><path d="M9 11h6"/></svg>',
    teacher: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>',
    contact: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16v16H4z"/><path d="m4 6 8 6 8-6"/></svg>',
    mail: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>',
    eye: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
    eyeOff: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3l18 18"/><path d="M10.6 10.6A3 3 0 0 0 12 15a3 3 0 0 0 2.4-1.2"/><path d="M6.2 6.2C4 7.8 2.7 10 2 12c.7 2 4.2 7 10 7 1.6 0 3.1-.3 4.4-.8"/><path d="M9.9 4.2C10.6 4.1 11.3 4 12 4c5.8 0 9.3 5 10 8-.3 1-1 2.3-2 3.6"/></svg>',
    phone: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 4h4l2 5-3 2c1.5 3 3.5 5 6 6l2-3 5 2v4c0 1.1-.9 2-2 2C10.6 22 2 13.4 2 3c0-1.1.9-2 2-2z"/></svg>',
    location: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s6-5.7 6-11a6 6 0 1 0-12 0c0 5.3 6 11 6 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9c0-.9.2-1.5 1.6-1.5h1.7V5a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.1v8z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M6.5 6.5A2 2 0 1 1 6.5 2.5a2 2 0 0 1 0 4zM4.5 21h4V8h-4zm6.5 0h4v-6.7c0-1.6.3-3.2 2.3-3.2s2 1.9 2 3.3V21h4v-7.5c0-3.7-.8-6.5-5-6.5-2 0-3.3 1.1-3.8 2.1h-.1V8h-3.9z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm5 5.2A4.8 4.8 0 1 0 16.8 12 4.8 4.8 0 0 0 12 7.2zm6.1-1.3a1.1 1.1 0 1 0 1.1 1.1 1.1 1.1 0 0 0-1.1-1.1z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M21.8 8.2a3 3 0 0 0-2.1-2.1C18 5.7 12 5.7 12 5.7s-6 0-7.7.4A3 3 0 0 0 2.2 8.2 31 31 0 0 0 2 12a31 31 0 0 0 .2 3.8 3 3 0 0 0 2.1 2.1c1.7.4 7.7.4 7.7.4s6 0 7.7-.4a3 3 0 0 0 2.1-2.1A31 31 0 0 0 22 12a31 31 0 0 0-.2-3.8zM10 15V9l5 3z"/></svg>',
    x: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.8 2H22l-7.2 8.2L23 22h-6.8l-5.3-6.8L4.8 22H2l7.8-8.9L1 2h6.9l4.8 6.2z"/></svg>',
    data: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v6c0 1.7 3.1 3 7 3s7-1.3 7-3V5"/><path d="M5 11v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6"/></svg>',
    design: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16"/><path d="M6 16l7.5-7.5a2.1 2.1 0 0 1 3 3L9 19H6z"/><path d="M13 6l5 5"/></svg>',
    marketing: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12h4l7-6v12l-7-6H3z"/><path d="M14 8a4 4 0 0 1 0 8"/><path d="M16 5a7 7 0 0 1 0 14"/></svg>',
    security: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 3l7 3v6c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/></svg>',
    brain: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 8a3 3 0 0 1 6 0v1a3 3 0 0 1 0 6v1a3 3 0 0 1-6 0v-1a3 3 0 0 1 0-6z"/><path d="M7 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2"/><path d="M17 8a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2"/></svg>',
    code: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="m8 9-4 3 4 3"/><path d="m16 9 4 3-4 3"/><path d="m14 5-4 14"/></svg>',
    resume: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 7h6M9 11h6M9 15h4"/></svg>',
    placement: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 14a4 4 0 1 0 4-4"/><path d="M12 2v4"/><path d="m4 6 3 3"/><path d="M20 6l-3 3"/><path d="M12 22v-4"/></svg>',
    internship: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 6V5a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v1"/><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 12h16"/></svg>',
    award: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M9 13l-2 9 5-3 5 3-2-9"/><path d="M12 6.5l1.2 2.4 2.7.4-1.9 1.8.4 2.7-2.4-1.3-2.4 1.3.4-2.7-1.9-1.8 2.7-.4z"/></svg>',
    progress: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19h16"/><path d="M6 15l3-3 3 2 6-7"/><path d="M15 7h3v3"/></svg>',
    profile: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 22a8 8 0 0 1 16 0"/></svg>',
    settings: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 0 1-1.4 3.4h-.1a1.7 1.7 0 0 0-1.7 1.1l-.1.2a2 2 0 0 1-3.8 0l-.1-.2a1.7 1.7 0 0 0-1.7-1.1h-.1a2 2 0 0 1-1.4-3.4l.1-.1A1.7 1.7 0 0 0 4.6 15l-.1-.2a2 2 0 0 1 0-1.6l.1-.2A1.7 1.7 0 0 0 4.6 11l-.1-.1a2 2 0 0 1 1.4-3.4h.1a1.7 1.7 0 0 0 1.7-1.1l.1-.2a2 2 0 0 1 3.8 0l.1.2A1.7 1.7 0 0 0 13.4 7h.1a2 2 0 0 1 1.4 3.4l-.1.1a1.7 1.7 0 0 0-.3 1.9z"/></svg>',
    logout: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 17l5-5-5-5"/><path d="M15 12H3"/><path d="M21 3v18"/></svg>',
  };
  return icons[type] || "";
}

function renderIcon(type) {
  return iconSvg(type);
}

function setupLiveCounters() {
  const counters = document.querySelectorAll("[data-count-to]");
  if (!counters.length) {
    return;
  }

  const observerOptions = { threshold: 0.35 };
  const startCounter = (node) => {
    if (node.dataset.countStarted === "true") {
      return;
    }

    node.dataset.countStarted = "true";

    const target = Number(node.dataset.countTo);
    const duration = Number(node.dataset.countDuration || 1400);
    const suffix = node.dataset.countSuffix || "";
    const prefix = node.dataset.countPrefix || "";
    const format = node.dataset.countFormat || "number";
    const minDigits = Number(node.dataset.countMinDigits || 0);

    if (!Number.isFinite(target)) {
      return;
    }

    const start = performance.now();
    const frame = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      node.textContent = `${prefix}${formatCounter(value, format, minDigits)}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(frame);
      }
    };

    requestAnimationFrame(frame);
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, observerOptions);

    counters.forEach((node) => observer.observe(node));
    return;
  }

  counters.forEach(startCounter);
}

function setupAosAnimations() {
  if (typeof AOS === "undefined") {
    return;
  }

  const rules = [
    ["main > section", "fade-up"],
    [".page-hero", "fade-down"],
    [".hero", "fade-up"],
    [".hero-copy", "fade-right"],
    [".hero-scene", "zoom-in"],
    [".section-header", "fade-up"],
    [".hero-feature-card", "fade-up"],
    [".card-grid > *", "zoom-in"],
    [".split-grid > *", "fade-up"],
    [".timeline-item", "fade-up"],
    [".contact-item", "fade-up"],
    [".dashboard-topbar", "fade-down"],
    [".sidebar", "fade-right"],
    [".dashboard-card", "fade-up"],
    [".dashboard-panel", "fade-up"],
    [".course-row", "fade-up"],
    [".sidebar-nav a", "fade-right"],
    [".auth-shell > *", "fade-right"],
    [".footer-grid > *", "fade-up"],
  ];
  const staggeredSelectors = new Set([
    ".card-grid > *",
    ".split-grid > *",
    ".footer-grid > *",
    ".auth-shell > *",
    ".sidebar-nav a",
  ]);

  rules.forEach(([selector, animation]) => {
    document.querySelectorAll(selector).forEach((node, index) => {
      if (!node.hasAttribute("data-aos")) {
        node.setAttribute("data-aos", animation);
      }

      if (!node.hasAttribute("data-aos-delay") && staggeredSelectors.has(selector)) {
        const delay = Math.min(index * 80, 320);
        if (delay > 0) {
          node.setAttribute("data-aos-delay", String(delay));
        }
      }
    });
  });

  AOS.init({
    duration: 750,
    easing: "ease-out-cubic",
    once: true,
    offset: 80,
  });
}

function setupPageLoader() {
  const loader = ensurePageLoader();

  document.addEventListener(
    "click",
    (event) => {
      const link = event.target.closest("a");
      if (!link) {
        return;
      }

      if (
        link.target ||
        link.hasAttribute("download") ||
        link.getAttribute("href") === "#" ||
        link.getAttribute("href")?.startsWith("mailto:") ||
        link.getAttribute("href")?.startsWith("tel:") ||
        link.getAttribute("href")?.startsWith("javascript:")
      ) {
        return;
      }

      const url = new URL(link.href, window.location.href);
      if (url.origin !== window.location.origin) {
        return;
      }

      if (url.pathname === window.location.pathname && url.hash) {
        return;
      }

      event.preventDefault();
      loader.classList.add("is-visible");
      window.setTimeout(() => {
        window.location.href = url.href;
      }, 1000);
    },
    true
  );

  window.addEventListener("pageshow", () => {
    loader.classList.remove("is-visible");
  });
}

function ensurePageLoader() {
  let loader = document.querySelector("[data-page-loader]");
  if (loader) {
    return loader;
  }

  loader = document.createElement("div");
  loader.className = "page-loader";
  loader.setAttribute("data-page-loader", "");
  loader.setAttribute("role", "status");
  loader.setAttribute("aria-live", "polite");
  loader.innerHTML = `
    <div class="page-loader-card">
      <img src="assets/Logo.webp" alt="Stackly" class="page-loader-logo" />
      <div class="page-loader-spinner" aria-hidden="true"></div>
      <p>Loading Stackly</p>
    </div>
  `;
  document.body.appendChild(loader);
  return loader;
}

function formatCounter(value, format, minDigits) {
  if (format === "compact") {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}K`;
    }
  }

  const raw = String(value);
  if (minDigits > 0) {
    return raw.padStart(minDigits, "0");
  }
  return raw;
}
