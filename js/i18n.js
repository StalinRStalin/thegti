(function () {
  var LANG_KEY = 'gti-lang';
  var langPrefixes = ['en', 'ta', 'hi', 'kn', 'ml', 'te', 'zh-CN', 'es', 'fr', 'de', 'ru', 'ar', 'ja'];

  // Map our lang codes to Google Translate lang codes
  var gtLangMap = {
    'en': 'en',
    'ta': 'ta',
    'hi': 'hi',
    'kn': 'kn',
    'ml': 'ml',
    'te': 'te',
    'zh-CN': 'zh-CN',
    'es': 'es',
    'fr': 'fr',
    'de': 'de',
    'ru': 'ru',
    'ar': 'ar',
    'ja': 'ja'
  };

  function setGoogleTranslateCookie(lang) {
    var gtLang = gtLangMap[lang] || lang;
    // Google Translate cookie format: /source/target (or /auto/target)
    var cookieValue = '/ta/' + gtLang;
    // Set for current domain
    document.cookie = 'googtrans=' + cookieValue + '; path=/';
    document.cookie = 'googtrans=' + cookieValue + '; path=/; domain=' + window.location.hostname;
  }

  function clearGoogleTranslateCookie() {
    document.cookie = 'googtrans=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = 'googtrans=; path=/; domain=' + window.location.hostname + '; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  }

  function getStoredLang() {
    // Check cookie first
    var match = document.cookie.match(/googtrans=\/[a-zA-Z-]+\/([a-zA-Z-]+)/);
    if (match) return match[1];
    return localStorage.getItem(LANG_KEY) || 'ta';
  }

  function setLang(lang) {
    localStorage.setItem(LANG_KEY, lang);
    if (lang === 'ta') {
      clearGoogleTranslateCookie();
    } else {
      setGoogleTranslateCookie(lang);
    }
    window.location.reload();
  }

  document.addEventListener('DOMContentLoaded', function () {
    var sel = document.getElementById('lang-select');
    if (!sel) return;

    // Reflect current translation state
    var currentLang = getStoredLang();
    if (langPrefixes.indexOf(currentLang) !== -1) {
      sel.value = currentLang;
    }

    sel.addEventListener('change', function () {
      setLang(this.value);
    });
  });
})();
