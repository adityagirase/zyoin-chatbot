module.exports = async function handler(req, res) {
  // CORS headers — allow the dashboard to call this endpoint
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const GROQ_API_KEY = process.env.GROQ_API_KEY;
  if (!GROQ_API_KEY) return res.status(500).json({ error: 'GROQ_API_KEY not set in environment variables' });

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }
    }

    const { messages = [], system = '' } = body || {};
    if (!Array.isArray(messages)) return res.status(400).json({ error: '`messages` must be an array' });

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',   // free, fast, excellent quality
        max_tokens: 1024,
        temperature: 0.5,
        messages: [
          { role: 'system', content: system },
          ...messages
        ],
      }),
    });

    if (!groqRes.ok) {
      let err;
      try {
        err = await groqRes.json();
      } catch {
        err = { message: await groqRes.text() };
      }
      const msg =
        err?.error?.message ||
        err?.message ||
        (typeof err === 'string' ? err : null) ||
        'Upstream Groq API error';
      return res.status(groqRes.status).json({ error: msg });
    }

    const data = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content || 'No response from Groq.';
    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Groq proxy error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err.message });
  }
}
