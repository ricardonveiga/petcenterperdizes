(function(){
  "use strict";

  /* Footer year */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Header scroll state */
  var header = document.getElementById("siteHeader");
  var onScroll = function(){
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  var hamburger = document.getElementById("hamburger");
  var mainNav = document.getElementById("mainNav");
  if (hamburger && mainNav) {
    hamburger.addEventListener("click", function(){
      var open = mainNav.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    mainNav.querySelectorAll("a").forEach(function(link){
      link.addEventListener("click", function(){
        mainNav.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* Hero video crossfade (dog <-> cat in the garden) — plays non-stop */
  var heroVideos = document.querySelectorAll(".hero-video");
  if (heroVideos.length) {
    var keepPlaying = function(video){
      var p = video.play();
      if (p && typeof p.catch === "function") p.catch(function(){});
    };

    heroVideos.forEach(function(video){
      keepPlaying(video);
      // Belt-and-suspenders looping: some browsers can drop the native
      // `loop` attribute (e.g. after a seek/visibility change), so force
      // a restart whenever a video reports it ended.
      video.addEventListener("ended", function(){
        video.currentTime = 0;
        keepPlaying(video);
      });
      video.addEventListener("pause", function(){
        if (!document.hidden) keepPlaying(video);
      });
    });

    document.addEventListener("visibilitychange", function(){
      if (!document.hidden) heroVideos.forEach(keepPlaying);
    });

    if (heroVideos.length > 1) {
      var activeIndex = 0;
      setInterval(function(){
        heroVideos[activeIndex].classList.remove("is-active");
        activeIndex = (activeIndex + 1) % heroVideos.length;
        heroVideos[activeIndex].classList.add("is-active");
        keepPlaying(heroVideos[activeIndex]);
      }, 7000);
    }
  }

  /* Scroll reveal */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    revealEls.forEach(function(el){ io.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add("in-view"); });
  }
})();
