// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById("mobile-menu-btn");
const mobileMenuClose = document.getElementById("mobile-menu-close");
const mobileMenu = document.getElementById("mobile-menu");
const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

function openMobileMenu() {
  mobileMenu.classList.remove("translate-x-full");
  mobileMenu.classList.add("translate-x-0");

  mobileMenuOverlay.classList.remove("opacity-0", "pointer-events-none");
  mobileMenuOverlay.classList.add("opacity-100", "pointer-events-auto");

  document.body.style.overflow = "hidden";
}

function closeMobileMenu() {
  mobileMenu.classList.remove("translate-x-0");
  mobileMenu.classList.add("translate-x-full");

  mobileMenuOverlay.classList.remove("opacity-100", "pointer-events-auto");
  mobileMenuOverlay.classList.add("opacity-0", "pointer-events-none");

  document.body.style.overflow = "";
}

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", openMobileMenu);
}

if (mobileMenuClose) {
  mobileMenuClose.addEventListener("click", closeMobileMenu);
}

if (mobileMenuOverlay) {
  mobileMenuOverlay.addEventListener("click", closeMobileMenu);
}

// Close menu on nav link click
const mobileNavLinks = mobileMenu?.querySelectorAll("a");
mobileNavLinks?.forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Search Dropdown Logic
const searchModalOverlay = document.getElementById("search-modal-overlay");

window.activeSearchDropdown = null;

function hideActiveSearchDropdown() {
  if (!window.activeSearchDropdown) return;
  const { dropdown, container, clearBtn } = window.activeSearchDropdown;

  searchModalOverlay?.classList.remove("opacity-100", "pointer-events-auto");
  searchModalOverlay?.classList.add("opacity-0", "pointer-events-none");

  dropdown?.classList.remove(
    "opacity-100",
    "translate-y-0",
    "pointer-events-auto",
  );
  dropdown?.classList.add("opacity-0", "translate-y-2", "pointer-events-none");

  setTimeout(() => {
    dropdown?.classList.add("hidden");
  }, 300);

  container?.classList.remove("border-brand-primary");
  container?.classList.add("border-gray-800");

  clearBtn?.classList.remove("opacity-100", "pointer-events-auto");
  clearBtn?.classList.add("opacity-0", "pointer-events-none");

  document.body.style.overflow = "";
  window.activeSearchDropdown = null;
}

function setupSearchDropdown(inputId, dropdownId, containerId, clearId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  const container = document.getElementById(containerId);
  const clearBtn = document.getElementById(clearId);

  if (!input || !dropdown || !container) return;

  function showDropdown() {
    searchModalOverlay?.classList.remove("opacity-0", "pointer-events-none");
    searchModalOverlay?.classList.add("opacity-100", "pointer-events-auto");

    dropdown.classList.remove("hidden");
    setTimeout(() => {
      dropdown.classList.remove(
        "opacity-0",
        "translate-y-2",
        "pointer-events-none",
      );
      dropdown.classList.add(
        "opacity-100",
        "translate-y-0",
        "pointer-events-auto",
      );
    }, 10);

    container.classList.add("border-brand-primary");
    container.classList.remove("border-gray-800");
    document.body.style.overflow = "hidden";

    window.activeSearchDropdown = { input, dropdown, container, clearBtn };
  }

  input.addEventListener("input", (e) => {
    if (e.target.value.trim().length > 0) {
      showDropdown();
      clearBtn?.classList.remove("opacity-0", "pointer-events-none");
      clearBtn?.classList.add("opacity-100", "pointer-events-auto");
    } else {
      hideActiveSearchDropdown();
    }
  });

  clearBtn?.addEventListener("click", () => {
    input.value = "";
    input.focus();
    hideActiveSearchDropdown();
  });
}

setupSearchDropdown(
  "desktop-search-input",
  "desktop-search-dropdown",
  "desktop-search-container",
  "desktop-search-clear",
);
setupSearchDropdown(
  "mobile-search-input",
  "mobile-search-dropdown",
  "mobile-search-container",
  "mobile-search-clear",
);

// Close search dropdown when clicking outside the content
searchModalOverlay?.addEventListener("click", (e) => {
  if (e.target === searchModalOverlay) {
    hideActiveSearchDropdown();
  }
});

// Close menu on escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMobileMenu();
    hideActiveSearchDropdown();
  }
});