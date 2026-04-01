(function () {
  var SEEN_KEY = 'gti-intro-seen';

  // Only show on first visit
  if (localStorage.getItem(SEEN_KEY)) return;

  var overlay = document.getElementById('lottie-intro-overlay');
  var btn = document.getElementById('lottie-continue-btn');

  if (!overlay || !btn) return;

  // Show overlay
  overlay.style.display = 'flex';
  // Prevent page scroll while overlay is active
  document.body.style.overflow = 'hidden';

  function showButton() {
    btn.style.display = 'block';
  }

  function dismiss() {
    localStorage.setItem(SEEN_KEY, '1');
    overlay.classList.add('fade-out');
    document.body.style.overflow = '';
    setTimeout(function () {
      overlay.style.display = 'none';
    }, 650);
  }

  // Show continue button after 5 seconds
  setTimeout(showButton, 5000);

  btn.addEventListener('click', dismiss);
})();
