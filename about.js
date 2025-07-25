document.addEventListener('DOMContentLoaded', () => {
  const featureElements = document.querySelectorAll('.feature');
  // Floating AI Button click
  const aiBtn = document.querySelector('.ai-button');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      window.location.href = "chat.html"; // Will be designed next
    });
  }
});
