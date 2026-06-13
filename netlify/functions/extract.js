

exports.handler = async function(event, context) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Methode nicht erlaubt' }) };
  }

  try {
    const { title, text } = JSON.parse(event.body);

    if (!title || !text) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Titel oder Text fehlt.' }) };
    }

    // Wir rufen den Google Gemini Key ab
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Google Gemini API-Key (GEMINI_API_KEY) ist auf dem Server nicht konfiguriert.' }) };
    }

    const systemPrompt = `Extrahiere 4-6 Schlüsselkonzepte für das Thema "${title}".
    Du musst eine Antwort im reinen, validen JSON-Format ohne Markdown-Verpackung (keine Backticks \`\`\`json) zurückgeben.
    
    Verwende exakt diese JSON-Struktur:
    {
      "concepts": [
        {
          "title": "Name des Konzepts",
          "cat": "Kategorie des Konzepts",
          "diff": 2,
          "sum": "Eine verständliche Zusammenfassung des Konzepts im Markdown-Format (ca. 200 Wörter) mit ## Überschriften",
          "cards": [
            {
              "q": "Eine Lernfrage zum Konzept?",
              "a": "Die Antwort auf die Frage"
            }
          ]
        }
      ]
    }`;

    // Aufruf der offiziellen Google Gemini API (Modell: Gemini 2.5 Flash)
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt },
              { text: `Hier ist der hochgeladene Text, den du analysieren sollst:\n\n${text.slice(0, 15000)}` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        statusCode: response.status, 
        headers, 
        body: JSON.stringify({ error: data.error?.message || 'Fehler von der Gemini-API' }) 
      };
    }

    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';

    // Wir mappen die Antwort in das Anthropic-Format, damit dein React-Code nicht geändert werden muss!
    const mappedResponse = {
      content: [{
        text: geminiText
      }]
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(mappedResponse)
    };
  } catch (error) {
    console.error('Server-Fehler:', error);
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'Interner Server-Fehler: ' + error.message }) };
  }
};