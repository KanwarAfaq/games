/* Shared helpers for the arcade games: storage, sound, canvas fitting,
   the game loop, keyboard input and the start / pause / game-over overlay. */
(function () {
  'use strict';

  var PREFIX = 'kanwar-arcade:';

  var store = {
    get: function (key, fallback) {
      try {
        var raw = window.localStorage.getItem(PREFIX + key);
        return raw === null ? fallback : JSON.parse(raw);
      } catch (e) {
        return fallback;
      }
    },
    set: function (key, value) {
      try {
        window.localStorage.setItem(PREFIX + key, JSON.stringify(value));
      } catch (e) { /* storage unavailable: scores just won't persist */ }
    }
  };

  function media(query) {
    try { return window.matchMedia(query).matches; } catch (e) { return false; }
  }

  var util = {
    rand: function (a, b) { return a + Math.random() * (b - a); },
    clamp: function (v, a, b) { return Math.max(a, Math.min(b, v)); },
    lerp: function (a, b, t) { return a + (b - a) * t; },
    fmt: function (n) { return Math.round(n).toLocaleString('en-US'); },
    hit: function (ax, ay, ar, bx, by, br) {
      var dx = ax - bx, dy = ay - by, r = ar + br;
      return dx * dx + dy * dy <= r * r;
    },
    reduceMotion: media('(prefers-reduced-motion: reduce)'),
    coarsePointer: media('(pointer: coarse)')
  };

  /* ---------- Sound (tiny synth, no audio files) ---------- */

  var AudioCtx = window.AudioContext || window.webkitAudioContext;
  var audio = null;
  var muted = !!store.get('muted', false);

  function getAudio() {
    if (!AudioCtx) return null;
    if (!audio) {
      try { audio = new AudioCtx(); } catch (e) { return null; }
    }
    if (audio.state === 'suspended') audio.resume();
    return audio;
  }

  function tone(o) {
    if (muted) return;
    var a = getAudio();
    if (!a) return;
    var t0 = a.currentTime + (o.delay || 0);
    var osc = a.createOscillator();
    var gain = a.createGain();
    osc.type = o.type || 'square';
    osc.frequency.setValueAtTime(o.freq, t0);
    if (o.to) osc.frequency.exponentialRampToValueAtTime(Math.max(20, o.to), t0 + o.dur);
    gain.gain.setValueAtTime(o.vol || 0.05, t0);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur);
    osc.connect(gain);
    gain.connect(a.destination);
    osc.start(t0);
    osc.stop(t0 + o.dur + 0.03);
  }

  function noise(o) {
    if (muted) return;
    var a = getAudio();
    if (!a) return;
    var len = Math.max(1, Math.floor(a.sampleRate * o.dur));
    var buffer = a.createBuffer(1, len, a.sampleRate);
    var data = buffer.getChannelData(0);
    for (var i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    var src = a.createBufferSource();
    var filter = a.createBiquadFilter();
    var gain = a.createGain();
    filter.type = 'lowpass';
    filter.frequency.value = o.freq || 1200;
    gain.gain.value = o.vol || 0.1;
    src.buffer = buffer;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(a.destination);
    src.start();
  }

  var sfx = {
    unlock: function () { getAudio(); },
    isMuted: function () { return muted; },
    setMuted: function (v) { muted = !!v; store.set('muted', muted); },

    shoot: function () { tone({ freq: 920, to: 380, dur: 0.07, vol: 0.022 }); },
    hit: function () { tone({ freq: 320, to: 160, dur: 0.07, vol: 0.04 }); },
    boom: function () {
      noise({ dur: 0.32, vol: 0.11, freq: 900 });
      tone({ type: 'sawtooth', freq: 130, to: 40, dur: 0.3, vol: 0.06 });
    },
    hurt: function () {
      noise({ dur: 0.55, vol: 0.16, freq: 700 });
      tone({ type: 'sawtooth', freq: 220, to: 50, dur: 0.5, vol: 0.08 });
    },
    power: function () {
      tone({ type: 'triangle', freq: 520, to: 1040, dur: 0.14, vol: 0.07 });
      tone({ type: 'triangle', freq: 780, to: 1560, dur: 0.16, vol: 0.06, delay: 0.1 });
    },
    start: function () {
      tone({ freq: 392, dur: 0.1, vol: 0.05 });
      tone({ freq: 523, dur: 0.1, vol: 0.05, delay: 0.1 });
      tone({ freq: 784, dur: 0.18, vol: 0.05, delay: 0.2 });
    },
    over: function () {
      tone({ freq: 392, to: 330, dur: 0.18, vol: 0.06 });
      tone({ freq: 294, to: 220, dur: 0.22, vol: 0.06, delay: 0.18 });
      tone({ freq: 196, to: 110, dur: 0.4, vol: 0.06, delay: 0.38 });
    },
    levelup: function () {
      [523, 659, 784, 1047].forEach(function (f, i) {
        tone({ freq: f, dur: 0.12, vol: 0.05, delay: i * 0.09 });
      });
    },
    paddle: function () { tone({ type: 'triangle', freq: 300, to: 220, dur: 0.07, vol: 0.09 }); },
    wall: function () { tone({ type: 'triangle', freq: 200, to: 170, dur: 0.04, vol: 0.05 }); },
    metal: function () { tone({ type: 'square', freq: 1200, to: 900, dur: 0.05, vol: 0.03 }); },
    brick: function (streak) {
      tone({ freq: 420 + Math.min(streak, 14) * 38, dur: 0.07, vol: 0.045 });
    }
  };

  /* ---------- Canvas fitting (crisp on high-DPI screens) ---------- */

  function fitCanvas(canvas, W, H) {
    var view = { W: W, H: H, k: 1 };

    function resize() {
      var rect = canvas.getBoundingClientRect();
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var w = Math.max(1, Math.round(rect.width * dpr));
      var h = Math.round(w * H / W);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      view.k = canvas.width / W;
    }

    resize();
    if ('ResizeObserver' in window) {
      new ResizeObserver(resize).observe(canvas);
    } else {
      window.addEventListener('resize', resize);
    }

    view.toLogical = function (clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      return { x: (clientX - r.left) / r.width * W, y: (clientY - r.top) / r.height * H };
    };
    return view;
  }

  /* ---------- Fixed-timestep loop ---------- */

  function createLoop(update, render) {
    var STEP = 1 / 60;
    var acc = 0, last = 0, running = false, raf = 0;

    function frame(ms) {
      if (!running) return;
      var now = ms / 1000;
      acc += Math.min(0.1, now - last);
      last = now;
      while (acc >= STEP) { update(STEP); acc -= STEP; }
      render();
      raf = window.requestAnimationFrame(frame);
    }

    return {
      start: function () {
        if (running) return;
        running = true;
        last = window.performance.now() / 1000;
        raf = window.requestAnimationFrame(frame);
      },
      stop: function () {
        running = false;
        window.cancelAnimationFrame(raf);
      }
    };
  }

  /* ---------- Keyboard ---------- */

  function keyboard(onPress) {
    var down = {};

    window.addEventListener('keydown', function (e) {
      var tag = e.target && e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.code.indexOf('Arrow') === 0 || (e.code === 'Space' && tag !== 'BUTTON')) e.preventDefault();
      if (!e.repeat) {
        down[e.code] = true;
        if (onPress) onPress(e.code, e);
      }
    });
    window.addEventListener('keyup', function (e) { delete down[e.code]; });
    window.addEventListener('blur', function () { down = {}; });

    return {
      has: function () {
        for (var i = 0; i < arguments.length; i++) if (down[arguments[i]]) return true;
        return false;
      }
    };
  }

  /* ---------- UI bits ---------- */

  // Returns a setter that only touches the DOM when the value changes.
  function text(id) {
    var el = document.getElementById(id);
    var last = null;
    return function (value) {
      if (el && value !== last) {
        el.textContent = value;
        last = value;
      }
    };
  }

  // Draws a row of life pips and keeps the accessible label in sync.
  function pips(id, extraClass) {
    var el = document.getElementById(id);
    var last = -1;
    return function (n) {
      if (!el || n === last) return;
      last = n;
      var html = '';
      for (var i = 0; i < n; i++) html += '<span class="pip ' + (extraClass || '') + '"></span>';
      el.innerHTML = html;
      el.setAttribute('aria-label', n + (n === 1 ? ' life left' : ' lives left'));
    };
  }

  function overlay() {
    var root = document.getElementById('overlay');
    var title = document.getElementById('overlay-title');
    var body = document.getElementById('overlay-text');
    var btn = document.getElementById('overlay-btn');
    var handler = null;

    btn.addEventListener('click', function () { if (handler) handler(); });

    return {
      show: function (t, b, label, onClick, focus) {
        title.textContent = t;
        body.textContent = b;
        btn.textContent = label;
        handler = onClick;
        root.hidden = false;
        if (focus) window.setTimeout(function () { btn.focus({ preventScroll: true }); }, 0);
      },
      hide: function () { root.hidden = true; handler = null; },
      isVisible: function () { return !root.hidden; }
    };
  }

  function bindToggleButton(id, getLabel, getPressed, onClick) {
    var btn = document.getElementById(id);
    if (!btn) return { refresh: function () {} };
    function refresh() {
      btn.textContent = getLabel();
      btn.setAttribute('aria-pressed', String(getPressed()));
    }
    btn.addEventListener('click', function () {
      onClick();
      refresh();
      btn.blur(); // keep Space free for the game
    });
    refresh();
    return { refresh: refresh };
  }

  window.Arcade = {
    store: store,
    util: util,
    sfx: sfx,
    fitCanvas: fitCanvas,
    createLoop: createLoop,
    keyboard: keyboard,
    text: text,
    pips: pips,
    overlay: overlay,
    bindToggleButton: bindToggleButton
  };
})();
