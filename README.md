# flowly 🌊

ADHS-freundliche Lernplattform für Wirtschaftsinformatik-Studenten — React + Vite, deploybar auf Netlify.

## Struktur

- `src/App.jsx` — Hauptkomponente, State-Management, Routing
- `src/App.css` — Alle Styles (identisch zum Original-Design)
- `src/components/` — UI-Komponenten (Dashboard, Mindmap, ConceptDetail, etc.)
- `src/data.js` — Initiale Demo-Daten (Fächer, Konzepte, Gamification)
- `src/helpers.js` — Markdown-Rendering, Formatierungs-Helfer
- `netlify/functions/extract.js` — Serverless Function: extrahiert Konzepte via Claude API
- `netlify/functions/chat.js` — Serverless Function: KI-Tutor-Chat via Claude API

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Hinweis: Die Netlify Functions laufen lokal nicht automatisch mit `vite dev`. Für lokales Testen der Functions:

```bash
npm i -g netlify-cli
netlify dev
```

## Deployment auf Netlify

1. Repository zu Netlify verbinden (oder `netlify deploy --prod`)
2. Build-Settings werden automatisch aus `netlify.toml` übernommen:
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions: `netlify/functions`
3. **Wichtig:** Unter Site configuration → Environment variables eine Variable `ANTHROPIC_API_KEY` mit deinem Anthropic API-Key hinterlegen.

Danach läuft die App vollständig — KI-Tutor-Chat und Konzept-Extraktion laufen über die Serverless Functions, kein CORS-Problem mehr.
