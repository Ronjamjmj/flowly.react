import React from 'react';
import FilesTab from './FilesTab.jsx';
import SummaryTab from './SummaryTab.jsx';
import FlashcardsTab from './FlashcardsTab.jsx';
import PanicTab from './PanicTab.jsx';
import PomoTab from './PomoTab.jsx';
import ChatSidebar from './ChatSidebar.jsx';

const TABS = [
  { key: 'files', label: '📁 Dateien' },
  { key: 'summary', label: '📄 Zusammenfassung' },
  { key: 'cards', label: '🃏 Karteikarten' },
  { key: 'panic', label: '⚡ Panik-Modus' },
  { key: 'pomo', label: '⏱ Pomodoro' }
];

export default function ConceptDetail({
  subject, concept, activeTab, onSwitchTab, onBackToMap,
  onAddFile, onDeleteFile, onUseFile, onGenerateSummary,
  fc, onFlipFC, onAnswerFC, onResetFC,
  panic, onStartPanic, onFlipPanic, onAnswerPanic,
  pomo, onSetPomoTime, onStartPomo, onStopPomo,
  chatMessages, chatBusy, onSendChat
}) {
  if (!subject || !concept) return null;

  const lvl = concept.mem < 0.4 ? 'lo' : concept.mem < 0.7 ? 'md' : 'hi';
  const lvlSym = concept.mem < 0.4 ? '!' : concept.mem < 0.7 ? '~' : '✓';

  return (
    <div className="cdet-shell">
      <div className="cdet-main">
        <div className="cdet-hd">
          <div className={'cdet-lvl ' + lvl}>{lvlSym}</div>
          <div className="cdet-info">
            <div className="cdet-t">{concept.title}</div>
            <div className="cdet-meta">
              <span>{concept.cat}</span><span>·</span>
              <span>{'●'.repeat(concept.diff) + '○'.repeat(5 - concept.diff)}</span><span>·</span>
              <span className="cdet-back" onClick={onBackToMap}>← Zurück zur Mindmap</span>
            </div>
          </div>
        </div>
        <div className="ctabs">
          {TABS.map(t => (
            <button key={t.key} className={'ctab' + (activeTab === t.key ? ' on' : '')} onClick={() => onSwitchTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ctab-body">
          {activeTab === 'files' && (
            <FilesTab concept={concept} onAddFile={onAddFile} onDeleteFile={onDeleteFile} onUseFile={onUseFile} />
          )}
          {activeTab === 'summary' && (
            <SummaryTab concept={concept} onGenerate={onGenerateSummary} />
          )}
          {activeTab === 'cards' && (
            <FlashcardsTab concept={concept} fc={fc} onFlip={onFlipFC} onAnswer={onAnswerFC} onReset={onResetFC} />
          )}
          {activeTab === 'panic' && (
            <PanicTab concept={concept} panic={panic} onStart={onStartPanic} onFlip={onFlipPanic} onAnswer={onAnswerPanic} />
          )}
          {activeTab === 'pomo' && (
            <PomoTab pomo={pomo} onSetTime={onSetPomoTime} onStart={onStartPomo} onStop={onStopPomo} />
          )}
        </div>
      </div>
      <ChatSidebar concept={concept} messages={chatMessages} busy={chatBusy} onSend={onSendChat} />
    </div>
  );
}
