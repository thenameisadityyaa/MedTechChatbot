document.addEventListener('DOMContentLoaded', () => {
  const featureElements = document.querySelectorAll('.feature');

  featureElements.forEach(feature => {
    feature.addEventListener('click', () => {
      const url = feature.getAttribute('data-link');
      if (url) {
        window.location.href = url;
      }
    });

    feature.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        feature.click();
      }
    });

    feature.setAttribute('tabindex', '0');
    feature.style.cursor = 'pointer';
  });

  // Floating AI Button click
  const aiBtn = document.querySelector('.ai-button');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      window.location.href = "chat.html"; // Will be designed next
    });
  }
});
