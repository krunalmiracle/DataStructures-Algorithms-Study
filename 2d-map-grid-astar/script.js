document.addEventListener("DOMContentLoaded", function () {
  // Smooth scrolling
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });
    });
  });

  // Mobile menu toggle
  const mobileMenuButton = document.getElementById("mobile-menu-button");
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }

  // Dropdown menus
  const dropdownTriggers = document.querySelectorAll(".group");
  dropdownTriggers.forEach((trigger) => {
    const dropdown = trigger.querySelector(".group-hover\\:block");
    if (dropdown) {
      trigger.addEventListener("mouseenter", () => {
        dropdown.classList.remove("hidden");
      });
      trigger.addEventListener("mouseleave", () => {
        dropdown.classList.add("hidden");
      });
    }
  });

  // Scroll-triggered animations
  const animatedElements = document.querySelectorAll(".animate-on-scroll");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-fadeIn");
        }
      });
    },
    { threshold: 0.1 }
  );

  animatedElements.forEach((el) => observer.observe(el));

  // Add more JavaScript functionality as needed
});
