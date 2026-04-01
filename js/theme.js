(function () {
  var STORAGE_KEY = 'gti-theme';

  // ── Dark / Light Mode ──────────────────────────────────────────
  function getStoredTheme() {
    return localStorage.getItem(STORAGE_KEY) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
  }

  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  }

  // ── Reading Progress Bar ───────────────────────────────────────
  function updateProgress() {
    var bar = document.getElementById('reading-progress');
    if (!bar) return;
    var scrollTop = window.scrollY;
    var docHeight = document.body.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight * 100) + '%' : '0%';
  }

  // ── Theme Hint (first-visit only) ─────────────────────────────
  function showThemeHint(btn) {
    if (localStorage.getItem('gti-hint-seen')) return;
    btn.classList.add('hint-active');
    var arrow = document.createElement('span');
    arrow.className = 'theme-hint-arrow';
    arrow.textContent = '↑ click me';
    btn.appendChild(arrow);

    var timer = setTimeout(function () { dismissHint(btn, arrow); }, 6000);

    btn.addEventListener('click', function onHintClick() {
      clearTimeout(timer);
      dismissHint(btn, arrow);
      btn.removeEventListener('click', onHintClick);
    }, { once: true });
  }

  function dismissHint(btn, arrow) {
    localStorage.setItem('gti-hint-seen', '1');
    btn.classList.remove('hint-active');
    if (arrow && arrow.parentNode) arrow.parentNode.removeChild(arrow);
  }

  // ── Init ───────────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getStoredTheme());

    var toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleTheme);
      showThemeHint(toggleBtn);
    }

    window.addEventListener('scroll', updateProgress, { passive: true });

    // ── Quick Action Button (FAB) ──────────────────────────────────
    var qab = document.querySelector('.qab');
    var qabBtn = document.querySelector('.qab-btn');
    if (qab && qabBtn) {
      qabBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = qab.classList.toggle('open');
        qabBtn.setAttribute('aria-expanded', String(isOpen));
      });
      document.addEventListener('click', function () {
        qab.classList.remove('open');
        qabBtn.setAttribute('aria-expanded', 'false');
      });
      qab.addEventListener('click', function (e) { e.stopPropagation(); });
    }

    document.querySelectorAll('.qab-scroll').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = this.getAttribute('data-scroll');
        var pos = target === 'top' ? 0
                : target === 'bottom' ? document.body.scrollHeight
                : document.body.scrollHeight / 2;
        window.scrollTo({ top: pos, behavior: 'smooth' });
      });
    });

    // ── Post body image captions (title → figcaption) ─────────────
    document.querySelectorAll('.post-body img[title]').forEach(function (img) {
      var title = img.getAttribute('title');
      if (!title) return;
      var fig = document.createElement('figure');
      fig.className = 'post-img-figure';
      img.parentNode.insertBefore(fig, img);
      fig.appendChild(img);
      var cap = document.createElement('figcaption');
      cap.className = 'post-img-caption';
      cap.textContent = title;
      fig.appendChild(cap);
    });
  });
})();
