import React, { useEffect, useRef, useState } from 'react';
import { mdRender, esc } from '../helpers.js';

export default function ChatSidebar({ concept, messages, busy, onSend }) {
  const [val, setVal] = useState('');
  const taRef = useRef(null);
  const msgsRef = useRef(null);

  useEffect(() => {
    if (msgsRef.current) msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
  }, [messages, busy]);

  const submit = () => {
    const txt = val.trim();
    if (!txt || busy) return;
    setVal('');
    if (taRef.current) taRef.current.style.height = 'auto';
    onSend(txt);
  };

  const quickPrompts = [`Erkläre ${concept.title} einfach`, '🚨 Klausurfragen', 'Beispiel geben', 'Ich bin verwirrt'];

  return (
    <div className="chat-side">
      <div className="chat-hd">
        <div className="chat-online-dot"></div>
        <span>KI-Tutor</span>
        <small>{concept.title}</small>
      </div>
      <div className="chat-msgs" ref={msgsRef}>
        {messages.length === 0 && !busy && (
          <div className="chat-empty">
            Ich bin immer hier.<br />Stell mir eine Frage zu <strong>{concept.title}</strong>. 🤖
          </div>
        )}
        {messages.map((m, i) => (
          <div className={'chat-msg ' + m.role} key={i}>
            <div className="cbbl" dangerouslySetInnerHTML={{ __html: m.role === 'a' ? mdRender(m.text) : esc(m.text) }} />
          </div>
        ))}
        {busy && (
          <div className="chat-msg a">
            <div className="cbbl">
              <div className="chat-typing">
                <div className="tdot"></div><div className="tdot"></div><div className="tdot"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="chat-qps">
        {quickPrompts.map((p, i) => (
          <button className="chat-qp" key={i} onClick={() => onSend(p)}>{p}</button>
        ))}
      </div>
      <div className="chat-inp">
        <textarea
          className="chat-ta"
          rows="1"
          placeholder="Frage stellen…"
          ref={taRef}
          value={val}
          onChange={(e) => {
            setVal(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
        />
        <button className="chat-send" disabled={busy} onClick={submit}>→</button>
      </div>
    </div>
  );
}
