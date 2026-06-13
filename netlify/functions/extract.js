

exports.handler = async function(event, context) {
    // CORS-Header setzen
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
  
      // Abrufen und Bereinigen des API-Keys
      let apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return { 
          statusCode: 500, 
          headers, 
          body: JSON.stringify({ error: 'System-Fehler: Der API-Key (GEMINI_API_KEY) wurde auf Netlify nicht gefunden. Bitte trage ihn in den Site-Einstellungen ein.' }) 
        };
      }
  
      // Eventuelle Anführungszeichen oder Leerzeichen entfernen, die beim Kopieren reingesprungen sind
      apiKey = apiKey.replace(/['"‘“\s]/g, '').trim();
  
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
  
      // Der API-Key wird hier explizit als Query-Parameter an die Google-Schnittstelle übergeben
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
      const response = await fetch(url, {
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
        // Wenn Google einen Fehler meldet, geben wir diesen detailliert aus, um das Debugging zu erleichtern
        console.error("Google API Fehler-Details:", data);
        return { 
          statusCode: response.status, 
          headers, 
          body: JSON.stringify({ 
            error: data.error?.message || 'Google API verweigert den Zugriff. Bitte überprüfe den GEMINI_API_KEY im Netlify Dashboard.' 
          }) 
        };
      }
  
      const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
  
      // Verpackung für das React-Frontend
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