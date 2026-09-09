/* Flow Physics Lab — interactions */
(function () {
  "use strict";

  /* ---- mobile nav ---- */
  var toggle = document.querySelector(".nav-toggle");
  var links = document.getElementById("nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- lattice / flow hero animation ---- */
  var canvas = document.getElementById("flow-canvas");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (canvas && !reduce) {
    var ctx = canvas.getContext("2d");
    var W, H, particles = [], DPR = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    }

    function seed() {
      particles = [];
      var n = Math.round((W * H) / 14000);
      n = Math.max(40, Math.min(160, n));
      for (var i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          s: 0.6 + Math.random() * 1.6
        });
      }
    }

    // a smooth pseudo-vortex velocity field (lattice-Boltzmann-flavored eye candy)
    function vel(x, y, t) {
      var cx = W * 0.32, cy = H * 0.55;
      var dx = x - cx, dy = y - cy;
      var r = Math.sqrt(dx * dx + dy * dy) + 40;
      var swirl = 900 / r;
      var vx = (-dy / r) * swirl + 22;                 // rotation + mean flow to the right
      var vy = (dx / r) * swirl + Math.sin((x * 0.006) + t * 0.6) * 8;
      return [vx, vy];
    }

    var last = performance.now();
    function frame(now) {
      var dt = Math.min(40, now - last) / 1000; last = now;
      var t = now / 1000;
      ctx.clearRect(0, 0, W, H);

      // faint lattice dots
      ctx.fillStyle = "rgba(111,194,201,0.10)";
      var step = 46;
      for (var gx = step / 2; gx < W; gx += step) {
        for (var gy = step / 2; gy < H; gy += step) {
          ctx.fillRect(gx, gy, 1.3, 1.3);
        }
      }

      // streaming particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        var v = vel(p.x, p.y, t);
        var nx = p.x + v[0] * dt, ny = p.y + v[1] * dt;
        ctx.strokeStyle = "rgba(150,214,220,0.5)";
        ctx.lineWidth = p.s;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        p.x = nx; p.y = ny;
        if (p.x > W + 10 || p.y > H + 10 || p.y < -10 || p.x < -10) {
          p.x = -10; p.y = Math.random() * H;
        }
      }
      requestAnimationFrame(frame);
    }

    window.addEventListener("resize", resize);
    resize();
    requestAnimationFrame(frame);
  }

  /* ---- publications search + filter ---- */
  var search = document.getElementById("pub-search");
  var pills = Array.prototype.slice.call(document.querySelectorAll(".pill[data-filter]"));
  var lists = Array.prototype.slice.call(document.querySelectorAll("ol.pubs"));
  var counter = document.getElementById("pub-count");

  function applyFilters() {
    var q = (search ? search.value : "").trim().toLowerCase();
    var active = "all";
    pills.forEach(function (b) { if (b.getAttribute("aria-pressed") === "true") active = b.getAttribute("data-filter"); });

    var shown = 0;
    lists.forEach(function (ol) {
      var group = ol.getAttribute("data-group");
      var groupOn = (active === "all" || active === group);
      var anyVisible = false;
      Array.prototype.forEach.call(ol.children, function (li) {
        var text = li.textContent.toLowerCase();
        var match = groupOn && (q === "" || text.indexOf(q) !== -1);
        li.style.display = match ? "" : "none";
        if (match) { anyVisible = true; shown++; }
      });
      var wrap = ol.closest("[data-section]");
      if (wrap) wrap.style.display = anyVisible ? "" : "none";
    });
    if (counter) counter.textContent = shown + (shown === 1 ? " entry" : " entries") + " shown";
    var empty = document.getElementById("pub-empty");
    if (empty) empty.style.display = shown === 0 ? "" : "none";
  }

  if (search) search.addEventListener("input", applyFilters);
  pills.forEach(function (b) {
    b.addEventListener("click", function () {
      pills.forEach(function (o) { o.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      applyFilters();
    });
  });
  if (lists.length) applyFilters();
})();
