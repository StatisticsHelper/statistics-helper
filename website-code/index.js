import importJson from '../website-code/scripts/import-export.js';

const navIcon = document.getElementById('nav-icon');
const navMenu = document.getElementById('nav-menu');

navMenu.style.display = 'none';

navIcon.addEventListener('click', () => {
  if (navMenu.style.display === 'block') {
    navMenu.style.display = 'none';
  } else {
    navMenu.style.display = 'block';
  }
});

importJson;