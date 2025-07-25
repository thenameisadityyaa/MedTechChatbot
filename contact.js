document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !subject || !message) {
      alert('Please fill in all fields!');
      return;
    }

    alert(`Thank you, ${name}! Your message has been received.`);
    contactForm.reset();
  });

  const aiBtn = document.querySelector('.ai-button');
  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      window.location.href = "chat.html"; // Will be designed next
    });
  }
});
