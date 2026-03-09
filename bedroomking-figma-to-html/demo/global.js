// Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenuClose = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');

  function openMobileMenu() {
    mobileMenu.classList.remove("translate-x-full");
    mobileMenu.classList.add("translate-x-0");

    mobileMenuOverlay.classList.remove("opacity-0", "pointer-events-none");
    mobileMenuOverlay.classList.add("opacity-100", "pointer-events-auto");
    
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove("translate-x-0");
    mobileMenu.classList.add("translate-x-full");

    mobileMenuOverlay.classList.remove("opacity-100", "pointer-events-auto");
    mobileMenuOverlay.classList.add("opacity-0", "pointer-events-none");
    
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
  }

  if (mobileMenuOverlay) {
    mobileMenuOverlay.addEventListener('click', closeMobileMenu);
  }

  // Close menu on nav link click
  const mobileNavLinks = mobileMenu?.querySelectorAll('a');
  mobileNavLinks?.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close menu on escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });