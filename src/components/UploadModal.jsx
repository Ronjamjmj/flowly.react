import React, { useState } from 'react';

export default function UploadModal({ open, onClose, onSubmit }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const close = () => {
    setTitle('');
    setText('');
    setLoading(false);
    setError('');
    onClose();
  };

  const submit = async () => {
    const t = title.trim();
    const txt = text.trim();
    if (!t || !txt) return;
    setLoading(true);
    setError('');
    try {
      await onSubmit(t, txt);
      close();
    } catch (e) {
      setError(e.message || 'Unbekannter Fehler');
      setLoading(false);
    }
  };

  return (
    <div className={'modal-bg' + (open ? ' on' : '')}>
      <div className="modal">
        <h2>Neues Fach anlegen</h2>
        <p>Skriptinhalt oder Mitschriften einfügen — KI extrahiert Konzepte und erstellt Karteikarten automatisch.</p>
        <input
          placeholder="Fachname (z.B. Wirtschaftsinformatik)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Skriptinhalt, Stichpunkte oder Vorlesungsnotizen hier einfügen…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {loading && (
          <div>
            <div className="ld-bar"><div className="ld-fill"></div></div>
            <div style={{ fontSize: '.66rem', color: 'var(--t2)', textAlign: 'center' }}>KI analysiert Inhalt…</div>
          </div>
        )}
        {error && (
          <div style={{ fontSize: '.68rem', color: 'var(--rd)', marginBottom: '.4rem' }}>Fehler: {error}</div>
        )}
        <div className="modal-row">
          <button className="modal-cl" onClick={close}>Abbrechen</button>
          <button className="modal-ok" disabled={loading} onClick={submit}>Konzepte extrahieren ✨</button>
        </div>
      </div>
    </div>
  );
}
