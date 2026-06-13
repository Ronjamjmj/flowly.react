import React, { useRef } from 'react';

export default function FilesTab({ concept, onAddFile, onDeleteFile, onUseFile }) {
  const inputRef = useRef(null);
  const dzRef = useRef(null);

  const readFile = (file) => {
    const reader = new FileReader();
    if (file.type.includes('pdf')) {
      reader.readAsDataURL(file);
      reader.onload = () => {
        onAddFile({ name: file.name, size: file.size, type: file.type, b64: reader.result.split(',')[1] });
      };
    } else {
      reader.readAsText(file, 'utf-8');
      reader.onload = () => {
        onAddFile({ name: file.name, size: file.size, type: file.type, text: String(reader.result).slice(0, 12000) });
      };
    }
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    readFile(file);
    e.target.value = '';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dzRef.current?.classList.remove('ov');
    const file = e.dataTransfer.files?.[0];
    if (file) readFile(file);
  };

  const files = concept.files || [];

  return (
    <>
      <div
        className="dz"
        ref={dzRef}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); dzRef.current?.classList.add('ov'); }}
        onDragLeave={() => dzRef.current?.classList.remove('ov')}
        onDrop={handleDrop}
      >
        <div className="dz-ico">📁</div>
        <div style={{ fontSize: '.76rem' }}>PDF, TXT, MD hochladen oder hierhin ziehen</div>
        <div style={{ fontSize: '.61rem', marginTop: '.16rem', opacity: .55 }}>Direkt im KI-Tutor nutzbar</div>
      </div>
      <input type="file" ref={inputRef} accept=".pdf,.txt,.md,.csv" style={{ display: 'none' }} onChange={handleChange} />
      {files.length ? (
        <div className="file-list">
          {files.map((f, i) => (
            <div className="file-item" key={i}>
              <div className="file-ico">{f.type?.includes('pdf') ? '📄' : '📝'}</div>
              <div className="file-name">{f.name}</div>
              <div className="file-meta">{Math.round((f.size || 0) / 1024)}KB</div>
              <div className="file-act">
                <button className="fuse" onClick={() => onUseFile(i)}>Im Chat</button>
                <button className="fdel" onClick={() => onDeleteFile(i)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty">Noch keine Dateien.<br />Lade PDFs oder Texte hoch — direkt im KI-Tutor verfügbar.</div>
      )}
    </>
  );
}
