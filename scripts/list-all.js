const apiKey = process.env.GEMINI_API_KEY || '';

async function listAll() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  if (data.models) {
    console.log('Available models:', data.models.map(m => m.name));
    for (const m of data.models) {
      if (m.supportedGenerationMethods?.includes('generateContent')) {
        console.log('Supports generateContent:', m.name);
      }
    }
  } else {
    console.log('No models:', data);
  }
}

listAll();
