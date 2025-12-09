// STACKS Demo Injector
// Paste this entire script in DevTools console on quailridgebooks.com
// Then use the control panel to inject the Discover widget

(function() {
  const CONFIG = {
    iframeUrl: 'https://bookstore-stacks.vercel.app/quail',
    inlineHeight: '500px',
    modalWidth: '90vw',
    modalHeight: '85vh',
  };

  // Track injected elements for reset
  let injectedElements = [];
  let pickerMode = null;
  let pickerOverlay = null;

  // Create control panel
  const panel = document.createElement('div');
  panel.id = 'stacks-demo-panel';
  panel.innerHTML = `
    <div style="
      position: fixed;
      top: 20px;
      right: 20px;
      background: #1a1a1a;
      color: white;
      padding: 16px;
      border-radius: 12px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      font-size: 14px;
      z-index: 999999;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      min-width: 200px;
      cursor: move;
    ">
      <div style="font-weight: 600; margin-bottom: 12px; font-size: 13px; color: #888;">
        📚 STACKS Demo Injector
      </div>
      <button id="stacks-btn-search" style="
        display: block; width: 100%; padding: 10px; margin-bottom: 8px;
        background: #3b82f6; color: white; border: none; border-radius: 6px;
        cursor: pointer; font-size: 13px; font-weight: 500;
      ">Replace Search</button>
      <button id="stacks-btn-float" style="
        display: block; width: 100%; padding: 10px; margin-bottom: 8px;
        background: #8b5cf6; color: white; border: none; border-radius: 6px;
        cursor: pointer; font-size: 13px; font-weight: 500;
      ">Floating Button</button>
      <button id="stacks-btn-inline" style="
        display: block; width: 100%; padding: 10px; margin-bottom: 16px;
        background: #10b981; color: white; border: none; border-radius: 6px;
        cursor: pointer; font-size: 13px; font-weight: 500;
      ">Inline Section</button>
      <button id="stacks-btn-reset" style="
        display: block; width: 100%; padding: 8px;
        background: transparent; color: #888; border: 1px solid #444; border-radius: 6px;
        cursor: pointer; font-size: 12px;
      ">Reset Page</button>
      <div style="margin-top: 12px; font-size: 11px; color: #666;">
        Ctrl+Shift+H to hide/show
      </div>
    </div>
  `;
  document.body.appendChild(panel);
  injectedElements.push(panel);

  // Make panel draggable
  const panelInner = panel.firstElementChild;
  let isDragging = false, offsetX, offsetY;
  panelInner.addEventListener('mousedown', (e) => {
    if (e.target.tagName === 'BUTTON') return;
    isDragging = true;
    offsetX = e.clientX - panelInner.getBoundingClientRect().left;
    offsetY = e.clientY - panelInner.getBoundingClientRect().top;
  });
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    panelInner.style.left = (e.clientX - offsetX) + 'px';
    panelInner.style.top = (e.clientY - offsetY) + 'px';
    panelInner.style.right = 'auto';
  });
  document.addEventListener('mouseup', () => isDragging = false);

  // Toggle panel visibility
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'H') {
      panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    }
    if (e.key === 'Escape' && pickerMode) {
      cancelPicker();
    }
  });

  // Create iframe helper
  function createIframe(width = '100%', height = CONFIG.inlineHeight) {
    const iframe = document.createElement('iframe');
    iframe.src = CONFIG.iframeUrl;
    iframe.style.cssText = `
      border: none;
      width: ${width};
      height: ${height};
      border-radius: 8px;
      background: white;
    `;
    iframe.className = 'stacks-injected';
    return iframe;
  }

  // Element picker for manual selection
  function startPicker(mode, callback) {
    pickerMode = mode;
    pickerOverlay = document.createElement('div');
    pickerOverlay.id = 'stacks-picker-overlay';
    pickerOverlay.innerHTML = `
      <div style="
        position: fixed; top: 0; left: 0; right: 0;
        background: rgba(59, 130, 246, 0.9); color: white;
        padding: 12px 20px; font-family: -apple-system, sans-serif;
        font-size: 14px; z-index: 999998; text-align: center;
      ">
        Click on the element to ${mode === 'replace' ? 'replace' : 'insert after'} · Press ESC to cancel
      </div>
    `;
    document.body.appendChild(pickerOverlay);

    let hoveredEl = null;
    const highlight = (el, show) => {
      if (!el || el.id?.startsWith('stacks-')) return;
      el.style.outline = show ? '3px dashed #3b82f6' : '';
      el.style.outlineOffset = show ? '2px' : '';
    };

    const onMove = (e) => {
      if (hoveredEl) highlight(hoveredEl, false);
      hoveredEl = e.target;
      highlight(hoveredEl, true);
    };

    const onClick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      cleanup();
      callback(e.target);
    };

    const cleanup = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick, true);
      if (hoveredEl) highlight(hoveredEl, false);
      if (pickerOverlay) pickerOverlay.remove();
      pickerMode = null;
    };

    window.cancelPicker = cleanup;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick, true);
  }

  // MODE 1: Replace Search
  document.getElementById('stacks-btn-search').addEventListener('click', () => {
    // Try to find search elements
    const searchSelectors = [
      'input[type="search"]',
      'input[name="s"]',
      'input[name="q"]',
      '.search-form',
      '.search-field',
      '#search',
      '.site-search',
      'form[role="search"]',
    ];

    let searchEl = null;
    for (const sel of searchSelectors) {
      searchEl = document.querySelector(sel);
      if (searchEl) break;
    }

    if (searchEl) {
      // Find the container (form or parent div)
      const container = searchEl.closest('form') || searchEl.parentElement;
      const rect = container.getBoundingClientRect();
      const iframe = createIframe(rect.width + 'px', '60px');
      container.style.display = 'none';
      container.insertAdjacentElement('afterend', iframe);
      injectedElements.push(iframe);
      injectedElements.push({ restore: () => container.style.display = '' });
    } else {
      // Manual picker
      startPicker('replace', (el) => {
        const rect = el.getBoundingClientRect();
        const iframe = createIframe(rect.width + 'px', '60px');
        el.style.display = 'none';
        el.insertAdjacentElement('afterend', iframe);
        injectedElements.push(iframe);
        injectedElements.push({ restore: () => el.style.display = '' });
      });
    }
  });

  // MODE 2: Floating Button + Modal
  document.getElementById('stacks-btn-float').addEventListener('click', () => {
    // Create floating button
    const btn = document.createElement('button');
    btn.id = 'stacks-float-btn';
    btn.innerHTML = '✨ Discover';
    btn.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      padding: 14px 24px;
      border-radius: 50px;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      z-index: 99999;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
      font-family: -apple-system, sans-serif;
      transition: transform 0.2s, box-shadow 0.2s;
    `;
    btn.onmouseenter = () => {
      btn.style.transform = 'scale(1.05)';
      btn.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
    };
    btn.onmouseleave = () => {
      btn.style.transform = 'scale(1)';
      btn.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
    };
    document.body.appendChild(btn);
    injectedElements.push(btn);

    // Create modal
    const modal = document.createElement('div');
    modal.id = 'stacks-modal';
    modal.style.cssText = `
      display: none;
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.7);
      z-index: 999998;
      justify-content: center;
      align-items: center;
    `;
    modal.innerHTML = `
      <div style="
        background: white;
        border-radius: 16px;
        width: ${CONFIG.modalWidth};
        height: ${CONFIG.modalHeight};
        max-width: 1200px;
        overflow: hidden;
        position: relative;
      ">
        <button id="stacks-modal-close" style="
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0,0,0,0.1);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 20px;
          z-index: 1;
        ">×</button>
        <iframe src="${CONFIG.iframeUrl}" style="
          border: none;
          width: 100%;
          height: 100%;
        "></iframe>
      </div>
    `;
    document.body.appendChild(modal);
    injectedElements.push(modal);

    // Modal controls
    btn.addEventListener('click', () => modal.style.display = 'flex');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.style.display = 'none';
    });
    modal.querySelector('#stacks-modal-close').addEventListener('click', () => {
      modal.style.display = 'none';
    });
  });

  // MODE 3: Inline Section
  document.getElementById('stacks-btn-inline').addEventListener('click', () => {
    // Try to find a good insertion point
    const insertSelectors = [
      '.hero',
      '.banner',
      '.site-header',
      'header',
      '.home-hero',
      '#main-content > *:first-child',
      'main > *:first-child',
    ];

    let insertAfter = null;
    for (const sel of insertSelectors) {
      insertAfter = document.querySelector(sel);
      if (insertAfter) break;
    }

    const createSection = (afterEl) => {
      const section = document.createElement('section');
      section.id = 'stacks-inline-section';
      section.style.cssText = `
        padding: 40px 20px;
        background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
        border-bottom: 1px solid #e2e8f0;
      `;
      section.innerHTML = `
        <div style="max-width: 1200px; margin: 0 auto;">
          <h2 style="
            text-align: center;
            font-family: -apple-system, sans-serif;
            font-size: 28px;
            font-weight: 700;
            color: #1e293b;
            margin-bottom: 8px;
          ">Discover Your Next Great Read</h2>
          <p style="
            text-align: center;
            font-family: -apple-system, sans-serif;
            font-size: 16px;
            color: #64748b;
            margin-bottom: 24px;
          ">Search by vibe, mood, or "like this but..." · Powered by AI</p>
          <div style="border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            ${createIframe('100%', CONFIG.inlineHeight).outerHTML}
          </div>
        </div>
      `;
      afterEl.insertAdjacentElement('afterend', section);
      injectedElements.push(section);
    };

    if (insertAfter) {
      createSection(insertAfter);
    } else {
      startPicker('insert', createSection);
    }
  });

  // Reset
  document.getElementById('stacks-btn-reset').addEventListener('click', () => {
    injectedElements.forEach(el => {
      if (el.restore) {
        el.restore();
      } else if (el.remove) {
        el.remove();
      }
    });
    injectedElements = [panel];
  });

  console.log('✅ STACKS Demo Injector loaded. Use the control panel in the top-right corner.');
})();
