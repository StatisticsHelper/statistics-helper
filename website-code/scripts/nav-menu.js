window.addEventListener('DOMContentLoaded', () => {
  window.addEventListener('scroll', function() {
    var menuBar = document.getElementById('nav-menu');
    var shouldAddBorder = window.scrollY > 0;
  
    if (shouldAddBorder) {
      menuBar.classList.add('with-border');
    } else {
      menuBar.classList.remove('with-border');
    }
  });
  
  // Add event listener to the menu button that closes the menu if 'Esc' is pressed.
  let navMenu = document.getElementById('nav-menu');
  navMenu.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      document.body.focus();
    }
  });
 
  // Implement keyboard navigation through the menu items using the up and down arrow keys.
  const menu = document.getElementById('nav-menu');
  const menuItems = menu.querySelectorAll('a[role="menuitem"]');

  document.querySelector('nav').addEventListener('keydown', (event) => {
      // If a menu item is in focus, navigate to the previous or next menu item using the up and down arrow keys.
      if (event.key === 'ArrowUp' || event.key === 'arrowLeft') {
        event.preventDefault();
        if (document.activeElement === menuItems[0]) {
          menuItems[menuItems.length - 1].focus();
        } else {
          const prevIndex = Array.from(menuItems).indexOf(document.activeElement) - 1;
          menuItems[prevIndex].focus();
        }
      } else if (event.key === 'ArrowDown' || event.key === 'arrowRight') {
        event.preventDefault();
        if (document.activeElement === menuItems[menuItems.length - 1]) {
          menuItems[0].focus();
        } else {
          const nextIndex = Array.from(menuItems).indexOf(document.activeElement) + 1;
          menuItems[nextIndex].focus();
        }
      }
    
  });
  
});
