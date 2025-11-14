// contentScript.ts
function findApplicationTextareas() {
  return Array.from(document.querySelectorAll('textarea, input'))
    .filter((el) => {
      const node = el as HTMLInputElement | HTMLTextAreaElement;
      const ph = (node.getAttribute('placeholder') || '').toLowerCase();
      const aria = (node.getAttribute('aria-label') || '').toLowerCase();
      return node.tagName === 'TEXTAREA' || ph.includes('why') || aria.includes('why') || ph.includes('experience') || aria.includes('experience');
    }) as (HTMLInputElement | HTMLTextAreaElement)[];
}

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg.type === 'APPLY_ANSWERS' && msg.answers) {
    const fields = findApplicationTextareas();
    fields.forEach((f, i) => {
      const key = `field_${i}`;
      if (msg.answers[key]) {
        f.focus();
        f.value = msg.answers[key];
        f.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    sendResponse({ ok: true });
  }
});
