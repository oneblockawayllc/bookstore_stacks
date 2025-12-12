// STACKS Widget Demo - Hybrid Inline Trigger + Overlay Experience
// Paste in DevTools console on quailridgebooks.com
// Uses Shadow DOM for complete CSS isolation from host site

(function() {
  // ============================================
  // MOCK DATA - Multiple demo pathways
  // ============================================

  // Fiction/Vibe intent - "books like Succession the show"
  const MOCK_SUCCESSION = {
    query: "books like Succession the show",
    intent: "fiction_vibe",
    query_understanding: "You're looking for books with the same energy as Succession—wealthy family dynasties, power struggles, dark humor, and morally complex characters.",
    lanes: [
      {
        name: "Atmosphere",
        icon: "🌟",
        type: "atmosphere",
        tags: ["CUTTHROAT", "LUXURIOUS", "DARKLY COMIC", "TENSE"],
        books: [
          {
            title: "The Nest",
            author: "Cynthia D'Aprix Sweeney",
            cover: "https://covers.openlibrary.org/b/isbn/9780062414229-L.jpg",
            description: "Four adult siblings await their inheritance while secrets and betrayals threaten to tear the family apart.",
            rationale: "Captures the same wealthy-family-imploding energy you loved in Succession. The siblings circle their inheritance like sharks, and every conversation drips with passive aggression.",
            inStock: true,
            match: 94,
            pages: 354,
            badge: "mayas_pick"
          },
          {
            title: "Trust",
            author: "Hernan Diaz",
            cover: "https://covers.openlibrary.org/b/isbn/9780593420317-L.jpg",
            description: "A wealthy financier's legacy unravels through competing narratives of power, money, and manipulation.",
            rationale: "The old-money Manhattan atmosphere you're after, but told through unreliable narrators fighting over whose version of events is true. It's Succession meets Rashomon.",
            inStock: true,
            match: 91,
            pages: 416
          }
        ]
      },
      {
        name: "Characters",
        icon: "💫",
        type: "characters",
        tags: ["MORALLY GREY", "AMBITIOUS", "MANIPULATIVE", "PRIVILEGED"],
        books: [
          {
            title: "The House of Mirth",
            author: "Edith Wharton",
            cover: "https://covers.openlibrary.org/b/isbn/9780140187298-L.jpg",
            description: "A beautiful woman navigates New York high society's treacherous waters where wealth determines worth.",
            rationale: "Lily Bart is the Shiv Roy of the 1900s—brilliant, trapped by her world's rules, making devastating choices. The society is just as cutthroat, the falls just as hard.",
            inStock: false,
            match: 88,
            pages: 352,
            badge: "neighborhood_favorite"
          },
          {
            title: "The Bonfire of the Vanities",
            author: "Tom Wolfe",
            cover: "https://covers.openlibrary.org/b/isbn/9780312427573-L.jpg",
            description: "A Wall Street bond trader's life implodes in this savage satire of greed, class, and ambition.",
            rationale: "Sherman McCoy is what happens when a Waystar exec gets caught. Same savage takedown of the ultra-wealthy, same dark comedy as everyone scrambles to save themselves.",
            inStock: true,
            match: 86,
            pages: 690
          }
        ]
      },
      {
        name: "Plot",
        icon: "📖",
        type: "plot",
        tags: ["FAMILY DRAMA", "POWER STRUGGLES", "BETRAYAL", "WEALTH"],
        books: [
          {
            title: "A Little Life",
            author: "Hanya Yanagihara",
            cover: "https://covers.openlibrary.org/b/isbn/9780804172707-L.jpg",
            description: "Four friends navigate ambition, success, and devastating secrets in New York City.",
            rationale: "The found-family dynamics and New York ambition you want, but even more emotionally devastating. If Succession made you feel things, this will wreck you.",
            inStock: true,
            match: 85,
            pages: 720
          },
          {
            title: "The Corrections",
            author: "Jonathan Franzen",
            cover: "https://covers.openlibrary.org/b/isbn/9780312421274-L.jpg",
            description: "A dysfunctional Midwestern family confronts their failures as they gather for one last Christmas.",
            rationale: "Same family-as-battlefield structure—everyone has an agenda, everyone's keeping score. The Lamberts are the Roys without the billions, which somehow makes it worse.",
            inStock: true,
            match: 82,
            pages: 568,
            badge: "author_coming"
          }
        ]
      }
    ]
  };

  // Topic intent - "ancient egypt"
  const MOCK_EGYPT = {
    query: "ancient egypt",
    intent: "topic",
    query_understanding: "You're looking for books about Ancient Egypt—its history, mysteries, pharaohs, and the civilization that built the pyramids.",
    lanes: [
      {
        name: "Foundational",
        icon: "🏛️",
        type: "foundational",
        tags: ["SCHOLARLY", "COMPREHENSIVE", "AUTHORITATIVE"],
        books: [
          {
            title: "The Oxford History of Ancient Egypt",
            author: "Ian Shaw",
            cover: "https://covers.openlibrary.org/b/isbn/9780192804587-L.jpg",
            description: "The definitive single-volume history covering 3,000 years from prehistory to the Roman conquest.",
            rationale: "The authoritative starting point you need—covers every dynasty from leading Egyptologists. Dense but accessible, it's the foundation scholars build on.",
            inStock: true,
            match: 96,
            pages: 552,
            badge: "mayas_pick"
          },
          {
            title: "The Rise and Fall of Ancient Egypt",
            author: "Toby Wilkinson",
            cover: "https://covers.openlibrary.org/b/isbn/9780553384901-L.jpg",
            description: "A sweeping narrative of Egyptian civilization from its origins to Cleopatra's death.",
            rationale: "Balances scholarship with storytelling—you'll understand the politics, power struggles, and personalities that shaped 3,000 years of civilization.",
            inStock: true,
            match: 93,
            pages: 646
          }
        ]
      },
      {
        name: "Narrative",
        icon: "📜",
        type: "narrative",
        tags: ["STORY-DRIVEN", "IMMERSIVE", "ADVENTUROUS"],
        books: [
          {
            title: "The Discovery of the Tomb of Tutankhamen",
            author: "Howard Carter",
            cover: "https://covers.openlibrary.org/b/isbn/9781906251109-L.jpg",
            description: "The archaeologist's own account of finding the most famous tomb in history.",
            rationale: "First-person account of THE discovery—opening the sealed door, seeing gold glinting in candlelight. History doesn't get more thrilling than this.",
            inStock: false,
            match: 91,
            pages: 256,
            badge: "neighborhood_favorite"
          },
          {
            title: "Cleopatra: A Life",
            author: "Stacy Schiff",
            cover: "https://covers.openlibrary.org/b/isbn/9780316001922-L.jpg",
            description: "Pulitzer Prize-winning biography separating the real Cleopatra from myth and Hollywood.",
            rationale: "Reads like a thriller about the most famous woman in antiquity. You wanted Egypt's story—this is its dramatic finale through an unforgettable character.",
            inStock: true,
            match: 88,
            pages: 368
          }
        ]
      },
      {
        name: "Start Here",
        icon: "🔍",
        type: "start-here",
        tags: ["BEGINNER-FRIENDLY", "VISUAL", "ENGAGING"],
        books: [
          {
            title: "Red Land, Black Land",
            author: "Barbara Mertz",
            cover: "https://covers.openlibrary.org/b/isbn/9780061252747-L.jpg",
            description: "Daily life in ancient Egypt—what people ate, wore, believed, and feared.",
            rationale: "Forget pharaohs for a moment—this is about regular Egyptians. Witty, warm, and makes the ancient world feel human. Perfect entry point.",
            inStock: true,
            match: 85,
            pages: 416
          },
          {
            title: "Temples, Tombs and Hieroglyphs",
            author: "Barbara Mertz",
            cover: "https://covers.openlibrary.org/b/isbn/9780061252778-L.jpg",
            description: "A popular history of ancient Egypt told with wit and scholarly depth.",
            rationale: "Barbara Mertz (who also wrote mysteries as Elizabeth Peters) makes Egyptology genuinely fun. You'll learn the history without it feeling like homework.",
            inStock: true,
            match: 82,
            pages: 324,
            badge: "author_coming"
          }
        ]
      }
    ]
  };

  // Fiction/Vibe intent - "ancient egypt fiction" / "novels set in egypt"
  const MOCK_EGYPT_FICTION = {
    query: "ancient egypt fiction",
    intent: "fiction_vibe",
    query_understanding: "You're looking for novels set in ancient Egypt—stories that bring pharaohs, pyramids, and the Nile to life through fiction.",
    lanes: [
      {
        name: "Atmosphere",
        icon: "🌟",
        type: "atmosphere",
        tags: ["EXOTIC", "MYSTERIOUS", "SWEEPING", "ANCIENT"],
        books: [
          {
            title: "The Egyptian",
            author: "Mika Waltari",
            cover: "https://covers.openlibrary.org/b/isbn/9781556524417-L.jpg",
            description: "A physician's journey through ancient Egypt during the reign of Akhenaten.",
            rationale: "The definitive ancient Egypt novel—lush, epic, and deeply immersive. You'll smell the incense and feel the sand.",
            inStock: true,
            match: 95,
            pages: 503,
            badge: "mayas_pick"
          },
          {
            title: "River God",
            author: "Wilbur Smith",
            cover: "https://covers.openlibrary.org/b/isbn/9780312106126-L.jpg",
            description: "An epic tale of ancient Egypt told through the eyes of a slave.",
            rationale: "Adventure, intrigue, and Egyptian grandeur. Smith makes the ancient world pulse with life and danger.",
            inStock: true,
            match: 91,
            pages: 672
          }
        ]
      },
      {
        name: "Characters",
        icon: "💫",
        type: "characters",
        tags: ["POWERFUL WOMEN", "COMPLEX", "ROYAL", "MEMORABLE"],
        books: [
          {
            title: "Nefertiti",
            author: "Michelle Moran",
            cover: "https://covers.openlibrary.org/b/isbn/9780307381743-L.jpg",
            description: "The story of Egypt's most beautiful queen, told by her sister.",
            rationale: "Palace intrigue, sibling rivalry, and a queen who changed history. Moran brings Nefertiti to vivid, complicated life.",
            inStock: true,
            match: 89,
            pages: 480,
            badge: "neighborhood_favorite"
          },
          {
            title: "Cleopatra's Daughter",
            author: "Michelle Moran",
            cover: "https://covers.openlibrary.org/b/isbn/9780307409133-L.jpg",
            description: "The forgotten story of Cleopatra's twin children after their mother's death.",
            rationale: "What happened to Cleopatra's kids? This gripping novel follows them to Rome as captives of Augustus.",
            inStock: false,
            match: 86,
            pages: 431
          }
        ]
      },
      {
        name: "Plot",
        icon: "📖",
        type: "plot",
        tags: ["MYSTERY", "ADVENTURE", "INTRIGUE", "DISCOVERY"],
        books: [
          {
            title: "Crocodile on the Sandbank",
            author: "Elizabeth Peters",
            cover: "https://covers.openlibrary.org/b/isbn/9781455572359-L.jpg",
            description: "Victorian Egyptologist Amelia Peabody encounters mystery and romance in Egypt.",
            rationale: "Part mystery, part adventure, entirely delightful. Amelia Peabody is the witty heroine you didn't know you needed.",
            inStock: true,
            match: 88,
            pages: 291,
            badge: "author_coming"
          },
          {
            title: "The Mask of Ra",
            author: "Paul Doherty",
            cover: "https://covers.openlibrary.org/b/isbn/9780747259725-L.jpg",
            description: "A judge investigates murders in the court of Pharaoh Hatusu.",
            rationale: "Ancient Egypt meets murder mystery. If you want plot twists with your pyramids, start here.",
            inStock: true,
            match: 84,
            pages: 282
          }
        ]
      }
    ]
  };

  // Map queries to mock data
  const MOCK_DATA = {
    'succession': MOCK_SUCCESSION,
    'like succession': MOCK_SUCCESSION,
    'books like succession': MOCK_SUCCESSION,
    'ancient egypt': MOCK_EGYPT,
    'egypt': MOCK_EGYPT,
    'pyramids': MOCK_EGYPT,
    // Fiction variants for Egypt
    'ancient egypt fiction': MOCK_EGYPT_FICTION,
    'ancient egypt novels': MOCK_EGYPT_FICTION,
    'ancient egypt novel': MOCK_EGYPT_FICTION,
    'egypt fiction': MOCK_EGYPT_FICTION,
    'novels set in egypt': MOCK_EGYPT_FICTION,
    'novels set in ancient egypt': MOCK_EGYPT_FICTION,
    'egyptian fiction': MOCK_EGYPT_FICTION,
    'historical fiction egypt': MOCK_EGYPT_FICTION
  };

  // ============================================
  // STYLES - Neobrutalist Design System
  // ============================================

  // Import Unbounded font
  const fontLink = document.createElement('link');
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&display=swap';
  fontLink.rel = 'stylesheet';
  document.head.appendChild(fontLink);

  // Design tokens - matched to bookstore-discover demo
  const tokens = {
    colors: {
      primary: '#cf3535',           // Quail Ridge brand red (trigger bar only)
      secondary: '#FFFFFF',
      background: '#F4EFEA',        // Cream from demo design system
      text: '#383838',
      textSecondary: '#6B6B6B',
      textTertiary: '#999999',
      textOnRed: '#FFFFFF',
      textOnRedMuted: 'rgba(255,255,255,0.85)',
      border: '#383838',
      accentCyan: '#6FC2FF',
      accentPurple: '#667eea',
      accentCoral: '#FF7169',
      accentYellow: '#EAC435',
      backdrop: 'rgba(0,0,0,0.6)',
    },
    shadows: {
      card: '-8px 8px 0 0 #383838',
      button: '-4px 4px 0 0 #383838',
      buttonHover: '-6px 6px 0 0 #383838',
      badge: '-3px 3px 0 0 #383838',
      input: '-4px 4px 0 0 #383838',
      inputFocus: '-5px 5px 0 0 #6FC2FF',
      hover: '-10px 10px 0 0 #383838',
      modal: '-12px 12px 0 0 #383838',
    }
  };

  const styles = document.createElement('style');
  styles.textContent = `
    /* ============================================
       INLINE TRIGGER BAR (replaces their search)
       ============================================ */
    .stacks-trigger {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      background: ${tokens.colors.primary};
      padding: 12px 24px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .stacks-trigger * {
      box-sizing: border-box;
    }

    .stacks-trigger .stacks-brand {
      display: flex;
      align-items: baseline;
      gap: 8px;
      white-space: nowrap;
    }

    .stacks-trigger .stacks-title {
      font-family: 'Unbounded', system-ui, sans-serif;
      font-size: 18px;
      font-weight: 900;
      color: ${tokens.colors.textOnRed};
      letter-spacing: -0.025em;
      text-transform: uppercase;
    }

    .stacks-trigger .stacks-powered {
      font-size: 11px;
      font-weight: 600;
      color: ${tokens.colors.textOnRedMuted};
    }

    .stacks-trigger .stacks-powered strong {
      font-family: 'Unbounded', system-ui, sans-serif;
      font-weight: 900;
      color: ${tokens.colors.textOnRed};
      letter-spacing: -0.025em;
    }

    .stacks-trigger-input {
      flex: 1;
      padding: 14px 18px;
      font-size: 15px;
      font-weight: 600;
      border: 3px solid ${tokens.colors.border};
      border-radius: 10px;
      outline: none;
      background: ${tokens.colors.secondary};
      color: ${tokens.colors.text};
      box-shadow: ${tokens.shadows.badge};
      cursor: pointer;
      transition: all 0.15s;
    }

    .stacks-trigger-input:hover {
      transform: translate(1px, -1px);
      box-shadow: ${tokens.shadows.button};
    }

    .stacks-trigger-input::placeholder {
      color: ${tokens.colors.textTertiary};
    }

    /* ============================================
       OVERLAY BACKDROP
       ============================================ */
    .stacks-backdrop {
      position: fixed;
      inset: 0;
      background: ${tokens.colors.backdrop};
      z-index: 99998;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, visibility 0.25s ease;
    }

    .stacks-backdrop.open {
      opacity: 1;
      visibility: visible;
    }

    /* ============================================
       OVERLAY MODAL
       ============================================ */
    .stacks-modal {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0.95);
      width: 90vw;
      max-width: 1100px;
      max-height: 85vh;
      background: ${tokens.colors.background};
      border: 5px solid ${tokens.colors.border};
      border-radius: 20px;
      box-shadow: ${tokens.shadows.modal};
      z-index: 99999;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .stacks-modal.open {
      opacity: 1;
      visibility: visible;
      transform: translate(-50%, -50%) scale(1);
    }

    .stacks-modal * {
      box-sizing: border-box;
    }

    .stacks-modal-inner {
      padding: 28px 32px;
      overflow-y: auto;
      flex: 1;
    }

    /* ============================================
       MODAL HEADER
       ============================================ */
    .stacks-header {
      display: flex;
      align-items: flex-start;
      gap: 24px;
      margin-bottom: 24px;
      position: relative;
    }

    .stacks-close-btn {
      position: absolute;
      top: 0;
      right: 0;
      background: ${tokens.colors.secondary};
      border: 3px solid ${tokens.colors.border};
      border-radius: 12px;
      width: 44px;
      height: 44px;
      font-size: 24px;
      font-weight: 900;
      cursor: pointer;
      color: ${tokens.colors.text};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${tokens.shadows.badge};
      transition: all 0.15s;
    }

    .stacks-close-btn:hover {
      transform: translate(1px, -1px);
      box-shadow: ${tokens.shadows.button};
    }

    .stacks-header-left {
      flex-shrink: 0;
    }

    .stacks-header-left .title {
      font-family: 'Unbounded', system-ui, sans-serif;
      font-size: 32px;
      font-weight: 900;
      color: ${tokens.colors.text};
      letter-spacing: -0.025em;
      text-transform: uppercase;
      text-decoration: underline;
      text-decoration-style: dashed;
      text-underline-offset: 6px;
      margin: 0 0 4px 0;
    }

    .stacks-header-left .powered {
      font-size: 13px;
      font-weight: 600;
      color: ${tokens.colors.textSecondary};
      margin: 0;
    }

    .stacks-header-left .powered strong {
      font-family: 'Unbounded', system-ui, sans-serif;
      font-weight: 900;
      color: ${tokens.colors.text};
      letter-spacing: -0.025em;
    }

    .stacks-header-right {
      padding-top: 6px;
      font-size: 14px;
      font-weight: 600;
      color: ${tokens.colors.textSecondary};
      line-height: 1.5;
      max-width: 380px;
    }

    /* ============================================
       SEARCH INPUT (in modal)
       ============================================ */
    .stacks-search-row {
      margin-bottom: 20px;
    }

    .stacks-search-input {
      width: 100%;
      padding: 18px 24px 18px 52px;
      font-size: 17px;
      font-weight: 600;
      border: 4px solid ${tokens.colors.border};
      border-radius: 12px;
      outline: none;
      background: ${tokens.colors.secondary} url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='22' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='2.5'%3E%3Cpath d='M12 3l1.5 3.5L17 8l-3.5 1.5L12 13l-1.5-3.5L7 8l3.5-1.5L12 3z'/%3E%3Cpath d='M5 16l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z'/%3E%3C/svg%3E") 18px center no-repeat;
      color: ${tokens.colors.text};
      box-shadow: ${tokens.shadows.input};
      transition: all 0.15s;
    }

    .stacks-search-input:focus {
      box-shadow: ${tokens.shadows.inputFocus};
      border-color: ${tokens.colors.accentCyan};
      transform: translate(-1px, -1px);
    }

    .stacks-search-input::placeholder {
      color: ${tokens.colors.textTertiary};
    }

    /* ============================================
       CHIPS
       ============================================ */
    .stacks-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    .stacks-chip {
      padding: 10px 16px;
      background: ${tokens.colors.secondary};
      border: 3px solid ${tokens.colors.border};
      border-radius: 10px;
      font-family: 'Unbounded', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      color: ${tokens.colors.text};
      cursor: pointer;
      box-shadow: ${tokens.shadows.badge};
      transition: all 0.15s;
    }

    .stacks-chip:hover {
      transform: translate(1px, -1px);
      box-shadow: ${tokens.shadows.button};
    }

    .stacks-chip:active {
      transform: translate(-1px, 1px);
      box-shadow: -2px 2px 0 0 ${tokens.colors.border};
    }

    /* ============================================
       RESULTS VIEW
       ============================================ */
    .stacks-results {
      display: none;
    }

    .stacks-modal.results .stacks-results {
      display: block;
    }

    .stacks-modal.results .stacks-header,
    .stacks-modal.results .stacks-chips {
      display: none;
    }

    .stacks-results-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;
    }

    .stacks-back-btn {
      background: ${tokens.colors.secondary};
      border: 3px solid ${tokens.colors.border};
      border-radius: 10px;
      width: 40px;
      height: 40px;
      font-size: 20px;
      font-weight: 900;
      cursor: pointer;
      color: ${tokens.colors.text};
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: ${tokens.shadows.badge};
      transition: all 0.15s;
    }

    .stacks-back-btn:hover {
      transform: translate(1px, -1px);
      box-shadow: ${tokens.shadows.button};
    }

    .stacks-results-title {
      font-family: 'Unbounded', system-ui, sans-serif;
      font-size: 22px;
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      color: ${tokens.colors.text};
    }

    .stacks-results-query {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: ${tokens.colors.textSecondary};
      margin-bottom: 8px;
    }

    .stacks-results-scroll {
      max-height: 55vh;
      overflow-y: auto;
      padding-right: 8px;
    }

    .stacks-results-scroll::-webkit-scrollbar {
      width: 8px;
    }

    .stacks-results-scroll::-webkit-scrollbar-track {
      background: ${tokens.colors.background};
      border-radius: 4px;
    }

    .stacks-results-scroll::-webkit-scrollbar-thumb {
      background: ${tokens.colors.border};
      border-radius: 4px;
    }

    /* ============================================
       CATEGORY SECTIONS
       ============================================ */
    .stacks-category {
      margin-bottom: 28px;
    }

    .stacks-category-header {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stacks-category-icon {
      font-size: 22px;
    }

    .stacks-category-title {
      font-family: 'Unbounded', system-ui, sans-serif;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: -0.025em;
      text-transform: uppercase;
      color: ${tokens.colors.text};
    }

    .stacks-category-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-bottom: 14px;
    }

    .stacks-tag {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      padding: 6px 12px;
      color: white;
      border: 2px solid ${tokens.colors.border};
      border-radius: 6px;
      font-size: 10px;
      font-weight: 900;
      letter-spacing: 0.02em;
      text-transform: uppercase;
    }

    .stacks-tag.atmosphere {
      background: ${tokens.colors.accentCyan};
    }

    .stacks-tag.characters {
      background: ${tokens.colors.accentPurple};
    }

    .stacks-tag.plot {
      background: ${tokens.colors.accentCoral};
    }

    /* Topic intent lanes */
    .stacks-tag.foundational {
      background: #1e3a5f;
    }

    .stacks-tag.narrative {
      background: #7c3aed;
    }

    .stacks-tag.start-here {
      background: #059669;
    }

    /* Badge styles */
    .stacks-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: ${tokens.colors.accentYellow};
      color: ${tokens.colors.text};
      border: 2px solid ${tokens.colors.border};
      border-radius: 6px;
      font-size: 8px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }

    .stacks-badge.mayas-pick {
      background: #fbbf24;
    }

    .stacks-badge.neighborhood-favorite {
      background: #f472b6;
      color: white;
    }

    .stacks-badge.author-coming {
      background: #34d399;
    }

    /* ============================================
       BOOK CARDS
       ============================================ */
    .stacks-books {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;
      padding-left: 10px;
    }

    .stacks-book {
      display: flex;
      gap: 12px;
      padding: 12px;
      background: ${tokens.colors.secondary};
      border: 3px solid ${tokens.colors.border};
      border-radius: 14px;
      box-shadow: ${tokens.shadows.card};
      transition: all 0.15s;
      cursor: pointer;
      overflow: hidden;
    }

    .stacks-book:hover {
      transform: translate(-0.5px, -0.5px);
      box-shadow: ${tokens.shadows.hover};
    }

    .stacks-book:active {
      transform: translate(0, 0);
      box-shadow: ${tokens.shadows.badge};
    }

    .stacks-book-cover {
      width: 65px;
      height: 98px;
      object-fit: cover;
      border: 2px solid ${tokens.colors.border};
      border-radius: 6px;
      flex-shrink: 0;
      background: #E8E0D8;
    }

    .stacks-book-info {
      flex: 1;
      min-width: 0;
    }

    .stacks-book-title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-size: 14px;
      font-weight: 900;
      color: ${tokens.colors.text};
      margin: 0 0 2px 0;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .stacks-book-author {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: ${tokens.colors.textSecondary};
      margin: 0 0 6px 0;
    }

    .stacks-book-desc {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-size: 11px;
      font-weight: 500;
      color: ${tokens.colors.textTertiary};
      line-height: 1.45;
      margin: 0 0 8px 0;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .stacks-book-meta {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
    }

    .stacks-stock {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 4px 8px;
      border: 2px solid ${tokens.colors.border};
      border-radius: 6px;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
    }

    .stacks-stock.in-stock {
      background: #22c55e;
      color: white;
    }

    .stacks-stock.can-order {
      background: ${tokens.colors.accentYellow};
      color: ${tokens.colors.text};
    }

    .stacks-match {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      padding: 4px 8px;
      background: ${tokens.colors.accentPurple};
      color: white;
      border: 2px solid ${tokens.colors.border};
      border-radius: 6px;
      font-size: 10px;
      font-weight: 900;
      text-transform: uppercase;
    }

    .stacks-pages {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      font-size: 10px;
      font-weight: 700;
      color: ${tokens.colors.textTertiary};
      text-transform: uppercase;
      margin-left: auto;
    }
  `;

  // ============================================
  // CREATE SHADOW DOM HOST FOR TRIGGER
  // ============================================
  const triggerHost = document.createElement('div');
  triggerHost.id = 'stacks-trigger-host';
  const triggerShadow = triggerHost.attachShadow({ mode: 'open' });

  // Clone styles for trigger shadow
  const triggerStyles = styles.cloneNode(true);
  triggerShadow.appendChild(triggerStyles);

  // Create trigger bar
  const triggerBar = document.createElement('div');
  triggerBar.className = 'stacks-trigger';
  triggerBar.innerHTML = `
    <div class="stacks-brand">
      <span class="stacks-title">DISCOVER</span>
      <span class="stacks-powered">Powered by <strong>STACKS</strong></span>
    </div>
    <input type="text" class="stacks-trigger-input" placeholder="try: 'books like Succession the show'" readonly id="stacks-trigger-input">
  `;
  triggerShadow.appendChild(triggerBar);

  // ============================================
  // CREATE SHADOW DOM HOST FOR MODAL
  // ============================================
  const modalHost = document.createElement('div');
  modalHost.id = 'stacks-modal-host';
  modalHost.style.cssText = 'position: fixed; top: 0; left: 0; width: 0; height: 0; z-index: 99998;';
  const modalShadow = modalHost.attachShadow({ mode: 'open' });

  // Clone styles for modal shadow
  const modalStyles = styles.cloneNode(true);
  modalShadow.appendChild(modalStyles);

  // Create backdrop
  const backdrop = document.createElement('div');
  backdrop.className = 'stacks-backdrop';
  backdrop.id = 'stacks-backdrop';
  modalShadow.appendChild(backdrop);

  // Create modal
  const modal = document.createElement('div');
  modal.className = 'stacks-modal';
  modal.id = 'stacks-modal';

  function getBadgeHtml(badge) {
    if (!badge) return '';
    const badges = {
      'mayas_pick': { icon: '⭐', label: "Maya's Pick", class: 'mayas-pick' },
      'neighborhood_favorite': { icon: '🏘️', label: 'Neighborhood Favorite', class: 'neighborhood-favorite' },
      'author_coming': { icon: '✍️', label: 'Author Coming', class: 'author-coming' }
    };
    const b = badges[badge];
    return b ? `<span class="stacks-badge ${b.class}">${b.icon} ${b.label}</span>` : '';
  }

  function renderBook(book) {
    return `
      <div class="stacks-book">
        <img class="stacks-book-cover" src="${book.cover}" alt="${book.title}" onerror="this.style.background='#ddd'">
        <div class="stacks-book-info">
          <h4 class="stacks-book-title">${book.title}</h4>
          <p class="stacks-book-author">${book.author}</p>
          <p class="stacks-book-desc">${book.rationale || book.description}</p>
          <div class="stacks-book-meta">
            ${getBadgeHtml(book.badge)}
            <span class="stacks-stock ${book.inStock ? 'in-stock' : 'can-order'}">${book.inStock ? '✓ IN STOCK' : '⊕ CAN ORDER'}</span>
            <span class="stacks-match">${book.match}%</span>
            <span class="stacks-pages">${book.pages}p</span>
          </div>
        </div>
      </div>
    `;
  }

  function renderResults(data) {
    return data.lanes.map(lane => `
      <div class="stacks-category">
        <div class="stacks-category-header">
          <span class="stacks-category-icon">${lane.icon}</span>
          <span class="stacks-category-title">${lane.name.toUpperCase()}</span>
        </div>
        <div class="stacks-category-tags">
          ${lane.tags.map(t => `<span class="stacks-tag ${lane.type}">${t}</span>`).join('')}
        </div>
        <div class="stacks-books">
          ${lane.books.map(book => renderBook(book)).join('')}
        </div>
      </div>
    `).join('');
  }

  modal.innerHTML = `
    <div class="stacks-modal-inner">
      <!-- Header -->
      <div class="stacks-header">
        <div class="stacks-header-left">
          <h2 class="title">DISCOVER</h2>
          <p class="powered">Powered by <strong>STACKS</strong></p>
        </div>
        <div class="stacks-header-right">
          Describe what you're in the mood for—a vibe, a feeling, or even a movie you love—and we'll find the perfect book.
        </div>
        <button class="stacks-close-btn" id="stacks-close">×</button>
      </div>

      <!-- Search -->
      <div class="stacks-search-row">
        <input type="text" class="stacks-search-input" placeholder="try: 'books like Succession the show'" id="stacks-main-input">
      </div>

      <!-- Chips -->
      <div class="stacks-chips">
        <button class="stacks-chip" data-query="ancient egypt">ANCIENT EGYPT</button>
        <button class="stacks-chip">DARK ACADEMIA</button>
        <button class="stacks-chip">COZY FANTASY</button>
        <button class="stacks-chip">ENEMIES TO LOVERS</button>
        <button class="stacks-chip">BEACH READ</button>
        <button class="stacks-chip">FOUND FAMILY</button>
        <button class="stacks-chip">ROMANTASY</button>
        <button class="stacks-chip">HEIST STORY</button>
      </div>

      <!-- Results -->
      <div class="stacks-results">
        <div class="stacks-results-header">
          <button class="stacks-back-btn" id="stacks-back">←</button>
          <span class="stacks-results-title">Search Results</span>
        </div>
        <div class="stacks-results-query" id="stacks-query-display"></div>
        <div class="stacks-results-understanding" id="stacks-understanding" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif; font-size: 13px; font-weight: 500; color: #6B6B6B; margin-bottom: 20px; font-style: italic;"></div>
        <div class="stacks-results-scroll" id="stacks-results-container"></div>
      </div>
    </div>
  `;

  modalShadow.appendChild(modal);

  // ============================================
  // INJECT INTO PAGE
  // ============================================
  // Find their search form and replace with trigger
  const searchInput = document.querySelector('input[type="search"]');
  const searchForm = searchInput?.closest('form');

  if (searchForm) {
    searchForm.style.display = 'none';
    searchForm.insertAdjacentElement('afterend', triggerHost);
    console.log('✅ Replaced search form with STACKS trigger bar');
  } else {
    const header = document.querySelector('header') ||
                   document.querySelector('.site-header') ||
                   document.querySelector('nav')?.parentElement;

    if (header) {
      header.insertAdjacentElement('afterend', triggerHost);
      console.log('⚠️ Could not find search form, injected trigger after header');
    } else {
      document.body.insertBefore(triggerHost, document.body.firstChild);
      console.log('⚠️ Fallback: injected trigger at top of body');
    }
  }

  // Add modal host to body
  document.body.appendChild(modalHost);

  // ============================================
  // EVENT HANDLERS
  // ============================================
  const triggerInput = triggerShadow.getElementById('stacks-trigger-input');
  const mainInput = modalShadow.getElementById('stacks-main-input');
  const closeBtn = modalShadow.getElementById('stacks-close');
  const backBtn = modalShadow.getElementById('stacks-back');
  const chips = modalShadow.querySelectorAll('.stacks-chip');
  const resultsContainer = modalShadow.getElementById('stacks-results-container');
  const queryDisplay = modalShadow.getElementById('stacks-query-display');
  const understandingDisplay = modalShadow.getElementById('stacks-understanding');

  function openModal() {
    backdrop.classList.add('open');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => mainInput.focus(), 100);
  }

  function closeModal() {
    backdrop.classList.remove('open');
    modal.classList.remove('open');
    modal.classList.remove('results');
    document.body.style.overflow = '';
    mainInput.value = '';
  }

  function showResults(data) {
    queryDisplay.textContent = '"' + data.query + '"';
    understandingDisplay.textContent = data.query_understanding;
    resultsContainer.innerHTML = renderResults(data);
    resultsContainer.scrollTop = 0;
    modal.classList.add('results');
  }

  function hideResults() {
    modal.classList.remove('results');
    mainInput.value = '';
    mainInput.focus();
  }

  // Find mock data for a query
  function findMockData(query) {
    const q = query.toLowerCase().trim();
    // Check for exact matches first
    if (MOCK_DATA[q]) return MOCK_DATA[q];
    // Check for partial matches
    for (const key of Object.keys(MOCK_DATA)) {
      if (q.includes(key) || key.includes(q)) {
        return MOCK_DATA[key];
      }
    }
    return null;
  }

  // Open modal on trigger click
  triggerInput.addEventListener('click', openModal);
  triggerInput.addEventListener('focus', openModal);

  // Close modal
  closeBtn.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Escape key closes modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Handle search
  function handleSearch(query) {
    const data = findMockData(query);
    if (data) {
      showResults(data);
    }
  }

  mainInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSearch(mainInput.value);
    }
  });

  // Chip clicks - instant search
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.dataset.query || chip.textContent.toLowerCase();
      mainInput.value = query;
      handleSearch(query);
    });
  });

  // Back button
  backBtn.addEventListener('click', hideResults);

  console.log('✅ STACKS Widget loaded!');
  console.log('   Demo queries: "like succession" or "ancient egypt"');
  console.log('   Click a chip to search instantly.');
})();
