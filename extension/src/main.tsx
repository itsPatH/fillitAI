import { createRoot } from 'react-dom/client';

function App() {
  const generate = async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => ({ title: document.querySelector('h1')?.textContent || '', desc: Array.from(document.querySelectorAll('.description, .job-description')).map(n=>n.textContent||'').join('\\n') })
    }, (res) => {
      // res[0].result is job context
      const payload = { jobTitle: res?.[0]?.result?.title || '', jobDesc: res?.[0]?.result?.desc || '' };
      chrome.runtime.sendMessage({ type: 'GENERATE', payload }, (resp) => {
        if (resp.answers) {
          // send injection command
          chrome.tabs.sendMessage(tab.id!, { type: 'APPLY_ANSWERS', answers: resp.answers });
        } else {
          alert('AI error: ' + (resp.error || 'no answers'));
        }
      });
    });
  };

  return (
    <div style={{ width: 320, padding: 16 }}>
      <h3>Fill It AI</h3>
      <button onClick={generate}>Generate & Fill</button>
      <small>Preview before submit — always.</small>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<App />);
