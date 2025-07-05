const scrollButton = document.getElementById('scroll-hint');
  const scrollContainer = document.querySelector('#horizontal-section');

  // Show button only if scrollable
  function checkScrollHint() {
    const hasScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
    scrollButton.style.display = hasScroll ? 'block' : 'none';
  }

  // Scroll smoothly on button click
  scrollButton.addEventListener('click', () => {
    scrollContainer.scrollBy({
      left: 300,
      behavior: 'smooth'
    });
  });

  // Recheck on load and resize
  window.addEventListener('load', checkScrollHint);
  window.addEventListener('resize', checkScrollHint);


// Handle single/two item containers for styling
document.querySelectorAll('.product-works').forEach(container => {
  const items = container.querySelectorAll('.project-inside');
  if (items.length === 1) {
    container.classList.add('single-item');
  } else if (items.length === 2) {
    container.classList.add('two-items');
  }
});
