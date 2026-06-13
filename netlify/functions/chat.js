export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  let messages;
  try {
    const body = JSON.parse(event.body || '{}');
    messages = body.messages;
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!Array.isArray(messages) || messages.length === 0) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'messages ist erforderlich und darf nicht leer sein' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY ist nicht konfiguriert' }) };
  }

  const SYS = 'Du bist ein präziser, ADHS-freundlicher Hochschul-Tutor. FORMAT: ## Überschriften, **fett**, Aufzählungen, max. 4 Sätze pro Abschnitt. ⭐ Muss wissen | 💡 Gut zu wissen | 🚨 Klausurrelevant. Auf Deutsch. Präzise wie Professor, verständlich wie Freund.';

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: SYS,
        messages
      })
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: data.error.message || 'Anthropic API Fehler' }) };
    }

    const reply = (data.content || []).map(b => b.text || '').join('') || 'Keine Antwort.';

    return { statusCode: 200, headers, body: JSON.stringify({ reply }) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message || 'Unbekannter Fehler' }) };
  }
}
