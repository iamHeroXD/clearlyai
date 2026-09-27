const apiKey = process.env.GEMINI_API_KEY || '';

async function testWorking() {
  const models = ['gemini-flash-latest', 'gemini-2.5-flash-lite', 'gemini-3.7-flash', 'gemini-2.5-flash'];
  for (const m of models) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: 'Explain "industries" simply.' }] }]
        })
      });
      const data = await res.json();
      console.log(`[${m}] status: ${res.status}`);
      if (res.ok) {
        console.log('Sample text:', data.candidates?.[0]?.content?.parts?.[0]?.text?.slice(0, 100));
      } else {
        console.log('Error:', data);
      }
    } catch (e) {
      console.log('Err:', e.message);
    }
  }
}

testWorking();
