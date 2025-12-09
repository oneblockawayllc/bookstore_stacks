// STACKS Widget Demo - Expandable Search Experience
// Paste in DevTools console on quailridgebooks.com

(function() {
  // ============================================
  // MOCK DATA - "books like Succession the show"
  // ============================================
  const MOCK_RESULTS = {
    query: "books like Succession the show",
    atmosphere: {
      tags: ["CUTTHROAT", "LUXURIOUS", "DARKLY COMIC", "TENSE"],
      books: [
        {
          title: "The Nest",
          author: "Cynthia D'Aprix Sweeney",
          cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1451446136i/28220826.jpg",
          description: "Four adult siblings await their inheritance while secrets and betrayals threaten to tear the family apart.",
          inStock: true,
          match: 94,
          pages: 354
        },
        {
          title: "Trust",
          author: "Hernan Diaz",
          cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1635095454i/59808603.jpg",
          description: "A wealthy financier's legacy unravels through competing narratives of power, money, and manipulation.",
          inStock: true,
          match: 91,
          pages: 416
        }
      ]
    },
    characters: {
      tags: ["MORALLY GREY", "AMBITIOUS", "MANIPULATIVE", "PRIVILEGED"],
      books: [
        {
          title: "The House of Mirth",
          author: "Edith Wharton",
          cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1564063693i/17728.jpg",
          description: "A beautiful woman navigates New York high society's treacherous waters where wealth determines worth.",
          inStock: false,
          match: 88,
          pages: 352
        },
        {
          title: "The Bonfire of the Vanities",
          author: "Tom Wolfe",
          cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1388200270i/2684.jpg",
          description: "A Wall Street bond trader's life implodes in this savage satire of greed, class, and ambition.",
          inStock: true,
          match: 86,
          pages: 690
        }
      ]
    },
    plot: {
      tags: ["FAMILY DRAMA", "POWER STRUGGLES", "BETRAYAL", "WEALTH"],
      books: [
        {
          title: "A Little Life",
          author: "Hanya Yanagihara",
          cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1446469353i/22822858.jpg",
          description: "Four friends navigate ambition, success, and devastating secrets in New York City.",
          inStock: true,
          match: 85,
          pages: 720
        },
        {
          title: "The Corrections",
          author: "Jonathan Franzen",
          cover: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1355011305i/3805.jpg",
          description: "A dysfunctional Midwestern family confronts their failures as they gather for one last Christmas.",
          inStock: true,
          match: 82,
          pages: 568
        }
      ]
    }
  };

  // ============================================
  // STYLES
  // ============================================
  const styles = document.createElement('style');
  styles.textContent = `
    .stacks-widget {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: #f8f8f8;
      border-bottom: 1px solid #e0e0e0;
      overflow: hidden;
      transition: max-height 0.4s ease-out;
    }

    .stacks-widget * {
      box-sizing: border-box;
    }

    .stacks-widget.collapsed {
      max-height: 70px;
    }

    .stacks-widget.expanded {
      max-height: 500px;
    }

    .stacks-widget.results {
      max-height: 650px;
    }

    .stacks-inner {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
    }

    /* Collapsed State */
    .stacks-collapsed-bar {
      display: flex;
      align-items: center;
      gap: 16px;
      cursor: pointer;
    }

    .stacks-collapsed-bar .stacks-brand {
      display: flex;
      align-items: baseline;
      gap: 8px;
      white-space: nowrap;
    }

    .stacks-collapsed-bar .stacks-title {
      font-size: 18px;
      font-weight: 800;
      color: #1a1a1a;
      letter-spacing: 0.5px;
      text-decoration: underline;
      text-decoration-style: dashed;
      text-underline-offset: 4px;
    }

    .stacks-collapsed-bar .stacks-powered {
      font-size: 11px;
      color: #666;
    }

    .stacks-collapsed-bar .stacks-powered strong {
      font-weight: 700;
      color: #333;
    }

    .stacks-collapsed-bar input {
      flex: 1;
      padding: 14px 20px;
      font-size: 15px;
      border: 3px solid #1a1a1a;
      border-radius: 8px;
      outline: none;
      background: white;
    }

    .stacks-collapsed-bar input::placeholder {
      color: #999;
    }

    /* Expanded State */
    .stacks-expanded {
      display: none;
      padding-top: 8px;
    }

    .stacks-widget.expanded .stacks-expanded,
    .stacks-widget.results .stacks-expanded {
      display: block;
    }

    .stacks-widget.expanded .stacks-collapsed-bar,
    .stacks-widget.results .stacks-collapsed-bar {
      display: none;
    }

    .stacks-header {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      margin-bottom: 20px;
    }

    .stacks-header-left {
      flex-shrink: 0;
    }

    .stacks-header-left .title {
      font-size: 32px;
      font-weight: 900;
      color: #1a1a1a;
      letter-spacing: 1px;
      text-decoration: underline;
      text-decoration-style: dashed;
      text-underline-offset: 6px;
      margin: 0 0 4px 0;
    }

    .stacks-header-left .powered {
      font-size: 12px;
      color: #666;
    }

    .stacks-header-left .powered strong {
      font-weight: 700;
      color: #333;
      letter-spacing: 0.5px;
    }

    .stacks-header-right {
      padding-top: 8px;
      font-size: 14px;
      color: #555;
      line-height: 1.5;
      max-width: 400px;
    }

    .stacks-search-row {
      margin-bottom: 16px;
    }

    .stacks-search-input {
      width: 100%;
      padding: 16px 20px 16px 48px;
      font-size: 16px;
      border: 3px solid #1a1a1a;
      border-radius: 8px;
      outline: none;
      background: white url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='%239333ea' stroke-width='2'%3E%3Cpath d='M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z'/%3E%3Cpath d='M5 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z'/%3E%3C/svg%3E") 16px center no-repeat;
    }

    .stacks-search-input::placeholder {
      color: #999;
    }

    .stacks-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .stacks-chip {
      padding: 10px 18px;
      background: white;
      border: 2px solid #1a1a1a;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.5px;
      cursor: pointer;
      transition: all 0.15s;
    }

    .stacks-chip:hover {
      background: #1a1a1a;
      color: white;
    }

    /* Results State */
    .stacks-results {
      display: none;
    }

    .stacks-widget.results .stacks-results {
      display: block;
    }

    .stacks-widget.results .stacks-header,
    .stacks-widget.results .stacks-chips {
      display: none;
    }

    .stacks-results-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .stacks-back-btn {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 4px;
    }

    .stacks-back-btn:hover {
      background: #e0e0e0;
    }

    .stacks-results-title {
      font-size: 22px;
      font-weight: 700;
      color: #1a1a1a;
    }

    .stacks-results-query {
      font-size: 14px;
      color: #666;
      margin-bottom: 12px;
    }

    .stacks-results-scroll {
      max-height: 480px;
      overflow-y: auto;
      padding-right: 8px;
    }

    .stacks-results-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .stacks-results-scroll::-webkit-scrollbar-track {
      background: #eee;
      border-radius: 3px;
    }

    .stacks-results-scroll::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 3px;
    }

    .stacks-category {
      margin-bottom: 24px;
    }

    .stacks-category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stacks-category-icon {
      font-size: 18px;
    }

    .stacks-category-title {
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.5px;
      color: #1a1a1a;
    }

    .stacks-category-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 14px;
    }

    .stacks-tag {
      padding: 6px 12px;
      background: #1a1a1a;
      color: white;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.5px;
    }

    .stacks-books {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }

    .stacks-book {
      display: flex;
      gap: 14px;
      padding: 14px;
      background: white;
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      transition: border-color 0.15s;
    }

    .stacks-book:hover {
      border-color: #1a1a1a;
    }

    .stacks-book-cover {
      width: 70px;
      height: 105px;
      object-fit: cover;
      border-radius: 4px;
      flex-shrink: 0;
      background: #eee;
    }

    .stacks-book-info {
      flex: 1;
      min-width: 0;
    }

    .stacks-book-title {
      font-size: 15px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 2px 0;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .stacks-book-author {
      font-size: 13px;
      color: #666;
      margin: 0 0 8px 0;
    }

    .stacks-book-desc {
      font-size: 12px;
      color: #555;
      line-height: 1.4;
      margin: 0 0 10px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .stacks-book-meta {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .stacks-stock {
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 700;
    }

    .stacks-stock.in-stock {
      background: #22c55e;
      color: white;
    }

    .stacks-stock.can-order {
      background: #f59e0b;
      color: white;
    }

    .stacks-match {
      padding: 4px 8px;
      background: #1a1a1a;
      color: white;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 700;
    }

    .stacks-pages {
      font-size: 11px;
      color: #999;
    }
  `;
  document.head.appendChild(styles);

  // ============================================
  // CREATE WIDGET HTML
  // ============================================
  const widget = document.createElement('div');
  widget.className = 'stacks-widget collapsed';
  widget.id = 'stacks-widget';

  widget.innerHTML = `
    <div class="stacks-inner">
      <!-- Collapsed State -->
      <div class="stacks-collapsed-bar">
        <div class="stacks-brand">
          <span class="stacks-title">DISCOVER</span>
          <span class="stacks-powered">Powered by <strong>STACKS</strong></span>
        </div>
        <input type="text" placeholder="try: 'books like Succession the show'" id="stacks-collapsed-input">
      </div>

      <!-- Expanded State -->
      <div class="stacks-expanded">
        <div class="stacks-header">
          <div class="stacks-header-left">
            <h2 class="title">DISCOVER</h2>
            <p class="powered">Powered by <strong>STACKS</strong></p>
          </div>
          <div class="stacks-header-right">
            Describe what you're in the mood for—a vibe, a feeling, or even a movie you love—and we'll find the perfect book.
          </div>
        </div>

        <div class="stacks-search-row">
          <input type="text" class="stacks-search-input" placeholder="try: 'dark academia vibes'" id="stacks-main-input">
        </div>

        <div class="stacks-chips">
          <button class="stacks-chip">DARK ACADEMIA</button>
          <button class="stacks-chip">COZY FANTASY</button>
          <button class="stacks-chip">ROMANTASY</button>
          <button class="stacks-chip">ENEMIES TO LOVERS</button>
          <button class="stacks-chip">FOUND FAMILY</button>
        </div>

        <!-- Results -->
        <div class="stacks-results">
          <div class="stacks-results-header">
            <button class="stacks-back-btn" id="stacks-back">←</button>
            <span class="stacks-results-title">Search Results</span>
          </div>
          <div class="stacks-results-query">"${MOCK_RESULTS.query}"</div>

          <div class="stacks-results-scroll" id="stacks-results-container">
            <!-- Atmosphere -->
            <div class="stacks-category">
              <div class="stacks-category-header">
                <span class="stacks-category-icon">💥</span>
                <span class="stacks-category-title">ATMOSPHERE</span>
              </div>
              <div class="stacks-category-tags">
                ${MOCK_RESULTS.atmosphere.tags.map(t => `<span class="stacks-tag">${t}</span>`).join('')}
              </div>
              <div class="stacks-books">
                ${MOCK_RESULTS.atmosphere.books.map(book => renderBook(book)).join('')}
              </div>
            </div>

            <!-- Characters -->
            <div class="stacks-category">
              <div class="stacks-category-header">
                <span class="stacks-category-icon">✍️</span>
                <span class="stacks-category-title">CHARACTERS</span>
              </div>
              <div class="stacks-category-tags">
                ${MOCK_RESULTS.characters.tags.map(t => `<span class="stacks-tag">${t}</span>`).join('')}
              </div>
              <div class="stacks-books">
                ${MOCK_RESULTS.characters.books.map(book => renderBook(book)).join('')}
              </div>
            </div>

            <!-- Plot -->
            <div class="stacks-category">
              <div class="stacks-category-header">
                <span class="stacks-category-icon">📖</span>
                <span class="stacks-category-title">PLOT</span>
              </div>
              <div class="stacks-category-tags">
                ${MOCK_RESULTS.plot.tags.map(t => `<span class="stacks-tag">${t}</span>`).join('')}
              </div>
              <div class="stacks-books">
                ${MOCK_RESULTS.plot.books.map(book => renderBook(book)).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  function renderBook(book) {
    return `
      <div class="stacks-book">
        <img class="stacks-book-cover" src="${book.cover}" alt="${book.title}" onerror="this.style.background='#ddd'">
        <div class="stacks-book-info">
          <h4 class="stacks-book-title">${book.title}</h4>
          <p class="stacks-book-author">${book.author}</p>
          <p class="stacks-book-desc">${book.description}</p>
          <div class="stacks-book-meta">
            <span class="stacks-stock ${book.inStock ? 'in-stock' : 'can-order'}">${book.inStock ? '✓ IN STOCK' : '⊕ CAN ORDER'}</span>
            <span class="stacks-match">${book.match}%</span>
            <span class="stacks-pages">${book.pages}p</span>
          </div>
        </div>
      </div>
    `;
  }

  // ============================================
  // INJECT INTO PAGE - Replace their search bar
  // ============================================
  // Find their search form containing input[type="search"]
  const searchInput = document.querySelector('input[type="search"]');
  const searchForm = searchInput?.closest('form');

  if (searchForm) {
    // Hide their search form and insert STACKS in its place
    searchForm.style.display = 'none';
    searchForm.insertAdjacentElement('afterend', widget);
    console.log('✅ Replaced their search form with STACKS widget');
  } else {
    // Fallback: try to find header and inject after
    const header = document.querySelector('header') ||
                   document.querySelector('.site-header') ||
                   document.querySelector('nav')?.parentElement;

    if (header) {
      header.insertAdjacentElement('afterend', widget);
      console.log('⚠️ Could not find search form, injected after header');
    } else {
      document.body.insertBefore(widget, document.body.firstChild);
      console.log('⚠️ Fallback: injected at top of body');
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const collapsedInput = document.getElementById('stacks-collapsed-input');
  const mainInput = document.getElementById('stacks-main-input');
  const backBtn = document.getElementById('stacks-back');
  const chips = widget.querySelectorAll('.stacks-chip');

  // Expand on collapsed input focus
  collapsedInput.addEventListener('focus', () => {
    widget.classList.remove('collapsed');
    widget.classList.add('expanded');
    setTimeout(() => mainInput.focus(), 100);
  });

  // Handle search
  function handleSearch(query) {
    if (query.toLowerCase().includes('succession')) {
      widget.classList.remove('expanded');
      widget.classList.add('results');
    }
  }

  mainInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch(mainInput.value);
    }
  });

  // Chip clicks
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      mainInput.value = chip.textContent.toLowerCase();
      // For demo, only "succession" query shows results
      // But chips give the feel of the experience
    });
  });

  // Back button
  backBtn.addEventListener('click', () => {
    widget.classList.remove('results');
    widget.classList.add('expanded');
    mainInput.value = '';
    mainInput.focus();
  });

  // Click outside to collapse (optional)
  document.addEventListener('click', (e) => {
    if (!widget.contains(e.target) && !widget.classList.contains('results')) {
      widget.classList.remove('expanded');
      widget.classList.add('collapsed');
    }
  });

  console.log('✅ STACKS Widget loaded! Click the search bar to expand.');
})();
