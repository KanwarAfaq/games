/* Site-wide behaviour: mobile game-library drawer and saved best scores. */
(function () {
  'use strict';

  var body = document.body;
  var toggle = document.querySelector('.menu-toggle');
  var scrim = document.querySelector('.scrim');

  function setOpen(open) {
    body.classList.toggle('sidebar-open', open);
    if (toggle) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close game library' : 'Open game library');
    }
    if (scrim) scrim.hidden = !open;
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setOpen(!body.classList.contains('sidebar-open'));
    });
  }
  if (scrim) scrim.addEventListener('click', function () { setOpen(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && body.classList.contains('sidebar-open')) {
      setOpen(false);
      if (toggle) toggle.focus();
    }
  });

  try {
    window.matchMedia('(min-width: 900px)').addEventListener('change', function (e) {
      if (e.matches) setOpen(false);
    });
  } catch (err) { /* older browsers: the drawer simply stays as it is */ }

  // Best scores are written by the games into localStorage.
  function readBest(id) {
    try {
      var v = JSON.parse(window.localStorage.getItem('kanwar-arcade:best:' + id));
      return typeof v === 'number' ? v : 0;
    } catch (err) {
      return 0;
    }
  }

  function showBest() {
    var nodes = document.querySelectorAll('[data-best]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var value = readBest(el.getAttribute('data-best'));
      var prefix = el.getAttribute('data-prefix') || 'Best ';
      el.textContent = value > 0 ? prefix + value.toLocaleString('en-US') : 'No score yet';
    }
  }

  showBest();
  window.addEventListener('storage', showBest);
  window.addEventListener('pageshow', showBest);
})();
