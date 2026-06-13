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

  let title, text;
  try {
    const body = JSON.parse(event.body || '{}');
    title = body.title;
    text = body.text;
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!title || !text) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: 'title und text sind erforderlich' }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY ist nicht konfiguriert' }) };
  }

  const systemPrompt = 'Extrahiere Lernkonzepte. Antworte AUSSCHLIESSLICH mit validem JSON, ohne Markdown-Codeblöcke, ohne Erklärungen, ohne einleitenden oder abschließenden Text.';

  const userPrompt = `Extrahiere 4-6 Schlüsselkonzepte für "${title}". Antworte NUR mit reinem JSON in exakt diesem Format:
{"concepts":[{"title":"Name","cat":"Kategorie","diff":2,"sum":"Markdown ca. 200 Wörter mit ## Headings","cards":[{"q":"Frage?","a":"Antwort"},{"q":"F2?","a":"A2"},{"q":"F3?","a":"A3"}]}]}

Text:
${text.slice(0, 4000)}`;

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
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: data.error.message || 'Anthropic API Fehler' }) };
    }

    let raw = (data.content || []).map(b => b.text || '').join('') || '{}';
    raw = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'Konnte KI-Antwort nicht als JSON parsen' }) };
    }

    return { statusCode: 200, headers, body: JSON.stringify(parsed) };
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: e.message || 'Unbekannter Fehler' }) };
  }
}
