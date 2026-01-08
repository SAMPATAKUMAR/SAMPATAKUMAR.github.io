// subtle scroll fade
const sections = document.querySelectorAll("section");

const observer = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  { threshold: 0.1 }
);

sections.forEach(sec => {
  sec.style.opacity = 0;
  sec.style.transform = "translateY(20px)";
  sec.style.transition = "0.6s ease";
  observer.observe(sec);
});
