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
/* Inline emphasis: **bold** in data text. */
function rich(str) {
  return esc(str).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
}

/* Highlight standalone numbers (46, 4, 2.5, 80%) in already-escaped text. */
function numbers(html) {
  return html.replace(/(^|[^\w.])(\d[\d,]*(?:\.\d+)?%?)(?!\w)/g, (m, pre, num) => `${pre}<span class="work-num">${num}</span>`);
}

function winsHTML(items) {
  return `<ul class="work-wins">${items.map(o => `<li>${numbers(rich(o))}</li>`).join('')}</ul>`;
}

function renderNav(groups, activeSlug) {
  return groups.map(({ cat, items }) => `
    <div class="wn-group">
      <div class="wn-label">${esc(cat.label)}</div>
      ${items.map(i => `
        <a class="wn-link${i.slug === activeSlug ? ' active' : ''}" href="#${esc(i.slug)}">${esc(i.title)}</a>`).join('')}
    </div>`).join('');
}

function renderWhy(why) {
  if (!why) return '';
  const frame = why.frame ? `<p class="work-frame">${rich(why.frame)}</p>` : '';
  const insight = why.insight ? `
    <div class="work-callout">
      <div class="work-callout-label">${esc(why.insightLabel || 'Key insight')}</div>
      <p>${rich(why.insight)}</p>
    </div>` : '';
  return `
    <section class="section">
      <div class="section-title">Why</div>
      ${why.insightFirst ? insight + frame : frame + insight}
      ${why.quote ? `
        <blockquote class="work-quote">${esc(why.quote)}
          ${why.attribution ? `<cite>${esc(why.attribution)}</cite>` : ''}
        </blockquote>` : ''}
    </section>`;
}

function renderPhases(phases) {
  if (!phases || !phases.length) return '';
  const cards = phases.map((p, i) => `
    <div class="wp-card">
      <div class="wp-space">Phase ${i + 1} &middot; ${esc(p.space)}</div>
      <div class="wp-name">${esc(p.name)}</div>
      <ul class="wp-outcomes">${p.outcomes.map(o => `<li>${esc(o)}</li>`).join('')}</ul>
    </div>`).join('');
  return `
    <section class="section">
      <div class="section-title">Phases</div>
      <div class="work-phases">${cards}</div>
    </section>`;
}

function renderOutcomes(outcomes) {
  if (!outcomes || !outcomes.length) return '';
  return `
    <section class="section">
      <div class="section-title">Outcomes</div>
      ${winsHTML(outcomes)}
    </section>`;
}

function renderCalls(calls) {
  if (!calls || !calls.length) return '';
  const items = calls.map(c => `
    <div class="wc-item">
      <div class="wc-label">${esc(c.label)}</div>
      <div class="wc-body">
        <p class="wc-text">${rich(c.text)}</p>
        <p class="wc-learning"><strong>Learning</strong> ${rich(c.learning)}</p>
      </div>
    </div>`).join('');
  return `
    <section class="section">
      <div class="section-title">Judgment calls</div>
      ${items}
    </section>`;
}

function figuresHTML(visuals) {
  return `<div class="work-visuals">${visuals.map(v => `
    <figure class="work-figure"${v.maxWidth ? ` style="max-width:${Number(v.maxWidth)}px"` : ''}>
      <a class="work-zoom" href="${esc(v.src)}" target="_blank" rel="noopener noreferrer"><img src="${esc(v.src)}" alt="${esc(v.alt || v.caption || '')}"></a>
      ${v.caption ? `<figcaption>${esc(v.caption)}</figcaption>` : ''}
    </figure>`).join('')}</div>`;
}

function renderVisuals(visuals) {
  if (!visuals || !visuals.length) return '';
  return `
    <section class="section">
      <div class="section-title">Snapshots</div>
      ${figuresHTML(visuals)}
    </section>`;
}

function renderCards(cards, columns) {
  if (!cards || !cards.length) return '';
  const style = columns ? ` style="grid-template-columns: repeat(${Number(columns)}, 1fr)"` : '';
  return `<div class="work-cards"${style}>${cards.map(c => `
    <div class="wk-card">
      <div class="wk-label">${esc(c.label)}</div>
      <p>${rich(c.text)}</p>
    </div>`).join('')}</div>`;
}

