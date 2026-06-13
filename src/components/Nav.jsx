import React from 'react';

export default function Nav({ view, gami, onGoView, onOpenModal }) {
  const pct = Math.round((gami.xp % 500) / 500 * 100);
  return (
    <nav id="nav">
      <div className="nav-brand" onClick={() => onGoView('dash')}>
        <div className="nav-logo">🌊</div>flowly
      </div>
      <div className="nav-tabs">
        <button className={'nav-tab' + (view === 'dash' ? ' on' : '')} onClick={() => onGoView('dash')}>Dashboard</button>
        <button className={'nav-tab' + (view === 'plan' ? ' on' : '')} onClick={() => onGoView('plan')}>Lernplan</button>
      </div>
      <div className="nav-right">
        <div className="streak-pill">🔥 {gami.streak} Tage</div>
        <div className="xp-pill">
          <span style={{ color: 'var(--amh)', fontWeight: 600, fontSize: '.66rem' }}>Lv {gami.level}</span>
          <div className="xp-bar"><div className="xp-fill" style={{ width: pct + '%' }}></div></div>
          <span style={{ fontSize: '.63rem', color: 'var(--t2)' }}>{gami.xp} XP</span>
        </div>
        <button className="btn btn-am" onClick={onOpenModal}>+ Fach</button>
      </div>
    </nav>
  );
}
