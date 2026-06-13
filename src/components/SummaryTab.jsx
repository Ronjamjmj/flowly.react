import React from 'react';
import { mdRender } from '../helpers.js';

export default function SummaryTab({ concept, onGenerate }) {
  if (!concept.sum) {
    return (
      <div className="empty">
        Keine Zusammenfassung.<br /><br />
        <button className="btn-prim" onClick={() => onGenerate(`Erstelle eine vollständige Zusammenfassung mit allen Klausurthemen für ${concept.title}`)}>
          Zusammenfassung generieren ✨
        </button>
      </div>
    );
  }
  return <div className="summ" dangerouslySetInnerHTML={{ __html: mdRender(concept.sum) }} />;
}
