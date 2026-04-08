/* ─── Theme ─────────────────────────────────────────────────── */
(function () {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
})();

document.getElementById('theme-toggle').addEventListener('click', () => {
  const html = document.documentElement;
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

/* ─── Helpers ───────────────────────────────────────────────── */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ─── Renderers ─────────────────────────────────────────────── */
function renderHeader(data) {
  const imgHTML = data.meta.image
    ? `<img class="header-image" src="${esc(data.meta.image)}" alt="${esc(data.meta.imageAlt || data.name)}">`
    : '';

  return `
    <header class="resume-header">
      <div class="header-left">
        ${imgHTML}
        <div class="header-name">
          <h1>${esc(data.name)}</h1>
          <div class="title">${esc(data.title)}</div>
        </div>
      </div>
      <div class="header-contact">
        <a href="mailto:${esc(data.contact.email)}">${esc(data.contact.email)}</a>
        <a href="${esc(data.contact.linkedin)}" target="_blank" rel="noopener noreferrer">
          ${esc(data.contact.linkedinLabel)}
        </a>
        <a href="${esc(data.contact.github)}" target="_blank" rel="noopener noreferrer">
          ${esc(data.contact.githubLabel)}
        </a>
      </div>
    </header>`;
}

function renderEducation(education) {
  const entries = education.map(e => `
    <div class="edu-entry">
      <div class="edu-main">
        <div>
          <span class="edu-degree">${esc(e.degree)}</span>
          <span class="edu-field">${esc(e.field)}</span>
        </div>
        <span class="edu-years">${esc(e.years)}</span>
      </div>
      <div class="edu-sub">
        <span>${esc(e.institution)}</span>
        <span>${esc(e.location)}</span>
      </div>
    </div>`).join('');

  return `
    <section class="section">
      <div class="section-title">Education</div>
      ${entries}
    </section>`;
}

function renderSkills(skills) {
  const rows = skills.map(s => `
    <div class="skill-category">${esc(s.category)}</div>
    <div class="skill-items">${s.items.map(i => `<p>${esc(i)}</p>`).join('')}</div>
  `).join('');

  return `
    <section class="section">
      <div class="section-title">Skillset</div>
      <div class="skills-grid">${rows}</div>
    </section>`;
}

function renderAwards(awards) {
  const items = awards.map(a => `<li>${esc(a)}</li>`).join('');
  return `
    <section class="section">
      <div class="section-title">Awards / Certification</div>
      <ul class="awards-list">${items}</ul>
    </section>`;
}

function renderExperience(experience) {
  const entries = experience.map(e => {
    const bullets = e.bullets.map(b => `<li>${esc(b)}</li>`).join('');
    return `
      <div class="exp-entry">
        <div class="exp-header">
          <div class="exp-title-company">
            <span class="exp-title">${esc(e.title)}</span>
            <span class="exp-company">${esc(e.company)}</span>
            ${e.location ? `<span class="exp-location">${esc(e.location)}</span>` : ''}
          </div>
          <span class="exp-period">${esc(e.period)}</span>
        </div>
        <ul class="exp-bullets">${bullets}</ul>
      </div>`;
  }).join('');

  return `
    <section class="section">
      <div class="section-title">Professional Experience</div>
      ${entries}
    </section>`;
}

function renderOtherExperience(other) {
  const items = other.map(o => `
    <div class="other-exp-item">
      <span class="other-title">${esc(o.title)}</span>
      <span class="other-company">${esc(o.company)}</span>
    </div>`).join('');

  return `
    <section class="section">
      <div class="section-title">Other Professional Experience</div>
      <div class="other-exp-list">${items}</div>
    </section>`;
}

/* ─── Main render ───────────────────────────────────────────── */
async function render() {
  const container = document.getElementById('resume');

  try {
    const res = await fetch('resume.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    container.innerHTML =
      renderHeader(data) +
      renderEducation(data.education) +
      renderSkills(data.skills) +
      renderAwards(data.awards) +
      renderExperience(data.experience) +
      renderOtherExperience(data.otherExperience);

    document.title = `${data.name} — ${data.title}`;
  } catch (err) {
    container.innerHTML = `
      <div style="padding:2rem;color:var(--text-muted);text-align:center;">
        <p>Could not load resume data.</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;opacity:0.6;">${esc(err.message)}</p>
      </div>`;
  }
}

render();
