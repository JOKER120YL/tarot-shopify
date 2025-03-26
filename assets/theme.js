// Main theme JavaScript file

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initMobileMenu();
  initAnimations();
  
  // 如果页面上有塔罗牌读取器，则初始化它
  if (document.querySelector('.tarot-card-reader')) {
    // 塔罗牌读取器的初始化在tarot-reader.js中处理
  }
});

// Mobile menu toggle functionality
function initMobileMenu() {
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');
  
  if (mobileMenuToggle && navMenu) {
    mobileMenuToggle.addEventListener('click', function() {
      navMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
    });
  }
}

// Initialize animations for elements with animation classes
function initAnimations() {
  // Detect elements with animation classes and trigger them when they enter viewport
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up');
  
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.is