// ai-solutions.js — renders each AI case study as a consulting-grade infographic.
// All copy comes from data/projects.json; this file only builds the visual structure.
(function(){

  function byId(id){ return (window.ProjectsData.projects || []).find(p => p.id === id); }

  function narrativeBlock(label, text){
    if(!text) return '';
    return `<div class="narr-block reveal"><h4>${label}</h4><p>${text}</p></div>`;
  }

  /* ---------------- Delivery Ledger & Last-Mile Intelligence ---------------- */
  function renderRouteIntelligence(){
    const p = byId('route-intelligence');
    if(!p) return;
    const root = document.getElementById('case-route-intelligence');

    const concept = p.concept ? `
      <div class="case-concept reveal">
        <div class="case-concept-label">${p.concept.label}</div>
        ${p.concept.note ? `<div class="case-concept-note">${p.concept.note}</div>` : ''}
        <div class="case-narrative">
          ${narrativeBlock('The Problem', p.concept.problem)}
          ${narrativeBlock('The Approach', p.concept.approach)}
        </div>
        <div class="case-narrative" style="margin-top:8px; margin-bottom:0;">
          ${narrativeBlock('Design Philosophy', p.concept.philosophy)}
        </div>
        ${p.concept.infographic ? `
          <figure class="case-infographic">
            <img src="${p.concept.infographic}" alt="Driver Delivery Ledger V1 functional overview infographic" loading="lazy">
            <figcaption>Driver Delivery Ledger — V1 functional overview</figcaption>
          </figure>
        ` : ''}
      </div>
      <div class="case-concept-label reveal" style="margin:0 0 28px;">Client Engagement — Route &amp; Last-Mile Intelligence (Delivered)</div>
    ` : '';

    const narrative = `
      <div class="case-narrative">
        ${narrativeBlock('The Cost Problem', p.situation)}
        ${narrativeBlock('The Decision', p.decision)}
      </div>
      <div class="case-narrative" style="margin-bottom:8px;">
        ${narrativeBlock('Governance', p.governance)}
        ${narrativeBlock('Result', p.result)}
      </div>
    `;

    const infographic = p.infographic ? `
      <figure class="case-infographic">
        <img src="${p.infographic}" alt="Truck-specific route intelligence infographic" loading="lazy">
        <figcaption>Truck-specific route intelligence — satellite + AI powered delivery</figcaption>
      </figure>
    ` : '';

    const flow = `
      <div class="flow-diagram">
        <div class="flow-node diagram-step">Customer places shipment</div>
        <div class="flow-connector diagram-step"></div>
        <div class="flow-node diagram-step">Google Routes API</div>
        <div class="flow-connector diagram-step"></div>
        <div class="flow-node diagram-step">Truck Profile Assessment</div>
        <div class="flow-connector diagram-step"></div>
        <div class="flow-node decision diagram-step">AI Decision Engine</div>
        <div class="flow-connector diagram-step"></div>
        <div class="flow-branch">
          <div class="flow-branch-col">
            <div class="flow-node diagram-step">Simple Route</div>
            <div class="flow-connector diagram-step"></div>
            <div class="flow-node diagram-step">Normal Routing</div>
          </div>
          <div class="flow-branch-col">
            <div class="flow-node diagram-step">Complex Route</div>
            <div class="flow-connector diagram-step"></div>
            <div class="flow-node diagram-step">Satellite + Gemini Vision</div>
          </div>
        </div>
        <div class="flow-connector diagram-step"></div>
        <div class="flow-node diagram-step">AI Validation</div>
        <div class="flow-connector diagram-step"></div>
        <div class="flow-node governance pulse-governance diagram-step">Human Review</div>
        <div class="flow-connector diagram-step"></div>
        <div class="flow-node diagram-step" style="border-color:var(--brass); color:var(--brass);">Final Optimized Route</div>
      </div>
    `;

    const opt = `
      <h4 class="narr-title reveal" style="font-family:var(--font-mono); font-size:0.68rem; letter-spacing:0.1em; text-transform:uppercase; color:var(--brass); margin:8px 0 18px;">How the AI cost was optimized</h4>
      <div class="opt-grid">
        ${p.costOptimization.map((c,i) => `
          <div class="opt-card reveal" style="--d:${i*80}ms">
            <div class="opt-num">0${i+1}</div>
            <h5>${c.title}</h5>
            <p>${c.detail}</p>
          </div>
        `).join('')}
      </div>
    `;

    const learning = `<div class="case-learning reveal"><h4>Takeaway</h4><p>${p.learning}</p></div>`;

    root.innerHTML = `
      <div class="case-head reveal">
        <div class="case-client">${p.client}</div>
        <h3 class="case-title">${p.title}</h3>
        <div class="case-tagline">${p.tagline}</div>
      </div>
      ${concept}
      ${narrative}
      ${infographic}
      ${flow}
      ${opt}
      ${learning}
    `;
  }

  /* ---------------- Inventory Replenishment ---------------- */
  function renderInventory(){
    const p = byId('inventory-replenishment');
    if(!p) return;
    const root = document.getElementById('case-inventory-replenishment');

    const narrative = `
      <div class="case-narrative">
        ${narrativeBlock('Situation', p.situation)}
        ${narrativeBlock('Action', p.action)}
      </div>
      <div class="case-narrative">
        ${narrativeBlock('The Complication', p.complication)}
        ${narrativeBlock('Reassessment', p.reassessment)}
      </div>
    `;

    const pipeline = `
      <div class="pipeline">
        ${p.pipeline.map((step,i) => `<span class="pipeline-step diagram-step" style="--d:${i*40}ms">${step}</span>${i < p.pipeline.length-1 ? '<span class="pipeline-arrow">→</span>':''}`).join('')}
      </div>
    `;

    const genai = p.architectures.genai;
    const pred = p.architectures.predictive;
    const archCompare = `
      <div class="arch-compare">
        <div class="arch-col reveal">
          <h5>${genai.label}</h5>
          ${genai.flow.map(f => `<div class="arch-flow-item">${f}</div>`).join('')}
          <p class="arch-note">${genai.costDriver}</p>
        </div>
        <div class="arch-col highlight reveal">
          <h5>${pred.label}</h5>
          ${pred.flow.map(f => `<div class="arch-flow-item">${f}</div>`).join('')}
          <p class="arch-note">Techniques: ${pred.techniques.join(', ')}</p>
        </div>
      </div>
    `;

    const table = `
      <table class="compare-table reveal">
        <thead><tr><th>Dimension</th><th>GenAI Approach</th><th>Predictive Analytics</th></tr></thead>
        <tbody>
          ${p.comparison.map(row => `<tr><td>${row.dimension}</td><td>${row.ai}</td><td>${row.predictive}</td></tr>`).join('')}
        </tbody>
      </table>
    `;

    const result = `<div class="case-narrative" style="grid-template-columns:1fr;">${narrativeBlock('Result', p.result)}</div>`;
    const learning = `<div class="case-learning reveal"><h4>Takeaway</h4><p>${p.learning}</p></div>`;

    root.innerHTML = `
      <div class="case-head reveal">
        <div class="case-client">${p.client}</div>
        <h3 class="case-title">${p.title}</h3>
        <div class="case-tagline">${p.tagline}</div>
      </div>
      ${narrative}
      ${pipeline}
      ${archCompare}
      ${table}
      ${result}
      ${learning}
    `;
  }

  /* ---------------- Shopper Assistant ---------------- */
  function renderShopper(){
    const p = byId('shopper-assistant');
    if(!p) return;
    const root = document.getElementById('case-shopper-assistant');

    const narrative = `
      <div class="case-narrative">
        ${narrativeBlock('Situation', p.situation)}
        ${narrativeBlock('Action', p.action)}
      </div>
    `;

    const phone = `
      <div class="phone-wrap">
        <div class="phone">
          <div class="phone-notch"></div>
          <div class="phone-screen">
            ${p.journey.map(m => `<div class="phone-msg ${m.role} diagram-step">${m.text}</div>`).join('')}
          </div>
        </div>
      </div>
    `;

    const result = `<div class="case-narrative" style="grid-template-columns:1fr;">${narrativeBlock('Result', p.result)}</div>`;

    root.innerHTML = `
      <div class="case-head reveal">
        <div class="case-client">${p.client}</div>
        <h3 class="case-title">${p.title}</h3>
        <div class="case-tagline">${p.tagline}</div>
      </div>
      ${narrative}
      ${phone}
      ${result}
    `;
  }

  /* ---------------- PM Agents ---------------- */
  function renderPMAgents(){
    const p = byId('pm-agents');
    if(!p) return;
    const root = document.getElementById('case-pm-agents');

    const narrative = `<div class="case-narrative" style="grid-template-columns:1fr;">${narrativeBlock('Situation', p.situation)}</div>`;

    const dashboard = `
      <div class="dashboard reveal">
        <div class="dashboard-head">Project Manager — Agent Console</div>
        <div class="agent-list">
          ${p.agents.map((a, i) => `
            <div class="agent-tile" data-index="${i}">
              <h5>${a.name}</h5>
              <div class="agent-hint">Click to view inputs, prompt &amp; output ▾</div>
              <div class="agent-detail">
                <div class="agent-detail-field"><h6>Inputs</h6><p>${a.inputs}</p></div>
                <div class="agent-detail-field"><h6>Prompt</h6><p>&ldquo;${a.prompt}&rdquo;</p></div>
                <div class="agent-detail-field"><h6>Output</h6><p>${a.output}</p></div>
                <div class="agent-detail-field"><h6>Business Value</h6><p>${a.value}</p></div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="agent-also">${p.alsoIncludesNote}</div>
      </div>
    `;

    root.innerHTML = `
      <div class="case-head reveal">
        <div class="case-client">${p.client}</div>
        <h3 class="case-title">${p.title}</h3>
        <div class="case-tagline">${p.tagline}</div>
      </div>
      ${narrative}
      ${dashboard}
    `;

    root.querySelectorAll('.agent-tile').forEach(tile => {
      tile.addEventListener('click', ()=> tile.classList.toggle('open'));
    });
  }

  /* ---------------- Financial Recommendation Engine ---------------- */
  function renderFinancial(){
    const p = byId('financial-recommendation');
    if(!p) return;
    const root = document.getElementById('case-financial-recommendation');

    const narrative = `
      <div class="case-narrative">
        ${narrativeBlock('Situation', p.situation)}
        ${narrativeBlock('Action', p.action)}
      </div>
    `;

    const arch = `
      <div class="arch-strip">
        ${p.architecture.map((a,i) => `<span class="arch-chip diagram-step" style="--d:${i*70}ms">${a}</span>`).join('')}
      </div>
    `;

    const result = `<div class="case-narrative" style="grid-template-columns:1fr;">${narrativeBlock('Result', p.result)}</div>`;
    const learning = `<div class="case-learning reveal"><h4>Takeaway</h4><p>${p.learning}</p></div>`;

    root.innerHTML = `
      <div class="case-head reveal">
        <div class="case-client">${p.client}</div>
        <h3 class="case-title">${p.title}</h3>
        <div class="case-tagline">${p.tagline}</div>
      </div>
      ${narrative}
      ${arch}
      ${result}
      ${learning}
    `;
  }

  /* ---------------- Headless 360 ---------------- */
  function renderHeadless(){
    const p = byId('headless-360');
    if(!p) return;
    const root = document.getElementById('case-headless-360');

    const narrative = `
      <div class="case-narrative">
        ${narrativeBlock('Situation', p.situation)}
        ${narrativeBlock('Action', p.action)}
      </div>
      <div class="case-narrative" style="grid-template-columns:1fr;">
        ${narrativeBlock('Value', p.value)}
      </div>
    `;

    root.innerHTML = `
      <div class="case-head reveal">
        <div class="case-client">${p.client}</div>
        <h3 class="case-title">${p.title}</h3>
        <div class="case-tagline">${p.tagline}</div>
      </div>
      ${narrative}
    `;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    renderRouteIntelligence();
    renderInventory();
    renderShopper();
    renderPMAgents();
    renderFinancial();
    renderHeadless();

    if(window.PortfolioAnimations) window.PortfolioAnimations.initReveal();

    // Also reveal diagram-step elements (separate class used inside diagrams)
    const steps = document.querySelectorAll('.diagram-step');
    if('IntersectionObserver' in window){
      const obs = new IntersectionObserver((entries)=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){ entry.target.classList.add('in-view'); obs.unobserve(entry.target); }
        });
      }, { threshold:0.2 });
      steps.forEach(s => obs.observe(s));
    } else {
      steps.forEach(s => s.classList.add('in-view'));
    }
  });
})();
