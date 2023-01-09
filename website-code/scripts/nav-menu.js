console.log("menu check");

window.addEventListener('DOMContentLoaded', () => {

    const navIcon = document.getElementById('nav-icon');
    const navMenu = document.getElementById('nav-menu');
    console.log("menu check");
  
    navMenu.style.display = 'none';
  
    navIcon.addEventListener('click', () => {
      if (navMenu.style.display === 'block') {
        navMenu.style.display = 'none';
      } else {
        navMenu.style.display = 'block';
      }
    });
    
});