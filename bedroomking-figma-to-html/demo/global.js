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

function setupSearchDropdown(inputId, dropdownId, containerId, clearId, micId) {
  const input = document.getElementById(inputId);
  const dropdown = document.getElementById(dropdownId);
  const container = document.getElementById(containerId);
  const clearBtn = document.getElementById(clearId);
  const micBtn = document.getElementById(micId);

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

  // Voice Search Logic (Web Speech API)
  if (micBtn) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = "en-US";

      micBtn.addEventListener("click", () => {
        micBtn.classList.add("text-brand-green", "animate-pulse");
        const img = micBtn.querySelector("img");
        if (img) img.src = "/assets/icons/mic-active.svg";
        recognition.start();
      });

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      };

      recognition.onspeechend = () => {
        recognition.stop();
        micBtn.classList.remove("text-brand-green", "animate-pulse");
        const img = micBtn.querySelector("img");
        if (img) img.src = "/assets/icons/mic.svg";
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        micBtn.classList.remove("text-brand-green", "animate-pulse");
        const img = micBtn.querySelector("img");
        if (img) img.src = "/assets/icons/mic.svg";
      };
    } else {
      micBtn.style.display = "none";
      console.warn("Speech Recognition API is not supported in this browser.");
    }
  }
}

setupSearchDropdown(
  "desktop-search-input",
  "desktop-search-dropdown",
  "desktop-search-container",
  "desktop-search-clear",
  "desktop-search-mic",
);
setupSearchDropdown(
  "mobile-search-input",
  "mobile-search-dropdown",
  "mobile-search-container",
  "mobile-search-clear",
  "mobile-search-mic",
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

// ============================================================
// COLLECTION GRID & FILTER SIDEBAR GLOBALS
// ============================================================

window.setView = function(view) {
  const grid = document.getElementById('product-grid');
  const btnGrid = document.getElementById('btn-grid-view');
  const btnList = document.getElementById('btn-list-view');

  if (!grid || !btnGrid || !btnList) return;
  
  const imgGrid = btnGrid.querySelector('img');
  const imgList = btnList.querySelector('img');

  if (view === 'list') {
    grid.classList.add('list-view-active');
    
    // Update button styles for list view
    btnList.classList.remove('text-gray-500', 'bg-transparent');
    btnList.classList.add('bg-collection-green', 'text-white', 'shadow-sm');
    btnGrid.classList.remove('bg-collection-green', 'text-white', 'shadow-sm');
    btnGrid.classList.add('text-gray-500', 'bg-transparent');
    
    // Make active icon white
    if (imgList) imgList.classList.add('brightness-0', 'invert');
    if (imgGrid) imgGrid.classList.remove('brightness-0', 'invert');
  } else {
    grid.classList.remove('list-view-active');
    
    // Update button styles for grid view
    btnGrid.classList.remove('text-gray-500', 'bg-transparent');
    btnGrid.classList.add('bg-collection-green', 'text-white', 'shadow-sm');
    btnList.classList.remove('bg-collection-green', 'text-white', 'shadow-sm');
    btnList.classList.add('text-gray-500', 'bg-transparent');
    
    // Make active icon white
    if (imgGrid) imgGrid.classList.add('brightness-0', 'invert');
    if (imgList) imgList.classList.remove('brightness-0', 'invert');
  }
};

window.resetFilters = function() {
  const sidebar = document.querySelector('#filter-accordion');
  if (!sidebar) return;

  // Reset checkboxes and radios
  sidebar.querySelectorAll('input').forEach(input => {
    if (input.type === 'checkbox' || input.type === 'radio') {
      input.checked = false;
    }
    if (input.type === 'number') {
      input.value = '';
    }
  });

  // Close all accordions except the first two (standard behavior)
  sidebar.querySelectorAll('details').forEach((details, index) => {
    if (index > 1) {
      details.removeAttribute('open');
    } else {
      details.setAttribute('open', '');
    }
  });

  console.log('Filters reset');
};