import React from 'react';

const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];
const WEEK_MIN = [45, 60, 30, 75, 50, 90, 0];

export default function LearningPlan({ subjects, onOpenConcept }) {
  const all = [];
  subjects.forEach(s => s.concepts.forEach(c => all.push({ c, s })));
  const ready = all.filter(({ c }) => c.mem >= 0.75).length;
  const urgent = all.filter(({ c }) => c.mem < 0.4).length;
  const maxM = Math.max(...WEEK_MIN);

  return (
    <div className="plan-w">
      <div className="plan-hd">
        <h1>Lernplan & Klausurvorbereitung</h1>
        <p>Personalisiert auf deinen Fortschritt — {all.length} Konzepte über {subjects.length} Fächer</p>
      </div>
      <div className="plan-scores">
        <div className="pscore"><div className="pscore-n" style={{ color: 'var(--sgh)' }}>{ready}</div><div className="pscore-l">Klausur-bereit</div></div>
        <div className="pscore"><div className="pscore-n" style={{ color: 'var(--amh)' }}>{all.length - ready - urgent}</div><div className="pscore-l">In Bearbeitung</div></div>
        <div className="pscore"><div className="pscore-n" style={{ color: 'var(--rd)' }}>{urgent}</div><div className="pscore-l">Dringend üben</div></div>
      </div>
      <div className="plan-weekly">
        <h3>Empfohlene Lernzeit — diese Woche</h3>
        <div className="week-grid">
          {DAYS.map((d, i) => (
            <div className="wday" key={d}>
              <div className="wday-lbl">{d}</div>
              <div className="wday-bar">
                <div className="wday-fill" style={{
                  height: (maxM ? Math.round(WEEK_MIN[i] / maxM * 100) : 0) + '%',
                  background: WEEK_MIN[i] > 60 ? 'var(--am)' : WEEK_MIN[i] > 0 ? 'var(--sg)' : 'var(--s3)'
                }}></div>
              </div>
              <div className="wday-min">{WEEK_MIN[i] ? WEEK_MIN[i] + 'm' : '—'}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="plan-subj">
        {subjects.map(s => {
          const avg = s.concepts.reduce((a, c) => a + c.mem, 0) / s.concepts.length;
          const est = s.concepts.reduce((a, c) => a + c.diff * (1 - c.mem) * 1.5, 0).toFixed(1);
          const fc = s.hue === 'am' ? 'var(--am)' : s.hue === 'sg' ? 'var(--sg)' : 'var(--lv)';
          const sorted = [...s.concepts].sort((a, b) => a.mem - b.mem);
          return (
            <div className="psubj" key={s.id}>
              <div className="psubj-hd">
                <div className="psubj-left">
                  <div className="psubj-ico">{s.icon}</div>
                  <div>
                    <div className="psubj-tt">{s.title}</div>
                    <div className="psubj-meta">{s.studyMin} Min. gelernt · ~{est} Std. noch empfohlen</div>
                  </div>
                </div>
                <div className="psubj-readiness">{Math.round(avg * 100)}%</div>
              </div>
              <div className="psubj-bar"><div className="psubj-fill" style={{ width: Math.round(avg * 100) + '%', background: fc }}></div></div>
              <div className="concept-rows">
                {sorted.map(c => {
                  const est2 = (c.diff * (1 - c.mem) * 1.5).toFixed(1);
                  const tag = c.mem >= 0.75 ? { t: '✓ Bereit', cl: 'hi' } : c.mem >= 0.4 ? { t: '~ Üben', cl: 'md' } : { t: '! Dringend', cl: 'lo' };
                  return (
                    <div className="crow" key={c.id} onClick={() => onOpenConcept(s.id, c.id)}>
                      <div className="crow-dot" style={{ background: c.mem < 0.4 ? 'var(--rd)' : c.mem < 0.75 ? 'var(--amh)' : 'var(--sgh)' }}></div>
                      <div className="crow-t">{c.title}</div>
                      <div className="crow-est">~{est2}h</div>
                      <div className={'crow-tag ' + tag.cl}>{tag.t}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
