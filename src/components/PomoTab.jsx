import React from 'react';
import { fmt } from '../helpers.js';

export default function PomoTab({ pomo, onSetTime, onStart, onStop }) {
  const C = 2 * Math.PI * 62;
  const fi = C * (pomo.t / pomo.dur);

  return (
    <div className="pomo-wrap">
      <div className="pomo-opts">
        {[[25, '25 Min'], [45, '45 Min'], [50, '50 Min']].map(([m, l]) => (
          <button key={m} className={'pomo-opt' + (pomo.dur === m * 60 ? ' on' : '')} onClick={() => onSetTime(m)}>{l}</button>
        ))}
      </div>
      <div className="pomo-ring">
        <svg width="155" height="155" viewBox="0 0 155 155" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="77.5" cy="77.5" r="62" strokeWidth="7" stroke="var(--s3)" fill="none" />
          <circle cx="77.5" cy="77.5" r="62" strokeWidth="7" stroke="var(--am)" fill="none"
            strokeLinecap="round" strokeDasharray={C.toFixed(1)} strokeDashoffset={(C - fi).toFixed(1)}
            style={{ transition: 'stroke-dashoffset .8s linear' }} />
        </svg>
        <div className="pomo-cen">
          <div className="pomo-time">{fmt(pomo.t)}</div>
          <div className="pomo-phase">{pomo.phase}</div>
        </div>
      </div>
      <div className="pomo-acts">
        {pomo.on ? (
          <button className="btn-ghost" onClick={onStop}>■ Stop</button>
        ) : (
          <button className="btn-prim" style={{ padding: '.53rem 2rem' }} onClick={onStart}>▶ Start</button>
        )}
      </div>
      {pomo.sess > 0 && <div className="pomo-sess">{pomo.sess} Session{pomo.sess > 1 ? 's' : ''} abgeschlossen 🎉</div>}
    </div>
  );
}
