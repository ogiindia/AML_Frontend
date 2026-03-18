const ClientAgent = (function () {
  let config = {};
  let sessionId = null;
  let fingerprint = null;

  function generateSessionId() {
    return 'sess_' + Math.random().toString(36).substring(2) + Date.now();
  }

  async function init(userConfig = {}) {
    config = {
      endpoint: '/agent/ping',
      interceptAll: true,
      onChallenge: defaultChallenge,
      onBlock: defaultBlock,
      debug: false,
      ...userConfig
    };

    sessionId = config.sessionId || localStorage.getItem('client-agent-sid') || generateSessionId();
    localStorage.setItem('client-agent-sid', sessionId);

    fingerprint = await generateFingerprint();

    if (config.interceptAll) {
      hookIntoFetch();
      hookIntoXHR();
    }

    const payload = buildPayload();

    if (config.debug) console.log("[ClientAgent] Payload:", payload);

    try {
      const res = await fetch(config.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const verdict = await res.json();
      if (verdict?.status && verdict.status !== 'allow') {
        handleVerdict(verdict);
      }
    } catch (err) {
      if (config.debug) console.warn("[ClientAgent] Backend error:", err);
    }
  }

  function buildPayload() {
    return {
      sessionId,
      fingerprint,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: {
        width: screen.width,
        height: screen.height,
        colorDepth: screen.colorDepth
      },
      behavior: {
        mouseMovements: mouseMoves,
        keystrokes: keystrokes,
        clicks: clickCount,
        scrollDepth: maxScrollDepth,
        touchSupport: 'ontouchstart' in window
      }
    };
  }

  async function generateFingerprint() {
    const raw = [
      navigator.userAgent,
      navigator.language,
      navigator.platform,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen.width,
      screen.height,
      screen.colorDepth
    ].join('|');
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function handleVerdict(verdict) {
    const status = verdict.status;
    const reason = verdict.reasonCode || 'unknown';

    if (status === 'block') {
      config.onBlock(reason);
    } else if (status === 'challenge') {
      config.onChallenge(reason);
    }
  }

  // ---- Basic UI handlers ----
  function defaultChallenge(reason) {
    alert(`⚠️ Verification required: ${reason}`);
    // Could inject CAPTCHA or OTP here
  }

  function defaultBlock(reason) {
    document.body.innerHTML = `<div style="text-align:center;padding:20vh">
      <h1>🚫 Access Denied</h1><p>Reason: ${reason}</p></div>`;
  }

  // ---- Axios / fetch / XHR interception ----
  function hookIntoFetch() {
    const orig = window.fetch;
    window.fetch = async function (...args) {
      const [input, init = {}] = args;

      init.headers = {
        ...(init.headers || {}),
        'X-Session-ID': sessionId,
        'X-Fingerprint': fingerprint
      };

      const res = await orig(input, init).catch(e => Promise.reject(e));
      const clone = res.clone();

      try {
        const data = await clone.json();
        if (data?.verdict) handleVerdict(data.verdict);
      } catch (e) {}

      return res;
    };
  }

  function hookIntoXHR() {
    const orig = window.XMLHttpRequest;
    function CustomXHR() {
      const xhr = new orig();
      const open = xhr.open;
      xhr.open = function (...args) {
        this.addEventListener('readystatechange', function () {
          if (this.readyState === 4) {
            try {
              const data = JSON.parse(this.responseText);
              if (data?.verdict) handleVerdict(data.verdict);
            } catch (e) {}
          }
        });
        open.apply(xhr, args);
      };
      const send = xhr.send;
      xhr.send = function (...args) {
        this.setRequestHeader('X-Session-ID', sessionId);
        this.setRequestHeader('X-Fingerprint', fingerprint);
        send.apply(this, args);
      };
      return xhr;
    }
    window.XMLHttpRequest = CustomXHR;
  }

  // ---- Behavior tracking ----
  let mouseMoves = 0, keystrokes = 0, clickCount = 0, maxScrollDepth = 0;
  window.addEventListener('mousemove', () => mouseMoves++);
  window.addEventListener('keydown', () => keystrokes++);
  window.addEventListener('click', () => clickCount++);
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY + window.innerHeight) / document.body.scrollHeight * 100;
    maxScrollDepth = Math.max(maxScrollDepth, Math.floor(scrollPercent));
  });

  return { init };
})();
