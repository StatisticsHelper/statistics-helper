import {importJson} from './scripts/import-export.js';

window.addEventListener('DOMContentLoaded', () => {

  document.getElementById('uploadButton').addEventListener('click', (event) => importJson(event));

  // Get all the sections
  let sections = [];
  sections.push(document.querySelector('header'));
  sections.push(document.querySelector('main'));
  console.log(sections);

  // Function to check if an element is in the viewport
  const isInViewport = (element) => {
    const rect = element.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    );
  };

  // Add keydown event listener to the window
  window.addEventListener('keydown', (event) => {
    // Check if the pressed key is ArrowUp or ArrowDown
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      // Find the current section in the viewport
      const currentSection = Array.from(sections).find(isInViewport);

      // Find the index of the current section
      const currentIndex = Array.from(sections).indexOf(currentSection);

      // Calculate the index of the next section
      let nextIndex;
      if (event.key === 'ArrowUp') {
        nextIndex = sections[0];
      } else {
        nextIndex = sections[1];
      }

      // Scroll to the next section
      sections[nextIndex].scrollIntoView({
        behavior: 'smooth'
      });

      // Prevent default scrolling behavior
      event.preventDefault();
    }
  });

});