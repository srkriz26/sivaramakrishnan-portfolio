// navigation.js — spine active-state tracking + mobile menu
(function(){
  const sections = document.querySelectorAll('main .section, #home');
  const spineLinks = document.querySelectorAll('.spine-link');
  const topLinks = document.querySelectorAll('.topnav-menu a');
  const topToggle = document.querySelector('.topnav-toggle');
  const topMenu = document.querySelector('.topnav-menu');

  function setActive(id){
    spineLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
    topLinks.forEach(l => l.classList.toggle('active', l.dataset.target === id));
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

  spineLinks.forEach(link=>{
    link.addEventListener('click', (e)=>{
      e.preventDefault();
      const target = document.getElementById(link.dataset.target);
      if(target) target.scrollIntoView({ behavior:'smooth' });
    });
  });

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