function renderTable(t) {
  if (!t) return '';
  const head = t.columns.map(c => `<th>${esc(c)}</th>`).join('');
  const body = t.rows.map(r => `<tr>${r.map(c => `<td${/^-?\d+(\.\d+)?%?$/.test(c) ? ' class="cell-num"' : ''}>${esc(c)}</td>`).join('')}</tr>`).join('');
  return `
    <div class="work-table-wrap">
      <table class="work-table"><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table>
      ${t.caption ? `<p class="work-caption">${esc(t.caption)}</p>` : ''}
    </div>`;
}

function renderRecord(r) {
  if (!r) return '';
  return `
    <div class="work-record">
      ${r.title ? `<div class="work-record-title">${esc(r.title)}</div>` : ''}
      <dl>${r.fields.map(f => `
        <div class="wr-row"><dt>${esc(f.key)}</dt><dd>${esc(f.value)}</dd></div>`).join('')}
      </dl>
    </div>`;
}

function renderSections(sections) {
  if (!sections || !sections.length) return '';
  return sections.map(s => `
    <section class="section work-sec">
      <div class="section-title">${esc(s.title)}</div>
      ${s.callout ? `<div class="work-callout">${s.calloutLabel ? `<div class="work-callout-label">${esc(s.calloutLabel)}</div>` : ''}<p>${rich(s.callout)}</p></div>` : ''}
      ${(s.paragraphs || []).map(p => `<p class="work-frame">${rich(p)}</p>`).join('')}
      ${renderCards(s.cards, s.columns)}
      ${renderTable(s.table)}
      ${renderRecord(s.record)}
      ${s.list && s.list.length ? (s.variant === 'outcomes' ? winsHTML(s.list) : `<ul class="work-outcomes">${s.list.map(i => `<li>${rich(i)}</li>`).join('')}</ul>`) : ''}
      ${s.visuals && s.visuals.length ? figuresHTML(s.visuals) : ''}
    </section>`).join('');
}

function renderItem(item, cat) {
  const stats = (item.stats || []).map(s => `
    <div class="ws">
      <div class="ws-value">${esc(s.value)}</div>
      <div class="ws-label">${esc(s.label)}</div>
    </div>`).join('');

  return `
    <article>
      <div class="work-eyebrow">
        <span>${esc(cat.label)}</span>
        ${item.confidential ? '<span class="work-badge">Confidential</span>' : (item.tag ? `<span class="work-badge">${esc(item.tag)}</span>` : '')}
      </div>
      <h1 class="work-title">${esc(item.title)}</h1>
      <p class="work-hook">${esc(item.hook)}</p>
      ${item.role ? `<p class="work-role"><strong>Role</strong> ${esc(item.role)}</p>` : ''}
      ${stats ? `<div class="work-stats">${stats}</div>` : ''}
      ${renderWhy(item.why)}
      ${renderPhases(item.phases)}
      ${renderOutcomes(item.outcomes)}
      ${renderCalls(item.judgmentCalls)}
      ${renderSections(item.sections)}
      ${renderVisuals(item.visuals)}
      ${item.cta ? `
        <div class="work-cta">
          <a href="${esc(item.cta.href)}"${/^https?:/.test(item.cta.href) ? ' target="_blank" rel="noopener noreferrer"' : ''}>${esc(item.cta.label)}</a>
          <span>${item.confidential ? 'This work is under NDA. The full story is in the deck.' : ''}</span>
        </div>` : ''}
    </article>`;
}

/* ─── Main render ───────────────────────────────────────────── */
async function render() {
  const container = document.getElementById('work');

  try {
    const res = await fetch('work.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    const groups = data.categories
      .map(cat => ({ cat, items: data.items.filter(i => i.category === cat.id) }))
      .filter(g => g.items.length);

    if (!groups.length) throw new Error('No work items found');

    function show() {
      const slug = decodeURIComponent(location.hash.slice(1));
      const item = data.items.find(i => i.slug === slug) || groups[0].items[0];
      const cat = data.categories.find(c => c.id === item.category);

      container.innerHTML = `
        <div class="work-layout">
          <aside class="work-nav" aria-label="Selected work"><div class="work-nav-inner">${renderNav(groups, item.slug)}</div></aside>
          <div class="work-content">${renderItem(item, cat)}</div>
        </div>`;

      document.title = `${item.title} \u2014 Work`;
    }

    window.addEventListener('hashchange', () => {
      show();
      window.scrollTo(0, 0);
    });
    show();
  } catch (err) {
    container.innerHTML = `
      <div style="padding:2rem;color:var(--text-muted);text-align:center;">
        <p>Could not load work data.</p>
        <p style="font-size:0.8rem;margin-top:0.5rem;opacity:0.6;">${esc(err.message)}</p>
      </div>`;
  }
}

render();
