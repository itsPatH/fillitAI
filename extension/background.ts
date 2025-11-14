chrome.runtime.onMessage.addListener(async (msg, _sender, sendResponse) => {
  if (msg.type === 'GENERATE') {
    const backend = (await chrome.storage.sync.get('backendUrl')).backendUrl || 'http://localhost:3000';
    try {
      const res = await fetch(`${backend}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(msg.payload)
      });
      const json = await res.json();
      sendResponse(json);
    } catch (err) {
      sendResponse({ error: true, details: String(err) });
    }
    return true;
  }
});
