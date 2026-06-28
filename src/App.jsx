import React, { useState, useRef, useCallback } from 'react';
import Nav from './components/Nav.jsx';
import Dashboard from './components/Dashboard.jsx';
import Mindmap from './components/Mindmap.jsx';
import ConceptDetail from './components/ConceptDetail.jsx';
import LearningPlan from './components/LearningPlan.jsx';
import UploadModal from './components/UploadModal.jsx';
import Toast from './components/Toast.jsx';
import { initialSubjects, initialGami, ICONS, HUES } from './data.js';
import { fmt } from './helpers.js';

export default function App() {
  
  const [subjects, setSubjects] = useState(initialSubjects);
  const [gami, setGami] = useState(initialGami);
  const [view, setView] = useState('dash');
  const [subjId, setSubjId] = useState(null);
  const [conceptId, setConceptId] = useState(null);
  const [activeTab, setActiveTab] = useState('files');
  const [modalOpen, setModalOpen] = useState(false);

  const [toast, setToast] = useState({ msg: '', show: false });
  const toastTimer = useRef(null);

  // chat state
  const [chatHist, setChatHist] = useState([]); // raw API history {role, content}
  const [chatMessages, setChatMessages] = useState([]); // display {role:'u'|'a', text}
  const [chatBusy, setChatBusy] = useState(false);

  // flashcards state
  const [fc, setFc] = useState({ idx: 0, flipped: false, res: [], done: false });

  // panic state
  const [panic, setPanic] = useState({ on: false, idx: 0, score: 0, flipped: false, t: 30, done: false });
  const panicIv = useRef(null);

  // pomodoro state
  const [pomo, setPomo] = useState({ dur: 25 * 60, t: 25 * 60, on: false, phase: 'Fokus', sess: 0 });
  const pomoIv = useRef(null);

  // ---------- helpers ----------
  const showToast = useCallback((msg) => {
    setToast({ msg, show: true });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, show: false })), 2200);
  }, []);

  const addXP = useCallback((n, lbl) => {
    setGami(g => {
      const xp = g.xp + n;
      const nl = Math.floor(xp / 500) + 1;
      if (nl > g.level) {
        showToast(`🎉 Level ${nl} erreicht! +${n} XP`);
      } else {
        showToast(`+${n} XP · ${lbl}`);
      }
      return { ...g, xp, level: Math.max(nl, g.level) };
    });
  }, [showToast]);

  const getSC = useCallback(() => {
    const s = subjects.find(x => x.id === subjId);
    const c = s?.concepts.find(x => x.id === conceptId);
    return { s, c };
  }, [subjects, subjId, conceptId]);

  // mutate a concept immutably
  const updateConcept = useCallback((sId, cId, updater) => {
    setSubjects(prev => prev.map(s => {
      if (s.id !== sId) return s;
      return {
        ...s,
        concepts: s.concepts.map(c => c.id === cId ? updater(c) : c)
      };
    }));
  }, []);

  // ---------- routing ----------
  const goView = (v) => {
    clearInterval(panicIv.current);
    clearInterval(pomoIv.current);
    setView(v);
  };

  const openSubject = (id) => {
    setSubjId(id);
    setView('map');
  };

  const openConcept = (sId, cId) => {
    setSubjId(sId);
    setConceptId(cId);
    setChatHist([]);
    setChatMessages([]);
    setChatBusy(false);
    setFc({ idx: 0, flipped: false, res: [], done: false });
    setPanic({ on: false, idx: 0, score: 0, flipped: false, t: 30, done: false });
    clearInterval(panicIv.current);
    clearInterval(pomoIv.current);
    setPomo(p => ({ ...p, on: false, t: p.dur, phase: 'Fokus' }));
    setActiveTab('files');
    setView('concept');
  };

  const backToMap = () => {
    clearInterval(panicIv.current);
    clearInterval(pomoIv.current);
    setView('map');
  };

  // ---------- chat ----------
  const sendChatWith = async (txt, fileCtx) => {
    if (chatBusy) return;
    const { c } = getSC();
    if (!c) return;

    setChatMessages(msgs => [...msgs, { role: 'u', text: txt }]);
    setChatBusy(true);

    const full = fileCtx ? fileCtx + '\n\n' + txt : `[Konzept: ${c.title || ''}] ${txt}`;
    const newHist = [...chatHist, { role: 'user', content: full }];
    setChatHist(newHist);

    try {
      const r = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newHist })
      });
      const d = await r.json();
      if (d.error) throw new Error(d.error);
      const rep = d.reply || 'Keine Antwort.';
      setChatHist(h => [...h, { role: 'assistant', content: rep }]);
      setChatMessages(msgs => [...msgs, { role: 'a', text: rep }]);
      addXP(8, 'Tutor gefragt');
    } catch (e) {
      setChatMessages(msgs => [...msgs, { role: 'a', text: 'Fehler: ' + e.message }]);
    }
    setChatBusy(false);
  };

  // ---------- files ----------
  const addFile = (f) => {
    const { s, c } = getSC();
    if (!s || !c) return;
    updateConcept(s.id, c.id, cc => ({ ...cc, files: [...(cc.files || []), f] }));
    showToast('📁 Datei hochgeladen');
  };
  const deleteFile = (idx) => {
    const { s, c } = getSC();
    if (!s || !c) return;
    updateConcept(s.id, c.id, cc => ({ ...cc, files: (cc.files || []).filter((_, i) => i !== idx) }));
  };
  const useFile = (idx) => {
    const { c } = getSC();
    if (!c) return;
    const f = (c.files || [])[idx];
    if (!f) return;
    sendChatWith(`Fasse die wichtigsten Klausur-relevanten Punkte aus "${f.name}" zusammen.`, f.text ? `[Datei: ${f.name}]\n\n${f.text.slice(0, 4000)}` : '');
  };

  // ---------- flashcards ----------
  const flipFC = () => setFc(f => ({ ...f, flipped: !f.flipped }));
  const answerFC = (ok) => {
    const { s, c } = getSC();
    if (!c) return;
    setFc(f => {
      const res = [...f.res, ok];
      const done = f.idx + 1 >= c.cards.length;
      const next = done ? f.idx : f.idx + 1;
      const tot = res.length, cor2 = res.filter(Boolean).length;
      const newMem = tot > 0 ? Math.max(0.05, Math.min(0.98, 0.2 + (cor2 / tot) * 0.75)) : c.mem;
      updateConcept(s.id, c.id, cc => ({ ...cc, mem: newMem }));
      if (done && cor2 === c.cards.length) {
        setTimeout(() => addXP(50, 'Perfektes Deck!'), 0);
      }
      return { idx: next, flipped: false, res, done };
    });
    setGami(g => ({ ...g, cardsReviewed: g.cardsReviewed + 1 }));
    addXP(ok ? 15 : 5, ok ? 'Richtige Antwort' : 'Karte geübt');
  };
  const resetFC = () => setFc({ idx: 0, flipped: false, res: [], done: false });

  // ---------- panic ----------
  const tickPanic = () => {
    setPanic(p => {
      const t = p.t - 1;
      if (t <= 0) {
        clearInterval(panicIv.current);
        // trigger wrong answer
        setTimeout(() => answerPanic(false), 0);
        return { ...p, t: 0 };
      }
      return { ...p, t };
    });
  };

  const startPanic = () => {
    const { c } = getSC();
    if (!c) return;
    clearInterval(panicIv.current);
    setPanic({ on: true, idx: 0, score: 0, flipped: false, t: 30, done: false });
    panicIv.current = setInterval(tickPanic, 1000);
  };

  const flipPanic = () => setPanic(p => ({ ...p, flipped: !p.flipped }));

  const answerPanic = (ok) => {
    clearInterval(panicIv.current);
    const { c } = getSC();
    if (!c) return;
    if (ok) addXP(12, 'Panik-Karte');
    setPanic(p => {
      const score = ok ? p.score + 1 : p.score;
      const nx = p.idx + 1;
      if (nx >= (c.cards || []).length) {
        return { ...p, on: false, done: true, score };
      }
      panicIv.current = setInterval(tickPanic, 1000);
      return { ...p, idx: nx, flipped: false, t: 30, score };
    });
  };

  // ---------- pomodoro ----------
  const setPomoT = (min) => {
    if (pomo.on) return;
    clearInterval(pomoIv.current);
    setPomo(p => ({ ...p, dur: min * 60, t: min * 60, phase: 'Fokus' }));
  };

  const tickPomo = () => {
    setPomo(p => {
      const t = p.t - 1;
      if (t <= 0) {
        clearInterval(pomoIv.current);
        setGami(g => ({ ...g, totalMin: g.totalMin + Math.round(p.dur / 60) }));
        setTimeout(() => addXP(30, 'Pomodoro abgeschlossen'), 0);
        return { ...p, t: p.dur, on: false, sess: p.sess + 1, phase: 'Pause ☕' };
      }
      return { ...p, t };
    });
  };

  const startPomo = () => {
    setPomo(p => ({ ...p, on: true }));
    pomoIv.current = setInterval(tickPomo, 1000);
  };

  const stopPomo = () => {
    clearInterval(pomoIv.current);
    setPomo(p => ({ ...p, on: false, t: p.dur, phase: 'Fokus' }));
  };

  // ---------- upload / extract ----------
  const doUpload = async (title, text) => {
    const r = await fetch('/.netlify/functions/extract', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, text })
    });
    const d = await r.json();
    if (d.error) throw new Error(d.error);

    const concepts = (d.concepts || []).map((c, i) => ({
      id: 'c' + Date.now() + i,
      title: c.title || 'Konzept',
      cat: c.cat || 'Allgemein',
      diff: c.diff || 2,
      mem: .2,
      studyMin: 0,
      files: [],
      sum: c.sum || '',
      cards: (c.cards || []).map(k => ({ q: k.q || '', a: k.a || '', cor: 0, inc: 0 }))
    }));

    setSubjects(prev => [...prev, {
      id: 's' + Date.now(),
      title,
      icon: ICONS[prev.length % ICONS.length],
      hue: HUES[prev.length % 3],
      folder: 'Meine Fächer',
      studyMin: 0,
      concepts
    }]);

    addXP(100, 'Neues Fach!');
  };

  // ---------- render ----------
  const { s: currentSubject, c: currentConcept } = getSC();

  return (
    <>
      <Nav view={view} gami={gami} onGoView={goView} onOpenModal={() => setModalOpen(true)} />
      <div id="shell">
        <div className={'view' + (view === 'dash' ? ' on' : '')} id="view-dash">
          {view === 'dash' && (
            <Dashboard
              subjects={subjects}
              gami={gami}
              onOpenSubject={openSubject}
              onOpenConcept={openConcept}
              onOpenModal={() => setModalOpen(true)}
            />
          )}
        </div>

        <div className={'view' + (view === 'map' ? ' on' : '')} id="view-map" style={{ overflow: 'hidden' }}>
          {view === 'map' && (
            <Mindmap subject={currentSubject} onGoView={goView} onOpenConcept={openConcept} />
          )}
        </div>

        <div className={'view' + (view === 'concept' ? ' on' : '')} id="view-concept" style={{ overflow: 'hidden' }}>
          {view === 'concept' && currentConcept && (
            <ConceptDetail
              subject={currentSubject}
              concept={currentConcept}
              activeTab={activeTab}
              onSwitchTab={setActiveTab}
              onBackToMap={backToMap}
              onAddFile={addFile}
              onDeleteFile={deleteFile}
              onUseFile={useFile}
              onGenerateSummary={sendChatWith}
              fc={fc}
              onFlipFC={flipFC}
              onAnswerFC={answerFC}
              onResetFC={resetFC}
              panic={panic}
              onStartPanic={startPanic}
              onFlipPanic={flipPanic}
              onAnswerPanic={answerPanic}
              pomo={pomo}
              onSetPomoTime={setPomoT}
              onStartPomo={startPomo}
              onStopPomo={stopPomo}
              chatMessages={chatMessages}
              chatBusy={chatBusy}
              onSendChat={sendChatWith}
            />
          )}
        </div>

        <div className={'view' + (view === 'plan' ? ' on' : '')} id="view-plan">
          {view === 'plan' && (
            <LearningPlan subjects={subjects} onOpenConcept={openConcept} />
          )}
        </div>
      </div>

      <UploadModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={doUpload} />
      <Toast message={toast.msg} show={toast.show} />
    </>
  );
}
