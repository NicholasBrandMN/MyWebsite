// Initialize AOS (Animate On Scroll)
AOS.init({
  duration: 1000,
  once: true,
});

// Initialize Typed.js
document.addEventListener("DOMContentLoaded", function() {
  const typedElement = document.querySelector(".typed");
  if (typedElement) {
    new Typed(".typed", {
      strings: typedElement.getAttribute("data-typed-items").split(","),
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000,
      loop: true,
    });
  }

  // Initialize all functionality after DOM is loaded
  initDarkModeToggle();
  initScrollToTop();
  initNavbarToggle();
  initTestimonials();
  initSmoothScrolling();
  initMobileNavbar();
});

// DARK MODE TOGGLE
function initDarkModeToggle() {
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const toggleIcon = document.getElementById('toggle-icon');
  const body = document.body;

  if (!darkModeToggle || !toggleIcon) return;

  // Check for stored dark mode preference
  if (localStorage.getItem("dark-mode") === "enabled") {
    body.classList.add("dark-mode");
    toggleIcon.classList.remove("fa-moon");
    toggleIcon.classList.add("fa-sun");
  }

  darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    if (body.classList.contains('dark-mode')) {
      localStorage.setItem("dark-mode", "enabled");
      toggleIcon.classList.remove('fa-moon');
      toggleIcon.classList.add('fa-sun');
    } else {
      localStorage.setItem("dark-mode", "disabled");
      toggleIcon.classList.remove('fa-sun');
      toggleIcon.classList.add('fa-moon');
    }
  });
}

// SCROLL-TO-TOP BUTTON
function initScrollToTop() {
  const scrollToTopButton = document.getElementById('scroll-to-top');

  if (!scrollToTopButton) return;

  window.addEventListener('scroll', () => {
    const halfPageHeight = document.documentElement.scrollHeight / 2;

    if (window.scrollY > halfPageHeight) {
      scrollToTopButton.classList.add('show');
    } else {
      scrollToTopButton.classList.remove('show');
    }
  });

  scrollToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// NAVBAR TOGGLE
function initNavbarToggle() {
  const navbarToggle = document.getElementById('navbar-toggle');
  const replacementToggle = document.getElementById('replacement-toggle');
  const navbar = document.querySelector('.navbar');
  const mainContent = document.getElementById('main-content');

  if (!navbarToggle || !replacementToggle || !navbar || !mainContent) return;

  navbarToggle.addEventListener('click', () => {
    navbar.classList.toggle('hidden');
    mainContent.classList.toggle('navbar-hidden');
    replacementToggle.classList.toggle('visible');
  });

  replacementToggle.addEventListener('click', () => {
    navbar.classList.toggle('hidden');
    mainContent.classList.toggle('navbar-hidden');
    replacementToggle.classList.toggle('visible');
  });
}

// TESTIMONIALS CAROUSEL
function initTestimonials() {
  // Check if Swiper is available
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper not loaded');
    return;
  }

  const testimonialCarousel = document.querySelector('.testimonial-carousel');
  if (!testimonialCarousel) return;

  var swiper = new Swiper('.testimonial-carousel', {
    slidesPerView: 3,
    spaceBetween: 40,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    // UPDATED NAVIGATION SELECTORS FOR CUSTOM ARROWS
    navigation: {
      nextEl: '.custom-swiper-next',
      prevEl: '.custom-swiper-prev'
    },
    breakpoints: {
      1024: { slidesPerView: 3 },
      768: { slidesPerView: 2 },
      320: { slidesPerView: 1 }
    }
  });

  const toggleButton = document.getElementById('toggleAutoplay');
  if (toggleButton) {
    let isPlaying = true;

    toggleButton.addEventListener('click', () => {
      if (isPlaying) {
        swiper.autoplay.stop();
        toggleButton.innerHTML = '<i class="fas fa-play"></i>';
      } else {
        swiper.autoplay.start();
        toggleButton.innerHTML = '<i class="fas fa-pause"></i>';
      }
      isPlaying = !isPlaying;
    });
  }
}

// SMOOTH SCROLLING
function initSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId.startsWith('#')) return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    });
  });
}

// MOBILE NAVBAR
function initMobileNavbar() {
  function setupMobileNavbar() {
    if (window.innerWidth <= 768) {
      const navbar = document.getElementById('navbar');
      const navLinks = document.querySelector('.nav-links');
      
      // Toggle mobile navbar when clicking on profile picture
      const profilePicture = document.querySelector('.profile-picture');
      if (profilePicture && navbar) {
        profilePicture.addEventListener('click', () => {
          navbar.classList.toggle('expanded');
        });
      }
    }
  }

  window.addEventListener('load', setupMobileNavbar);
  window.addEventListener('resize', setupMobileNavbar);
}

// RIPPLE EFFECT FOR BUTTONS
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('button, .visit-button, .nav-links a').forEach(button => {
    button.addEventListener('click', function(e) {
      // Add a small ripple effect for better UX
      const ripple = document.createElement('span');
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.7);
        transform: scale(0);
        animation: ripple 0.6s linear;
        width: ${size}px;
        height: ${size}px;
        top: ${y}px;
        left: ${x}px;
        pointer-events: none;
      `;
      
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// ACTIVE NAV LINK ON SCROLL
window.addEventListener('scroll', () => {
  const sections = document.querySelectorAll('.section');
  const navLinks = document.querySelectorAll('.nav-links a');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});