

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
    const { messages } = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'Google Gemini API-Key (GEMINI_API_KEY) fehlt.' }) };
    }

    // Übersetze die Chat-History in das Google Gemini Format (user -> user, assistant -> model)
    const geminiContents = (messages || []).map(msg => {
      const role = msg.role === 'assistant' ? 'model' : 'user';
      return {
        role: role,
        parts: [{ text: msg.content }]
      };
    });

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: geminiContents
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return { 
        statusCode: response.status, 
        headers, 
        body: JSON.stringify({ error: data.error?.message || 'Fehler von Gemini' }) 
      };
    }

    const geminiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'Entschuldigung, ich konnte keine Antwort generieren.';

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