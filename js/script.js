const dynamicText = document .querySelector(".dynamic-text");
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeEffect() {
      const currentWord = words[wordIndex];
      const currentText = currentWord.substring(0, charIndex);

      dynamicText.textContent = " " + currentText;

      if (!isDeleting && charIndex < currentWord.length) {
        charIndex++;
        setTimeout(typeEffect, 100);
      } else if (isDeleting && charIndex > 0) {
        charIndex--;
        setTimeout(typeEffect, 50);
      } else {
        isDeleting = !isDeleting;

        if (!isDeleting) {
          wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(typeEffect, 800);
      }
    }

    typeEffect();
    let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
  sections.forEach(sec => {
    let top = window.scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute('id');

    if (top >= offset && top < offset + height) {
      navLinks.forEach(links => {
        links.classList.remove('active');
        document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
      });
    }
  });
};


menuIcon.onclick = () => {
    navbar.classList.toggle('active'); // Toggle the 'active' class on the navbar
};
window.onscroll = () => {
  let top = window.scrollY; // Moved this inside the loop for correct calculation
  sections.forEach(sec => {
      let offset = sec.offsetTop - 150;
      let height = sec.offsetHeight;
      let id = sec.getAttribute('id');

      if (top >= offset && top < offset + height) {
          navLinks.forEach(link => link.classList.remove('active')); // Clear all active links first
          const activeLink = document.querySelector(`header nav a[href*="#${id}"]`); // Correct selector
          if (activeLink) { // Check if the link exists
              activeLink.classList.add('active');
          }
      }
  });
};

const menuIcon = document.getElementById('menu-icon');
const navbar = document.querySelector('.navbar');

if (menuIcon && navbar) {
  menuIcon.addEventListener('click', () => {
      navbar.classList.toggle('active');
  });
}


navLinks.forEach(link => {
  link.addEventListener('click', function(event) {
      event.preventDefault();

      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
          window.scrollTo({
              top: targetElement.offsetTop - 100,
              behavior: 'smooth'
          });

          if (navbar.classList.contains('active')) {
              navbar.classList.remove('active');
          }
      }
  });
});