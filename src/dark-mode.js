// Dark mode toggle. The initial theme class is applied before paint by the
// inline script in code/page.js — kept in sync manually: same storage key
// ('theme') and class name ('dark-mode').
(function() {
  function toggleTheme() {
    const dark = document.documentElement.classList.toggle('dark-mode');
    try {
      localStorage.setItem('theme', dark ? 'dark' : 'light');
    } catch (e) {
      // Storage blocked (private mode, cookies disabled) — theme won't persist
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    const toggleButton = document.getElementById('theme-toggle');
    if (toggleButton) {
      toggleButton.addEventListener('click', toggleTheme);
    }
  });
})();
