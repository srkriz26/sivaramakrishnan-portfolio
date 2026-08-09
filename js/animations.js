// animations.js — scroll reveals, counters, timeline rail grow
(function(){
  function initReveal(){
    const els = document.querySelectorAll('.reveal, .reveal-scale');
    if(!('IntersectionObserver' in window)){
      els.forEach(el => el.classList.add('in-view'));
      return;
    }
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
  }

  function initCounters(){
    const counters = document.querySelectorAll('.counter');
    if(!counters.length) return;
    const animate = (el)=>{
      const target = parseFloat(el.dataset.value);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '';
      const valueEl = el.querySelector('.counter-value');
      if(!valueEl) return;
      if(isNaN(target)){
        valueEl.textContent = el.dataset.display || '';
        return;
      }
      let start = 0;
      const duration = 1400;
      const startTime = performance.now();
      function tick(now){
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        valueEl.textContent = prefix + current + suffix;
        if(progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    };

    if(!('IntersectionObserver' in window)){
      counters.forEach(c => { c.classList.add('in-view'); animate(c); });
      return;
    }
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          animate(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => obs.observe(c));
  }

  function initTimelineRailGrow(){
    const rail = document.querySelector('.timeline-rail');
    if(!rail || !('IntersectionObserver' in window)){
      if(rail) rail.classList.add('grown');
      return;
    }
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          entry.target.classList.add('grown');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });
    obs.observe(rail);
  }

  function initParallax(){
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced) return;
    const targets = document.querySelectorAll('.parallax');
    if(!targets.length) return;
    let ticking = false;
    function update(){
      const y = window.scrollY || window.pageYOffset;
      targets.forEach(el => {
        const rate = parseFloat(el.dataset.parallaxRate || '0.06');
        const offset = Math.min(y * rate, 60); // cap so it never drifts too far
        el.style.setProperty('--py', offset + 'px');
      });
      ticking = false;
    }
    window.addEventListener('scroll', ()=>{
      if(!ticking){
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive:true });
    update();
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    initReveal();
    initCounters();
    initTimelineRailGrow();
    initParallax();
  });

  // Expose for dynamically-inserted content (e.g. after JSON render)
  window.PortfolioAnimations = { initReveal, initCounters, initTimelineRailGrow, initParallax };
})();
