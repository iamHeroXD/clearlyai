const apiKey = process.env.GEMINI_API_KEY || '';

async function testNewModels() {
  const models = ['gemini-3.5-flash-lite', 'gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash'];
  for (const m of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Explain "industries" in one sentence.' }] }]
        })
      });
      const data = await res.json();
      console.log(`[${m}] status: ${res.status}`);
      if (res.ok) {
        console.log('SUCCESS! Text:', data.candidates?.[0]?.content?.parts?.[0]?.text?.trim());
      } else {
        console.log('Error:', data?.error?.message);
      }
    } catch (e) {
      console.log('Err:', e.message);
    }
  }
}

testNewModels();
