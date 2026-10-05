const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-form-status');
const sendMessage = document.querySelector('#send-message');
const sendLabel = sendMessage.querySelector('span');
let sendingMessage = false;

function setContactStatus(message, state) {
  contactStatus.textContent = message;
  contactStatus.dataset.state = state;
}

// Native submissions return here when JavaScript is unavailable during sending.
if (new URLSearchParams(window.location.search).get('message') === 'sent') {
  setContactStatus('Your message was sent. Thanks for reaching out!', 'success');
  const cleanUrl = new URL(window.location.href);
  cleanUrl.searchParams.delete('message');
  window.history.replaceState(null, '', cleanUrl);
}

contactForm.addEventListener('submit', async event => {
  event.preventDefault();
  if (sendingMessage || !contactForm.reportValidity()) return;

  const fields = new FormData(contactForm);
  // A bot-filled honeypot never triggers a network submission.
  if (fields.get('_honey')) return;
  for (const name of ['name', 'email', 'message']) {
    const value = String(fields.get(name) || '').trim();
    if (!value) {
      setContactStatus('Please fill in your name, email, and message.', 'error');
      return;
    }
    fields.set(name, value);
  }

  sendingMessage = true;
  sendMessage.disabled = true;
  sendLabel.textContent = 'Sending…';
  contactForm.setAttribute('aria-busy', 'true');
  setContactStatus('Sending your message…', 'pending');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const endpoint = new URL(contactForm.action);
    endpoint.pathname = '/ajax' + endpoint.pathname;
    const response = await fetch(endpoint.href, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: fields,
      signal: controller.signal
    });
    const result = await response.json();
    if (!response.ok || (result.success !== true && result.success !== 'true')) {
      throw new Error('The delivery service did not accept the message.');
    }
    contactForm.reset();
    setContactStatus('Your message was sent. Thanks for reaching out!', 'success');
    contactStatus.focus();
  } catch {
    setContactStatus('Your message could not be confirmed. Your text is still here. Try again, or use the email link.', 'error');
    contactStatus.focus();
  } finally {
    clearTimeout(timeout);
    sendingMessage = false;
    sendMessage.disabled = false;
    sendLabel.textContent = 'Send message';
    contactForm.removeAttribute('aria-busy');
  }
});
