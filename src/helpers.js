export function fmt(s) {
  return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
}

export function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function mdRender(t) {
  if (!t) return '';
  t = t.replace(/\|(.+)\|\n\|[-| :]+\|\n((?:\|.+\|\n?)+)/g, (_, h, r) => {
    const ths = h.split('|').filter(s => s.trim()).map(s => `<th>${s.trim()}</th>`).join('');
    const trs = r.trim().split('\n').map(row => `<tr>${row.split('|').filter(s => s.trim()).map(s => `<td>${s.trim()}</td>`).join('')}</tr>`).join('');
    return `<table><thead><tr>${ths}</tr></thead><tbody>${trs}</tbody></table>`;
  });
  t = t.replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>');
  t = t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
  t = t.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
  t = t.replace(/```[\w]*\n?([\s\S]+?)```/g, '<pre><code>$1</code></pre>');
  t = t.replace(/`([^`]+)`/g, '<code style="background:var(--s3);padding:.07rem .27rem;border-radius:4px;font-size:.78em;font-family:monospace">$1</code>');
  t = t.replace(/^[-*] (.+)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>\n?)+/g, m => `<ul>${m}</ul>`);
  t = t.split('\n\n').map(p => {
    p = p.trim();
    if (!p) return '';
    if (/^<(h[23]|ul|table|blockquote|pre)/.test(p)) return p;
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');
  return t;
}
