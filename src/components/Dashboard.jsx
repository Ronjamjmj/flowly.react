import React from 'react';
import { SOCIALS } from '../data.js';

export default function Dashboard({ subjects, gami, onOpenSubject, onOpenConcept, onOpenModal }) {
  const h = new Date().getHours();
  const greet = h < 12 ? 'Guten Morgen' : h < 17 ? 'Guten Tag' : 'Guten Abend';
  const totC = subjects.reduce((a, s) => a + s.concepts.length, 0);
  const pct = Math.round((gami.xp % 500) / 500 * 100);

  const badges = [];
  if (gami.streak >= 1) badges.push({ t: `🔥 ${gami.streak}d Streak`, c: 'badge-gold' });
  if (gami.cardsReviewed >= 50) badges.push({ t: '🃏 50 Karten', c: 'badge-green' });
  if (gami.totalMin >= 100) badges.push({ t: '⏱ 100 Min', c: 'badge-green' });
  if (gami.level >= 2) badges.push({ t: `⭐ Lv ${gami.level}`, c: 'badge-gold' });

  const urg = [];
  subjects.forEach(s => s.concepts.forEach(c => { if (c.mem < 0.5) urg.push({ c, s }); }));

  return (
    <div className="dash-w">
      <div className="hero">
        <div className="hero-text">
          <h1>{greet}, <em>Lernende.</em></h1>
          <p>Heute schon {gami.totalMin} Minuten gelernt.</p>
        </div>
        <div className="hero-xp">
          <div className="hero-xp-row">
            <span>Level <strong>{gami.level}</strong></span>
            <span><strong>{gami.xp}</strong> / <strong>{gami.level * 500}</strong> XP</span>
          </div>
          <div className="hero-xp-bar"><div className="hero-xp-fill" style={{ width: pct + '%' }}></div></div>
          <div className="hero-badges">
            {badges.map((b, i) => <span key={i} className={'badge ' + b.c}>{b.t}</span>)}
          </div>
        </div>
      </div>

      <div className="stat-row">
        <div className="stat"><div className="stat-n am">{gami.totalMin}</div><div className="stat-l">Lernminuten</div></div>
        <div className="stat"><div className="stat-n">{gami.cardsReviewed}</div><div className="stat-l">Karten geübt</div></div>
        <div className="stat"><div className="stat-n">{totC}</div><div className="stat-l">Konzepte</div></div>
        <div className="stat"><div className="stat-n">{subjects.length}</div><div className="stat-l">Fächer</div></div>
      </div>

      <div className="sec">
        <div className="sec-hd"><h2>🟢 Online — lern mit anderen</h2></div>
        <div className="live-row">
          {SOCIALS.map((u, i) => (
            <div className="live-chip" key={i}>
              <div className="live-dot"></div>
              <div>
                <div style={{ fontWeight: 500, color: 'var(--t1)' }}>{u.name}</div>
                <div style={{ fontSize: '.61rem', color: 'var(--t3)' }}>{u.sub} · {u.min} Min.</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {urg.length > 0 && (
        <div className="sec">
          <div className="sec-hd"><h2>⚠ Dringend wiederholen</h2><small>Gedächtnisstärke niedrig</small></div>
          <div className="urg-list">
            {urg.slice(0, 4).map(({ c, s }) => {
              const col = c.mem < 0.3 ? 'var(--rd)' : 'var(--amh)';
              return (
                <div className="urg-item" key={c.id} onClick={() => onOpenConcept(s.id, c.id)}>
                  <div className="urg-dot" style={{ background: col }}></div>
                  <div className="urg-t">{c.title}</div>
                  <div className="urg-s">{s.title}</div>
                  <div className="urg-bar"><div className="urg-fill" style={{ width: Math.round(c.mem * 100) + '%', background: col }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="sec">
        <div className="sec-hd"><h2>Meine Fächer</h2><small>{subjects.length} Fächer</small></div>
        <div className="subj-grid">
          {subjects.map(s => {
            const avg = s.concepts.reduce((a, c) => a + c.mem, 0) / s.concepts.length;
            return (
              <div className={'scard ' + s.hue} key={s.id} onClick={() => onOpenSubject(s.id)}>
                <span className="scard-ico">{s.icon}</span>
                <div className="scard-t">{s.title}</div>
                <div className="scard-sub">{s.folder} · {s.concepts.length} Konzepte</div>
                <div className="scard-foot">
                  <div className="scard-info">{s.studyMin} Min · {Math.round(avg * 100)}%</div>
                  <div className="scard-pbar"><div className="scard-pfill" style={{ width: Math.round(avg * 100) + '%' }}></div></div>
                </div>
              </div>
            );
          })}
          <div className="scard-add" onClick={onOpenModal}>
            <span style={{ fontSize: '1.4rem' }}>+</span>
            <span>Neues Fach</span>
          </div>
        </div>
      </div>
    </div>
  );
}
