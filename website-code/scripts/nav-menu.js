window.addEventListener('DOMContentLoaded', () => {

  const navIcon = document.getElementById('nav-icon');
  const navMenu = document.getElementById('nav-menu');

  // Hide the menu by default when the page is loaded.
  navMenu.style.display = 'none';
  
  // Add event listener to the nav-icon that opens or closes the menu when clicked.
  navIcon.addEventListener('click', () => {
    if (menu.style.display === 'block') {
      navIcon.setAttribute('aria-expanded', 'false');
      menu.style.display = 'none';
    } else {
      navIcon.setAttribute('aria-expanded', 'true');
      menu.style.display = 'block';
      menuItems[0].focus();
    }
  });

  // Add event listener to the menu button that closes the menu if 'Esc' is pressed.
  navMenu.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      navIcon.setAttribute('aria-expanded', 'false');
      navMenu.style.display = 'none';
      navIcon.focus();
    }
  });
 
  // Implement keyboard navigation through the menu items using the up and down arrow keys.
  const menu = document.getElementById('nav-menu');
  const menuItems = menu.querySelectorAll('a[role="menuitem"]');

  document.querySelector('nav').addEventListener('keydown', (event) => {
    if (navIcon === document.activeElement) {
      // If the nav-icon is in focus, open the menu with the first or last menu item in focus.
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        navIcon.click();
        menuItems[menuItems.length - 1].focus();
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        navIcon.click();
        menuItems[0].focus();
      }
    } else {
      // If a menu item is in focus, navigate to the previous or next menu item using the up and down arrow keys.
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        if (document.activeElement === menuItems[0]) {
          menuItems[menuItems.length - 1].focus();
        } else {
          const prevIndex = Array.from(menuItems).indexOf(document.activeElement) - 1;
          menuItems[prevIndex].focus();
        }
      } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        if (document.activeElement === menuItems[menuItems.length - 1]) {
          menuItems[0].focus();
        } else {
          const nextIndex = Array.from(menuItems).indexOf(document.activeElement) + 1;
          menuItems[nextIndex].focus();
        }
      }
    }
  });
  
});
