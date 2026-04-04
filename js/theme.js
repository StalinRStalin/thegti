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

    // ── Post navigation — edge swipe (mobile/tablet) ──────────────
    var prevBtn = document.querySelector('.post-nav-prev:not(.post-nav-disabled)');
    var nextBtn = document.querySelector('.post-nav-next:not(.post-nav-disabled)');

    if (prevBtn || nextBtn) {
      // Inject swipe hint elements
      var prevHint = document.createElement('div');
      prevHint.className = 'post-nav-prev-hint';
      var nextHint = document.createElement('div');
      nextHint.className = 'post-nav-next-hint';
      document.body.appendChild(prevHint);
      document.body.appendChild(nextHint);

      var EDGE_ZONE  = 30;  // px from screen edge to start tracking
      var MIN_SWIPE  = 60;  // px minimum horizontal travel to trigger nav
      var touchStartX = null;
      var touchStartY = null;
      var trackingEdge = null; // 'left' | 'right' | null

      document.addEventListener('touchstart', function (e) {
        var x = e.touches[0].clientX;
        var y = e.touches[0].clientY;
        touchStartX = x;
        touchStartY = y;
        if (x < EDGE_ZONE && prevBtn) {
          trackingEdge = 'left';
          prevHint.classList.add('active');
        } else if (x > window.innerWidth - EDGE_ZONE && nextBtn) {
          trackingEdge = 'right';
          nextHint.classList.add('active');
        } else {
          trackingEdge = null;
        }
      }, { passive: true });

      document.addEventListener('touchmove', function (e) {
        if (!trackingEdge) return;
        var dx = e.touches[0].clientX - touchStartX;
        var dy = e.touches[0].clientY - touchStartY;
        // Cancel if scrolling vertically more than horizontally
        if (Math.abs(dy) > Math.abs(dx) * 1.5) {
          trackingEdge = null;
          prevHint.classList.remove('active');
          nextHint.classList.remove('active');
        }
      }, { passive: true });

      document.addEventListener('touchend', function (e) {
        var dx = e.changedTouches[0].clientX - touchStartX;
        prevHint.classList.remove('active');
        nextHint.classList.remove('active');
        if (!trackingEdge) return;
        if (trackingEdge === 'left'  && dx >  MIN_SWIPE && prevBtn) window.location.href = prevBtn.href;
        if (trackingEdge === 'right' && dx < -MIN_SWIPE && nextBtn) window.location.href = nextBtn.href;
        trackingEdge = null;
      }, { passive: true });
    }

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
