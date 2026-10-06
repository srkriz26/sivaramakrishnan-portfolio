// navigation.js — active-section tracking, the desktop dock, and the phone/tablet menu
(function(){
  const sections = document.querySelectorAll('main .section, main .split-section, #home');
  const topLinks = document.querySelectorAll('.topnav-menu a');
  const topToggle = document.querySelector('.topnav-toggle');
  const topMenu = document.querySelector('.topnav-menu');

  const dock = document.querySelector('.dock');
  const dockToggle = dock && dock.querySelector('.dock-toggle');
  const dockIcon = dock && dock.querySelector('.dock-icon');
  const dockCurrent = dock && dock.querySelector('.dock-current');
  const dockTrack = dock && dock.querySelector('.dock-cards');
  const cards = dock ? Array.from(dock.querySelectorAll('.dock-card')) : [];

  // The dock is desktop-only: a wide window on a device with a mouse.
  // Keep this in step with the media query in css/style.css.
  const desktop = window.matchMedia('(min-width:901px) and (hover:hover) and (pointer:fine)');

  const OPEN_DELAY = 120;    // ms the pointer must rest on the icon before the bar unfolds
  const CLOSE_DELAY = 320;   // ms after the pointer leaves before it folds away
  const GAP = 8;             // space between cards when they all fit side by side
  const SLIVER_MIN = 40;     // least a covered card may show (enough for its number)
  const EDGE = 16;           // margin kept between the bar and the window edges
  const TRACK_MARGIN = 6;    // .dock.open .dock-cards margin-left

  let activeId = 'home';
  let hoverIndex = -1;       // card under the pointer / keyboard focus, -1 if none
  let isOpen = false;
  let openTimer = null, closeTimer = null;
  let lastY = window.scrollY;

  /* ---------- active section ---------- */
  function setActive(id){
    activeId = id;
    topLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
    cards.forEach(c => {
      const on = c.dataset.target === id;
      c.classList.toggle('active', on);
      if(on){ c.setAttribute('aria-current', 'true'); dockCurrent.innerHTML = c.innerHTML; }
      else c.removeAttribute('aria-current');
    });
    layoutDock();
  }

  if('IntersectionObserver' in window && sections.length){
    const observer = new IntersectionObserver((entries)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          setActive(entry.target.id);
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });
    sections.forEach(s => observer.observe(s));
  }

  /* ---------- dock: card layout ----------
     Wide window: cards sit side by side. When they no longer fit, each card
     lies over the tail of the one before it. The card being pointed at (or,
     if none, the current section's card) and the last card show in full;
     the rest share whatever room is left. */
  function layoutDock(){
    if(!dock || !desktop.matches) return;
    const n = cards.length;
    const widths = cards.map(c => c.offsetWidth);
    const want = widths.map((w, i) => w + (i < n - 1 ? GAP : 0));
    const natural = want.reduce((a, b) => a + b, 0);

    const cs = getComputedStyle(dock);
    const chrome = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight)
                 + parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth)
                 + dockIcon.offsetWidth + TRACK_MARGIN;
    const avail = document.documentElement.clientWidth - 2 * EDGE - chrome;
    const stacked = natural > avail;
    const width = stacked ? avail : natural;

    let slots = want.slice();
    if(stacked){
      let front = hoverIndex >= 0 ? hoverIndex : cards.findIndex(c => c.dataset.target === activeId);
      if(front < 0) front = 0;
      const full = i => i === front || i === n - 1;
      let room = width;
      const flex = [];
      for(let i = 0; i < n; i++){ if(full(i)) room -= want[i]; else flex.push(i); }
      flex.sort((a, b) => want[a] - want[b]);
      let left = flex.length;
      flex.forEach(i => {
        const share = Math.max(SLIVER_MIN, room / left);
        slots[i] = Math.min(want[i], share);
        room -= slots[i];
        left--;
      });
    }

    let x = 0;
    cards.forEach((c, i) => {
      // closed: every card gathers at the left so the row tucks into the icon
      c.style.setProperty('--x', (isOpen ? x : 0) + 'px');
      // a covered card is cut just past where the next card starts
      const covered = stacked && slots[i] < want[i];
      c.style.setProperty('--cut', covered ? Math.max(0, widths[i] - slots[i] - 10) + 'px' : '-12px');
      c.style.zIndex = i + 1;
      x += slots[i];
    });
    dock.style.setProperty('--dock-w', width + 'px');
  }

  /* ---------- dock: open / close ---------- */
  function setOpen(open){
    clearTimeout(openTimer); clearTimeout(closeTimer);
    if(!dock || open === isOpen) return;
    isOpen = open;
    dock.classList.toggle('open', open);
    dockToggle.setAttribute('aria-expanded', String(open));
    if(!open){
      hoverIndex = -1;
      if(dockTrack.contains(document.activeElement)) dockToggle.focus({ preventScroll:true });
    }
    layoutDock();
  }

  if(dock){
    // Hover the icon to unfold; leave the bar to fold. Short delays stop flicker.
    dockToggle.addEventListener('mouseenter', ()=>{
      clearTimeout(closeTimer);
      if(!isOpen) openTimer = setTimeout(()=> setOpen(true), OPEN_DELAY);
    });
    dock.addEventListener('mouseenter', ()=> clearTimeout(closeTimer));
    dock.addEventListener('mouseleave', ()=>{
      clearTimeout(openTimer);
      if(isOpen) closeTimer = setTimeout(()=> setOpen(false), CLOSE_DELAY);
    });

    // Click opens too. Only a keyboard "click" closes, so a mouse click that
    // lands just after the hover has opened the bar doesn't snap it shut.
    dockToggle.addEventListener('click', (e)=>{
      if(!isOpen) setOpen(true);
      else if(e.detail === 0) setOpen(false);
    });
    dock.addEventListener('keydown', (e)=>{
      if(e.key === 'Escape' && isOpen){ setOpen(false); dockToggle.focus({ preventScroll:true }); }
    });
    dock.addEventListener('focusout', (e)=>{
      if(isOpen && e.relatedTarget && !dock.contains(e.relatedTarget)){
        closeTimer = setTimeout(()=> setOpen(false), CLOSE_DELAY);
      }
    });

    cards.forEach((card, i)=>{
      const bringForward = ()=>{ if(hoverIndex !== i){ hoverIndex = i; layoutDock(); } };
      card.addEventListener('mouseenter', bringForward);
      card.addEventListener('focus', bringForward);
      card.addEventListener('click', (e)=>{
        e.preventDefault();
        const target = document.getElementById(card.dataset.target);
        setOpen(false);
        if(target) target.scrollIntoView({ behavior:'smooth' });
      });
    });
    dockTrack.addEventListener('mouseleave', ()=>{
      if(hoverIndex !== -1 && !dockTrack.contains(document.activeElement)){ hoverIndex = -1; layoutDock(); }
    });
    dockTrack.addEventListener('focusout', (e)=>{
      if(!dockTrack.contains(e.relatedTarget) && hoverIndex !== -1){ hoverIndex = -1; layoutDock(); }
    });

    // Any scroll folds the bar back into the icon.
    window.addEventListener('scroll', ()=>{
      if(Math.abs(window.scrollY - lastY) < 2) return;
      lastY = window.scrollY;
      if(isOpen) setOpen(false);
    }, { passive:true });

    let resizeRaf = 0;
    window.addEventListener('resize', ()=>{
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(layoutDock);
    });
    const onModeChange = ()=>{ if(desktop.matches){ topMenu.classList.remove('open'); layoutDock(); } };
    if(desktop.addEventListener) desktop.addEventListener('change', onModeChange);
    else if(desktop.addListener) desktop.addListener(onModeChange);
    if(document.fonts && document.fonts.ready) document.fonts.ready.then(layoutDock);
    window.addEventListener('load', layoutDock);

    // Start unfolded when the page opens at the top, so the sections are seen once.
    setActive(activeId);
    if(window.scrollY < 8) setOpen(true);
  }

  /* ---------- phone / tablet menu ---------- */
  topLinks.forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      topMenu.classList.remove('open');
      if(target) setTimeout(()=> target.scrollIntoView({ behavior:'smooth' }), 80);
    });
  });

  if(topToggle){
    topToggle.addEventListener('click', ()=>{
      topMenu.classList.toggle('open');
    });
  }
})();
