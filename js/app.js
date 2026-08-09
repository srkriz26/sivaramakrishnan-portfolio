// app.js — bootstraps all JSON-driven sections. Nothing here is hardcoded content;
// every string rendered comes from data/*.json (loaded via the .data.js mirrors).
(function(){

  function renderHero(profile){
    document.getElementById('hero-name').innerHTML =
      profile.name.split(' ').map((w,i,arr)=> i === arr.length-1 ? `<em>${w}</em>` : `<span>${w}</span>`).join(' ');
    document.getElementById('hero-role').textContent = profile.designation;
    document.getElementById('hero-tags').innerHTML = profile.tags.map(t => `<span class="tag">${t}</span>`).join('');
    document.getElementById('hero-photo').src = profile.photo;
    document.getElementById('hero-photo').alt = profile.name;

    const countersEl = document.getElementById('hero-counters');
    countersEl.innerHTML = profile.counters.map(c => {
      const isNumeric = typeof c.value === 'number' && c.value > 0;
      const dataAttrs = isNumeric
        ? `data-value="${c.value}" data-prefix="${c.prefix||''}" data-suffix="${c.suffix||''}"`
        : `data-display="${c.display||''}"`;
      return `<div class="counter" ${dataAttrs}>
        <span class="counter-value">${isNumeric ? (c.prefix||'')+'0'+(c.suffix||'') : (c.display||'')}</span>
        <span class="counter-label">${c.label}</span>
      </div>`;
    }).join('');
  }

  function renderSummary(profile){
    document.getElementById('career-summary-text').textContent = profile.summary;
  }

  function renderLookingFor(profile){
    const lf = profile.lookingFor;
    if(!lf) return;
    document.getElementById('looking-for-heading').textContent = lf.heading;
    document.getElementById('looking-for-narrative').textContent = lf.narrative;
    document.getElementById('looking-for-tags').innerHTML = lf.hashtags
      .map(t => `<span class="hashtag">#${t.replace(/\s+/g,'')}</span>`).join('');
  }

  function renderHighlights(profile){
    const grid = document.getElementById('highlights-grid');
    grid.innerHTML = profile.highlights.map((h, i) => `
      <div class="highlight-card reveal" style="--d:${i * 70}ms">
        <div class="h-num">${String(i+1).padStart(2,'0')}</div>
        ${h.clientId ? `<div class="highlight-logo-chip"><img src="assets/logos/clients/${h.clientId}.png" alt="" loading="lazy" onerror="this.parentElement.remove()"></div>` : ''}
        <h4>${h.title}</h4>
        <p>${h.detail}</p>
        <div class="stamp-row">${h.stamps.map(s => `<span class="stamp">${s}</span>`).join('')}</div>
      </div>
    `).join('');
  }

  function renderClients(clientsData){
    const grid = document.getElementById('client-grid');
    const filters = document.getElementById('client-filters');
    const industries = ['All', ...clientsData.industries.map(i => i.name)];

    filters.innerHTML = industries.map((name, i) =>
      `<button class="filter-btn${i===0?' active':''}" data-industry="${name}">${name}</button>`
    ).join('');

    function draw(filter){
      const list = filter === 'All' ? clientsData.clients : clientsData.clients.filter(c => c.industry === filter);
      grid.innerHTML = list.map((c, i) => `
        <button class="client-card${c.featured ? ' featured' : ''} tilt-card reveal-scale" style="--d:${(i%8) * 55}ms" data-id="${c.id}">
          <div class="client-logo-chip">
            <img src="assets/logos/clients/${c.id}.png" alt="" loading="lazy" onerror="this.parentElement.remove()">
          </div>
          <div class="client-wordmark">${c.name}</div>
          <div class="client-industry">${c.industry}</div>
        </button>
      `).join('');
      if(window.PortfolioAnimations) window.PortfolioAnimations.initReveal();
      attachClientClicks(clientsData);
      attachTilt(grid.querySelectorAll('.tilt-card'));
    }

    filters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', ()=>{
        filters.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
        btn.classList.add('active');
        draw(btn.dataset.industry);
      });
    });

    draw('All');
  }

  function attachTilt(cards){
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(reduced) return;
    cards.forEach(card => {
      card.addEventListener('mousemove', (e)=>{
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const px = (x / rect.width) * 100;
        const py = (y / rect.height) * 100;
        const rotateY = ((x / rect.width) - 0.5) * 10;
        const rotateX = ((y / rect.height) - 0.5) * -10;
        card.style.setProperty('--mx', px + '%');
        card.style.setProperty('--my', py + '%');
        card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });
      card.addEventListener('mouseleave', ()=>{
        card.style.transform = '';
      });
    });
  }

  function attachClientClicks(clientsData){
    document.querySelectorAll('.client-card').forEach(card => {
      card.addEventListener('click', ()=>{
        const client = clientsData.clients.find(c => c.id === card.dataset.id);
        if(client) openClientModal(client);
      });
    });
  }

  function openClientModal(client){
    const overlay = document.getElementById('client-modal');

    const contributionHTML = client.phases
      ? `<div class="modal-field"><h5>Contribution</h5></div>
         <div class="modal-timeline">
           ${client.phases.map(p => `
             <div class="modal-timeline-node">
               <div class="modal-timeline-label">${p.label}</div>
               <p>${p.detail}</p>
             </div>
           `).join('')}
         </div>`
      : `<div class="modal-field"><h5>Contribution</h5><p>${client.contribution}</p></div>`;

    const resultHTML = client.result
      ? `<div class="modal-field"><h5>Result</h5><p>${client.result}</p></div>`
      : '';

    overlay.innerHTML = `
      <div class="modal-box">
        <button class="modal-close" aria-label="Close">&times;</button>
        <h3>${client.name}</h3>
        <div class="modal-industry">${client.industry} &middot; ${client.engagement}</div>
        <div class="modal-field"><h5>Role</h5><p>${client.role}</p></div>
        <div class="modal-field"><h5>Business Challenge</h5><p>${client.challenge}</p></div>
        ${contributionHTML}
        ${resultHTML}
        <div class="modal-field"><h5>Technologies</h5><div class="modal-tech">${client.technologies.map(t=>`<span>${t}</span>`).join('')}</div></div>
      </div>
    `;
    overlay.classList.add('open');
    overlay.querySelector('.modal-close').addEventListener('click', ()=> overlay.classList.remove('open'));
    overlay.addEventListener('click', (e)=>{ if(e.target === overlay) overlay.classList.remove('open'); });
  }

  function renderCompetencies(profile){
    const leadershipGroups = ['Program & Portfolio Leadership', 'Delivery Excellence'];
    const techGroups = ['AI & Digital Transformation', 'Domain Experience', 'Tools & Technology'];

    const buildGroups = (keys) => keys.map(k => `
      <div class="comp-group reveal">
        <h4>${k}</h4>
        <div class="comp-tags">${profile.coreCompetencies[k].map(s => `<span class="comp-tag">${s}</span>`).join('')}</div>
      </div>
    `).join('');

    document.getElementById('leadership-grid').innerHTML = buildGroups(leadershipGroups);
    document.getElementById('technology-grid').innerHTML = buildGroups(techGroups);
  }

  function renderCredentials(profile){
    const list = document.getElementById('credentials-list');
    const eduHTML = profile.qualifications.education.map(e => `
      <div class="cred-item"><span>${e.degree}, ${e.institution}</span><span class="cred-abbr">${e.year}</span></div>
    `).join('');
    const certHTML = profile.qualifications.certifications.map(c => `
      <div class="cred-item"><span>${c.name}</span><span class="cred-abbr">${c.abbr}</span></div>
    `).join('');
    list.innerHTML = `
      <h4>Education</h4>${eduHTML}
      <h4 style="margin-top:22px;">Certifications</h4>${certHTML}
    `;
  }

  function renderContact(profile){
    document.getElementById('contact-list').innerHTML = `
      <a href="mailto:${profile.email}"><span class="c-label">Email</span><span class="c-value">${profile.email}</span></a>
      <a href="tel:${profile.phone}"><span class="c-label">Phone</span><span class="c-value">${profile.phone}</span></a>
      <a href="https://${profile.linkedin}" target="_blank" rel="noopener"><span class="c-label">LinkedIn</span><span class="c-value">${profile.linkedin}</span></a>
      <div><span class="c-label">Location</span><span class="c-value">${profile.location}</span></div>
    `;
  }

  function renderAITeasers(projects){
    const grid = document.getElementById('ai-teaser-grid');
    grid.innerHTML = projects.slice(0,6).map((p, i) => `
      <a class="ai-teaser-card${p.featured ? ' featured' : ''} tilt-card reveal-scale" style="--d:${i*60}ms" href="ai-solutions.html#${p.id}">
        <div class="eyebrow">${p.client}</div>
        <h4>${p.title}</h4>
        <p>${p.tagline}</p>
      </a>
    `).join('');
    if(window.PortfolioAnimations) window.PortfolioAnimations.initReveal();
    attachTilt(grid.querySelectorAll('.tilt-card'));
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    const profile = window.ProfileData;
    const clients = window.ClientsData;
    const projects = window.ProjectsData;

    if(profile){
      renderHero(profile);
      renderSummary(profile);
      renderHighlights(profile);
      renderCompetencies(profile);
      renderCredentials(profile);
      renderContact(profile);
      renderLookingFor(profile);
    }
    if(clients) renderClients(clients);
    if(projects) renderAITeasers(projects.projects);

    if(window.PortfolioAnimations){
      window.PortfolioAnimations.initReveal();
      window.PortfolioAnimations.initCounters();
    }
  });
})();
