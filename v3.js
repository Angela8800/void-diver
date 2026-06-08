// VOID DIVER — V3 interactions
(function () {
  "use strict";
  var nav = document.getElementById("nav");
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  var progress = document.getElementById("progress");
  var heroMedia = document.getElementById("heroMedia");
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    nav.classList.toggle("scrolled", y > 40);
    if (progress) {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
    }
    if (heroMedia && !reduce && y < window.innerHeight) {
      heroMedia.style.transform = "translateY(" + (y * 0.28) + "px) scale(1.06)";
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // mobile menu
  function closeMenu() {
    links.classList.remove("open"); nav.classList.remove("menu-open");
    toggle.setAttribute("aria-expanded", "false");
  }
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    nav.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });
  links.addEventListener("click", function (e) { if (e.target.tagName === "A") closeMenu(); });

  // reveal on scroll
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in"); });
  }

  // count-up stats
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-target")) || 0;
    var suffix = el.getAttribute("data-suffix") || "";
    if (reduce) { el.textContent = target.toLocaleString("en-US") + suffix; return; }
    var dur = 1500, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(target * eased);
      el.textContent = val.toLocaleString("en-US") + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counts = document.querySelectorAll(".count-up");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { animateCount(en.target); cio.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    counts.forEach(function (el) { cio.observe(el); });
  } else {
    counts.forEach(animateCount);
  }

  // lightbox gallery
  var shots = Array.prototype.slice.call(document.querySelectorAll(".shot"));
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var idx = 0;
  function srcOf(btn) { return btn.getAttribute("data-full") || btn.querySelector("img").src; }
  function show(i) {
    idx = (i + shots.length) % shots.length;
    lbImg.src = srcOf(shots[idx]);
    lbImg.alt = shots[idx].querySelector("img").alt || "";
  }
  function open(i) { show(i); lb.classList.add("open"); lb.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; }
  function close() { lb.classList.remove("open"); lb.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; lbImg.src = ""; }
  shots.forEach(function (btn, i) { btn.addEventListener("click", function () { open(i); }); });
  document.getElementById("lbClose").addEventListener("click", close);
  document.getElementById("lbPrev").addEventListener("click", function () { show(idx - 1); });
  document.getElementById("lbNext").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowLeft") show(idx - 1);
    else if (e.key === "ArrowRight") show(idx + 1);
  });
})();
