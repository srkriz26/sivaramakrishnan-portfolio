// timeline.js — click a company on the rail, detail panel updates. Fully JSON-driven.
(function(){
  function renderDetail(company){
    const detail = document.getElementById('career-detail');
    if(!detail) return;

    const clientsHTML = (company.clients && company.clients.length)
      ? `<div class="career-block reveal in-view">
           <h4>Clients</h4>
           <ul>${company.clients.map(c => `<li>${c}</li>`).join('')}</ul>
         </div>`
      : `<div class="career-block reveal in-view"><h4>Focus</h4><ul><li>Internal delivery &amp; foundation-building</li></ul></div>`;

    const projectsHTML = `<div class="career-block reveal in-view">
        <h4>Projects</h4>
        ${company.projects.map(p => {
          if(typeof p === 'string'){
            return `<div class="career-project"><div class="career-project-name">${p}</div></div>`;
          }
          return `<div class="career-project">
              <div class="career-project-name">${p.name}</div>
              <div class="career-project-detail">${p.detail}</div>
            </div>`;
        }).join('')}
      </div>`;

    const skillsHTML = `<div class="career-block reveal in-view">
        <h4>Skills Applied</h4>
        <div class="stamp-row">${company.skills.map(s => `<span class="stamp on-dark">${s}</span>`).join('')}</div>
      </div>`;

    const achievementsHTML = `<div class="career-block reveal in-view">
        <h4>Achievements</h4>
        <ul>${company.achievements.map(a => `<li>${a}</li>`).join('')}</ul>
      </div>`;

    detail.classList.remove('career-detail-fade');
    // Force reflow so re-adding the animation class replays it
    void detail.offsetWidth;

    detail.innerHTML = `
      <div class="career-detail-head">
        <div class="company-logo-chip">
          <img src="assets/logos/companies/${company.id}.png" alt="${company.name} logo" loading="lazy" onerror="this.parentElement.style.display='none'">
        </div>
        <div>
          <div class="career-detail-period">${company.period}</div>
          <h3>${company.name}</h3>
          <div class="role">${company.role} &middot; ${company.phase}</div>
        </div>
      </div>
      <p class="summary">${company.summary}</p>
      <div class="career-detail-grid">
        ${clientsHTML}
        ${projectsHTML}
        ${skillsHTML}
        ${achievementsHTML}
      </div>
    `;
    detail.classList.add('career-detail-fade');

    if(window.PortfolioAnimations) window.PortfolioAnimations.initReveal();
  }

  function initTimeline(){
    const data = window.TimelineData;
    if(!data) return;
    const rail = document.getElementById('timeline-rail');
    if(!rail) return;

    rail.innerHTML = data.companies.map((c, i) => `
      <div class="timeline-node${i === data.companies.length - 1 ? ' active' : ''}" data-index="${i}" style="--nd:${i * 90}ms" tabindex="0" role="button" aria-label="View ${c.name}">
        <div class="t-year">${c.period}</div>
        <div class="t-company">${c.shortName}</div>
      </div>
    `).join('');

    const nodes = rail.querySelectorAll('.timeline-node');
    nodes.forEach(node => {
      const select = () => {
        nodes.forEach(n => n.classList.remove('active'));
        node.classList.add('active');
        renderDetail(data.companies[parseInt(node.dataset.index, 10)]);
      };
      node.addEventListener('click', select);
      node.addEventListener('keypress', (e)=>{ if(e.key === 'Enter') select(); });
    });

    // Render most recent company by default
    renderDetail(data.companies[data.companies.length - 1]);
  }

  document.addEventListener('DOMContentLoaded', initTimeline);
})();
