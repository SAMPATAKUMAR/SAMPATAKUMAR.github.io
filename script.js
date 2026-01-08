// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href"))
            .scrollIntoView({ behavior: "smooth" });
  });
});

// Add active class on scroll
const sections = document.querySelectorAll("section");
const navLi = document.querySelectorAll(".nav-links a");

window.onscroll = () => {
  let current = "";
  sections.forEach(sec => {
    const top = sec.offsetTop - 150;
    if (pageYOffset >= top) {
      current = sec.getAttribute("id");
    }
  });

  navLi.forEach(a => {
    a.classList.remove("active");
    if (a.getAttribute("href").includes(current)) {
      a.classList.add("active");
    }
  });
};
