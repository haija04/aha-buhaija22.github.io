// ============================================================================
// PORTFOLIO INTERACTIVE FEATURES
// ============================================================================

// DOM Elements
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.nav-link');
const navToggle = document.getElementById('navToggle');
const navLinksContainer = document.querySelector('.nav-links');

// ============================================================================
// NAVIGATION FUNCTIONALITY
// ============================================================================

// Smooth scroll and active link update
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      // Close mobile menu if open
      if (navLinksContainer.classList.contains('active')) {
        navToggle.classList.remove('active');
        navLinksContainer.classList.remove('active');
      }
    }
  });
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinksContainer.classList.toggle('active');
});

// Close mobile menu when link is clicked
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navToggle.classList.remove('active');
    navLinksContainer.classList.remove('active');
  });
});

// Update active nav link on scroll
window.addEventListener('scroll', () => {
  let current = '';
  
  const sections = document.querySelectorAll('section');
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
  
  // Navbar background on scroll
  if (window.pageYOffset > 100) {
    navbar.style.background = 'rgba(10, 14, 39, 0.95)';
    navbar.style.backdropFilter = 'blur(10px)';
  } else {
    navbar.style.background = 'rgba(10, 14, 39, 0.7)';
    navbar.style.backdropFilter = 'blur(10px)';
  }
});

// ============================================================================
// INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
// ============================================================================

const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.animation = `slideInUp 0.8s ease forwards`;
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.about-card, .skill-item, .tech-card, .timeline-item, .contact-item').forEach(element => {
  observer.observe(element);
});

// ============================================================================
// PARALLAX EFFECT
// ============================================================================

window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero');
  if (hero) {
    const scrollPosition = window.pageYOffset;
    hero.style.backgroundPosition = `0% ${scrollPosition * 0.5}px`;
  }
});

// ============================================================================
// TECH CARD HOVER EFFECT
// ============================================================================

document.querySelectorAll('.tech-card').forEach(card => {
  card.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-8px) rotateX(5deg)';
  });
  
  card.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) rotateX(0deg)';
  });
});

// ============================================================================
// SKILL ITEM COUNTER ANIMATION
// ============================================================================

const animateSkillItems = () => {
  const skillItems = document.querySelectorAll('.skill-item');
  
  skillItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
      item.style.transition = 'all 0.6s ease';
      item.style.opacity = '1';
      item.style.transform = 'translateY(0)';
    }, index * 100);
  });
};

// Call animation when page loads
window.addEventListener('load', animateSkillItems);

// ============================================================================
// CONTACT LINK ANIMATION
// ============================================================================

document.querySelectorAll('.tech-link').forEach(link => {
  link.addEventListener('mouseenter', function() {
    this.style.transform = 'translateX(8px)';
  });
  
  link.addEventListener('mouseleave', function() {
    this.style.transform = 'translateX(0)';
  });
});

// ============================================================================
// PAGE LOAD ANIMATION
// ============================================================================

window.addEventListener('load', () => {
  document.body.style.opacity = '1';
  
  // Animate hero elements
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    heroTitle.style.animation = 'slideInLeft 0.8s ease 0.1s both';
  }
  
  const stats = document.querySelectorAll('.stat');
  stats.forEach((stat, index) => {
    stat.style.animation = `slideInUp 0.8s ease ${0.3 + index * 0.1}s both`;
  });
});

// ============================================================================
// SMOOTH PAGE TRANSITION
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 0);
});

// ============================================================================
// KEYBOARD NAVIGATION
// ============================================================================

document.addEventListener('keydown', (e) => {
  // Escape key closes mobile menu
  if (e.key === 'Escape') {
    navToggle.classList.remove('active');
    navLinksContainer.classList.remove('active');
  }
  
  // Number keys for quick nav (1-5)
  const sections = ['home', 'about', 'skills', 'vision', 'contact'];
  const key = parseInt(e.key);
  
  if (key >= 1 && key <= 5) {
    const sectionId = sections[key - 1];
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ============================================================================
// THEME PREFERENCES (Light/Dark)
// ============================================================================

const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;

if (prefersLight) {
  // Optional: Add light theme support in future
  console.log('Light theme preferred by system');
} else if (prefersDark) {
  // Dark theme is default
  console.log('Dark theme preferred by system');
}

// ============================================================================
// PERFORMANCE OPTIMIZATION - LAZY LOADING
// ============================================================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================================================
// SCROLL REVEAL ANIMATION
// ============================================================================

const revealElements = () => {
  const reveals = document.querySelectorAll('.about-card, .skill-item, .tech-card, .timeline-item');
  
  reveals.forEach(element => {
    const windowHeight = window.innerHeight;
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < windowHeight - elementVisible) {
      element.classList.add('active');
    }
  });
};

// Call on scroll
window.addEventListener('scroll', revealElements);
window.addEventListener('load', revealElements);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

// Get current scroll position
const getScrollPosition = () => {
  return window.pageYOffset || document.documentElement.scrollTop;
};

// Scroll to top function
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Check if element is in viewport
const isInViewport = (element) => {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
};

// ============================================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================================

// Add focus visible styles for keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.add('keyboard-nav');
  }
});

document.addEventListener('mousedown', () => {
  document.body.classList.remove('keyboard-nav');
});

// ============================================================================
// FORM VALIDATION (for contact section if needed)
// ============================================================================

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ============================================================================
// ANALYTICS & LOGGING
// ============================================================================

// Log page load time
window.addEventListener('load', () => {
  if (window.performance) {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log('Page load time: ' + pageLoadTime + 'ms');
  }
});

// ============================================================================
// FOOTER YEAR UPDATE
// ============================================================================

const updateCopyrightYear = () => {
  const currentYear = new Date().getFullYear();
  const footerText = document.querySelector('.footer p');
  if (footerText) {
    footerText.textContent = `© ${currentYear} Ahmad Abu Alhaija. Built with passion for clean code and exceptional design.`;
  }
};

window.addEventListener('load', updateCopyrightYear);

// ============================================================================
// END OF SCRIPT
// ============================================================================