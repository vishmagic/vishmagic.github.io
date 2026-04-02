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

/* ─── Render ────────────────────────────────────────────────── */
async function render() {
  const container = document.getElementById('about');

  try {
    const res = await fetch('about.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

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
