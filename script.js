// script.js - Modular JavaScript

// Load navigation
fetch('nav.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('nav').innerHTML = data;
  })
  .catch(error => console.error('Error loading navigation:', error));

// Load footer
fetch('footer.html')
  .then(response => response.text())
  .then(data => {
    document.getElementById('footer').innerHTML = data;
  })
  .catch(error => console.error('Error loading footer:', error));