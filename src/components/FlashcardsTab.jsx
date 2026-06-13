import React from 'react';

export default function FlashcardsTab({ concept, fc, onFlip, onAnswer, onReset }) {
  const cards = concept.cards || [];

  if (fc.done) {
    const cor = fc.res.filter(Boolean).length;
    const pct = Math.round(cor / cards.length * 100);
    return (
      <div className="fc-done">
        <div style={{ fontSize: '2rem', marginBottom: '.28rem' }}>{pct === 100 ? '🏆' : pct > 60 ? '💪' : '📚'}</div>
        <div className="fc-done-sc">{cor}/{cards.length}</div>
        <div className="fc-done-msg">
          {pct === 100 ? 'Perfekt! Klausur-bereit.' : pct > 60 ? `${pct}% — gut, übe die falschen nochmal.` : `${pct}% — weiter üben!`}
        </div>
        <button className="btn-prim" onClick={onReset}>Nochmal üben</button>
      </div>
    );
  }

  const card = cards[fc.idx];
  if (!card) return <div className="empty">Keine Karteikarten.</div>;

  const pct = Math.round(fc.idx / cards.length * 100);
  const cor = fc.res.filter(Boolean).length;

  return (
    <>
      <div className="fc-prog">
        <span style={{ fontWeight: 500, minWidth: '48px' }}>{fc.idx + 1} / {cards.length}</span>
        <div className="fc-pb"><div className="fc-pbf" style={{ width: pct + '%' }}></div></div>
        <span style={{ minWidth: '40px', textAlign: 'right' }}>{fc.res.length ? Math.round(cor / fc.res.length * 100) + '% ✓' : '—'}</span>
      </div>
      <div className="fc-scene" onClick={onFlip}>
        <div className={'fc-inner' + (fc.flipped ? ' flipped' : '')}>
          <div className="fc-face fc-front">
            <div className="fc-lbl">Frage</div>
            <div className="fc-q">{card.q}</div>
            <div className="fc-hint">Tippen zum Aufdecken</div>
          </div>
          <div className="fc-face fc-back">
            <div className="fc-lbl">Antwort</div>
            <div className="fc-a">{card.a}</div>
          </div>
        </div>
      </div>
      {fc.flipped ? (
        <div className="fc-acts">
          <button className="fc-no" onClick={() => onAnswer(false)}>✗ Nicht gewusst</button>
          <button className="fc-yes" onClick={() => onAnswer(true)}>✓ Gewusst</button>
        </div>
      ) : (
        <div style={{ fontSize: '.69rem', color: 'var(--t3)', textAlign: 'center' }}>Karte umdrehen, dann bewerten</div>
      )}
    </>
  );
}
