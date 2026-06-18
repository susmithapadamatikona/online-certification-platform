document.addEventListener("DOMContentLoaded", () => {
  const user = getSessionUser();
  if (!user) {
    window.location.href = "login.html";
    return;
  }

  const emailEls = document.querySelectorAll("[data-user-email]");
  emailEls.forEach((el) => {
    el.textContent = user.email;
  });

  const fullNameEls = document.querySelectorAll("[data-user-name]");
  fullNameEls.forEach((el) => {
    el.textContent = user.fullName;
  });

  const roleEls = document.querySelectorAll("[data-user-role]");
  roleEls.forEach((el) => {
    el.textContent = user.role;
  });

  const phoneEls = document.querySelectorAll("[data-user-phone]");
  phoneEls.forEach((el) => {
    el.textContent = user.phone;
  });

  const avatarEls = document.querySelectorAll("[data-user-avatar]");
  avatarEls.forEach((el) => {
    el.textContent = user.fullName
      .split(" ")
      .map((part) => part[0] || "")
      .join("")
      .slice(0, 2)
      .toUpperCase();
  });

  const logoutButtons = document.querySelectorAll("[data-logout]");
  logoutButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      event.preventDefault();
      clearSession();
      const loader = document.querySelector("[data-page-loader]");
      if (loader) {
        loader.classList.add("is-visible");
      }
      window.setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    });
  });

  const dashboardTabs = document.querySelectorAll("[data-dashboard-tab]");
  const dashboardSections = document.querySelectorAll("[data-dashboard-section]");
  const showDashboardSection = (sectionName) => {
    const hasSection = Array.from(dashboardSections).some(
      (section) => section.dataset.dashboardSection === sectionName
    );
    const activeSection = hasSection ? sectionName : "dashboard";

    dashboardTabs.forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.dashboardTab === activeSection);
    });

    dashboardSections.forEach((section) => {
      section.classList.toggle("active", section.dataset.dashboardSection === activeSection);
    });
  };

  dashboardTabs.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionName = tab.dataset.dashboardTab;
      showDashboardSection(sectionName);
      window.history.replaceState(null, "", `#${sectionName}`);
    });
  });

  showDashboardSection(window.location.hash.replace("#", "") || "dashboard");

  const sidebar = document.querySelector("[data-sidebar]");
  const backdrop = document.querySelector("[data-sidebar-backdrop]");
  const sidebarToggle = document.querySelector("[data-sidebar-toggle]");
  const sidebarClose = document.querySelector("[data-sidebar-close]");
  if (sidebar && backdrop && sidebarToggle) {
    const syncSidebarState = () => {
      const isOpen = sidebar.classList.contains("open");
      sidebarToggle.classList.toggle("is-open", isOpen);
      sidebarToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      sidebarToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
      backdrop.classList.toggle("open", isOpen);
      document.body.classList.toggle("sidebar-open", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    };

    const toggleSidebar = () => {
      sidebar.classList.toggle("open");
      syncSidebarState();
    };

    sidebarToggle.addEventListener("click", toggleSidebar);
    if (sidebarClose) {
      sidebarClose.addEventListener("click", () => {
        sidebar.classList.remove("open");
        syncSidebarState();
      });
    }
    backdrop.addEventListener("click", () => {
      sidebar.classList.remove("open");
      syncSidebarState();
    });
    sidebar.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        sidebar.classList.remove("open");
        syncSidebarState();
      });
    });

    window.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        syncSidebarState();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900 && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
        syncSidebarState();
      }
    });

    syncSidebarState();
  }
});
