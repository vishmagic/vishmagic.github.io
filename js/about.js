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

function renderSelectedWork(work) {
  const itemsOf = cat => work.items.filter(i => i.category === cat.id);

  const rows = work.categories
    .filter(c => c.home === 'list')
    .flatMap(cat => itemsOf(cat).map(item => ({ cat, item })));

  const listHTML = rows.length ? `
    <div class="work-card">
      <div class="section-title">Selected Work</div>
      <ul class="work-list">
        ${rows.map(({ cat, item }) => {
          const pills = [cat.tag || cat.label, ...(item.confidential ? ['Confidential'] : [])];
          return `
          <li>
            <a class="wl-row" href="work.html#${esc(item.slug)}">
              <div class="wl-main">
                <span class="wl-title">${esc(item.title)}</span>
                <div class="wl-pills">${pills.map(p => `<span class="wl-pill">${esc(p)}</span>`).join('')}</div>
              </div>
              <span class="wl-hook">${esc(item.hook)}</span>
              <span class="wl-arrow" aria-hidden="true">\u2192</span>
            </a>
          </li>`;
        }).join('')}
      </ul>
    </div>` : '';

  const playgroundHTML = work.categories
    .filter(c => c.home === 'playground')
    .map(cat => ({ cat, items: itemsOf(cat) }))
    .filter(g => g.items.length)
    .map(({ cat, items }) => `
      <section class="pg-band">
        <div class="pg-eyebrow">${esc(cat.label)}</div>
        <h2 class="pg-heading">${esc(cat.descriptor)}<span class="pg-spark" aria-hidden="true">\u2727</span></h2>
        <div class="pg-grid">
          ${items.map(item => `
            <div class="pg-tile">
              <a class="pg-main" href="work.html#${esc(item.slug)}">
                ${item.homeImage ? `<img src="${esc(item.homeImage.src)}" alt="${esc(item.homeImage.alt || item.title)}" loading="lazy">` : ''}
                ${item.tag ? `<div class="pg-kind">${esc(item.tag)}</div>` : ''}
                <div class="pg-title">${esc(item.title)}<span class="pg-arrow" aria-hidden="true">\u2192</span></div>
                <p class="pg-desc">${esc(item.hook)}</p>
              </a>
              ${item.cta && /^https?:/.test(item.cta.href) ? `<a class="pg-cta" href="${esc(item.cta.href)}" target="_blank" rel="noopener noreferrer">${esc(item.cta.label)} \u2197</a>` : ''}
            </div>`).join('')}
        </div>
      </section>`).join('');

  return listHTML + playgroundHTML;
}

/* ─── Render ────────────────────────────────────────────────── */
async function render() {
  const container = document.getElementById('about');

  try {
    const [res, workRes] = await Promise.all([
      fetch('about.json'),
      fetch('work.json').catch(() => null)
    ]);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const work = workRes && workRes.ok ? await workRes.json() : null;

    const imageHTML = data.image
      ? `<div class="about-image-wrap">
           <img class="about-image" src="${esc(data.image)}" alt="${esc(data.imageAlt || data.name)}">
         </div>`
      : `<div class="about-image-wrap">
           <div class="about-image-placeholder">✦</div>
         </div>`;

    const bioHTML = (data.bio || [])
      .map(p => `<p>${esc(p)}</p>`)
      .join('');

    const linksHTML = (data.links || [])
      .map(l => `<a href="${esc(l.href)}" ${l.href.startsWith('http') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${esc(l.label)}</a>`)
      .join('');

    const contributionsHTML = data.contributions ? `
      <div class="contributions-card">
        <div class="section-title">${esc(data.contributions.title)}</div>
        <img
          class="contributions-image"
          src="${esc(data.contributions.image)}"
          alt="${esc(data.contributions.imageAlt || data.contributions.title)}"
        >
      </div>` : '';

    container.innerHTML = `
      <div class="about-card">
        ${imageHTML}
        <div class="about-content">
          <div class="about-name">${esc(data.name)}</div>
          <div class="about-tagline">${esc(data.tagline)}</div>
          <div class="about-bio">${bioHTML}</div>
          ${linksHTML ? `<div class="about-links">${linksHTML}</div>` : ''}
        </div>
      </div>
      ${work ? renderSelectedWork(work) : ''}
      ${contributionsHTML}`;

    document.title = esc(data.name);
  } catch (err) {
    container.innerHTML = `
      <div style="padding:2rem;color:var(--text-muted);text-align:center;">
        <p>Could not load about data.</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;opacity:0.6;">${esc(err.message)}</p>
      </div>`;
  }
}

render();
