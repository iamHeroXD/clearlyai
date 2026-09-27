const apiKey = process.env.GEMINI_API_KEY || '';

async function testModels() {
  const models = [
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-2.0-flash',
    'gemini-2.0-flash-exp',
    'gemini-1.5-pro',
    'gemini-pro'
  ];

  for (const m of models) {
    for (const v of ['v1beta', 'v1']) {
      try {
        const url = `https://generativelanguage.googleapis.com/${v}/models/${m}:generateContent?key=${apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hello' }] }]
          })
        });
        const data = await res.json();
        console.log(`[${v}] ${m} status: ${res.status}`, res.ok ? 'SUCCESS!' : data?.error?.message || data);
      } catch (err) {
        console.log(`[${v}] ${m} fetch error:`, err.message);
      }
    }
  }
}

testModels();
