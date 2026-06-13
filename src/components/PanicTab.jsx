import React from 'react';
import { fmt } from '../helpers.js';

export default function PanicTab({ concept, panic, onStart, onFlip, onAnswer }) {
  const cards = concept.cards || [];

  if (!panic.on && !panic.done && panic.score === 0 && panic.idx === 0) {
    return (
      <div className="panic-wrap">
        <div style={{ fontFamily: 'var(--ff)', fontSize: '1.08rem', fontWeight: 300 }}>⚡ Panik-Modus</div>
        <div style={{ fontSize: '.73rem', color: 'var(--t2)', maxWidth: '315px', lineHeight: 1.65 }}>
          30 Sekunden pro Karte. Echter Klausur-Stress-Test — {cards.length} Karten.
        </div>
        <button className="btn-prim" style={{ padding: '.6rem 2.2rem', fontSize: '.8rem' }} onClick={onStart}>Panik-Start ⚡</button>
      </div>
    );
  }

  if (panic.done) {
    const pct = Math.round(panic.score / cards.length * 100);
    return (
      <div className="panic-wrap">
        <div style={{ fontSize: '2rem' }}>{pct === 100 ? '🏆' : pct > 60 ? '💪' : '📚'}</div>
        <div style={{ fontFamily: 'var(--ff)', fontSize: '2.1rem', fontWeight: 300, color: 'var(--amh)' }}>{panic.score}/{cards.length}</div>
        <div style={{ fontSize: '.75rem', color: 'var(--t2)' }}>{pct}% unter Zeitdruck{pct === 100 ? ' — Meisterschaft!' : ' — weiter üben!'}</div>
        <button className="btn-prim" onClick={onStart}>Nochmal</button>
      </div>
    );
  }

  if (panic.on) {
    const card = cards[panic.idx];
    const col = panic.t <= 10 ? 'red' : panic.t <= 20 ? 'warn' : 'ok';
    return (
      <div className="panic-wrap">
        <div className={'panic-timer ' + col}>{fmt(panic.t)}</div>
        <div style={{ fontSize: '.65rem', color: 'var(--t3)' }}>Karte {panic.idx + 1}/{cards.length} · Score: {panic.score}</div>
        <div className="panic-card" onClick={onFlip}>
          {panic.flipped ? <div className="panic-a">{card.a}</div> : <div className="panic-q">{card.q}</div>}
        </div>
        {panic.flipped ? (
          <div className="panic-acts">
            <button className="pbno" onClick={() => onAnswer(false)}>✗ Falsch</button>
            <button className="pbyes" onClick={() => onAnswer(true)}>✓ Richtig</button>
          </div>
        ) : (
          <div style={{ fontSize: '.69rem', color: 'var(--t3)' }}>Tippen zum Aufdecken</div>
        )}
      </div>
    );
  }

  return null;
}
