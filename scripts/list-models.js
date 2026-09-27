const apiKey = process.env.GEMINI_API_KEY || '';

async function listModels() {
  for (const v of ['v1beta', 'v1']) {
    try {
      const url = `https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      console.log(`[${v}] List models status: ${res.status}`, JSON.stringify(data).slice(0, 300));
    } catch (err) {
      console.log(`[${v}] List models error:`, err.message);
    }
  }
}

listModels();
