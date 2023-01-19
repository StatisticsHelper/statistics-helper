console.log("menu check");

window.addEventListener('DOMContentLoaded', () => {

    const navIcon = document.getElementById('nav-icon');
    const navMenu = document.getElementById('nav-menu');
    console.log("menu check");
  
    navMenu.style.display = 'none';
  
    navIcon.addEventListener('click', () => {
      if (navMenu.style.display === 'block') {
        navIcon.setAttribute('aria-expanded', 'false');
        navMenu.style.display = 'none';
      } else {
        navIcon.setAttribute('aria-expanded', 'true');
        navMenu.style.display = 'block';
      }
    });
    
});