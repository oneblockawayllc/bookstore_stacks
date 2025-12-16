# Gen Z Product Showcase Skill Design

**Date**: 2025-12-16
**Status**: Draft - Awaiting Approval

---

## Overview

A Claude skill for creating product showcase landing pages that combine professional credibility with Gen Z design sensibility. Primary use case: pitching STACKS widget to bookstore owners.

### Core Tension Resolved

B2B buyers (bookstore owners, often older) need to trust the product AND see that it appeals to their younger customers. The design must feel premium and professional while demonstrating Gen Z fluency.

### Success Criteria

- Bookstore owner thinks "this looks legit and modern"
- Gen Z visitor thinks "finally, someone gets it"
- Clear value proposition in <5 seconds
- Every section earns its place

---

## Content Strategy

### Section Flow (Sales Brochure Style)

**1. Hero** (~viewport height)
- Headline: Clear value prop
- Subhead: The outcome
- Visual: Product in action
- No CTA - let them scroll, build interest

**2. Problem** (~half viewport)
- Lead with pain: "Customers browse. They leave empty-handed."
- Two pain points:
  - Discovery friction: "They don't know what they want"
  - Scale problem: "Your staff can't be everywhere"
- Tone: Empathetic, not alarming

**3. Solution** (~half viewport)
- Transition: "What if customers could search by feeling?"
- AI-powered vibe matching, kept simple
- Save details for placement sections

**4. Example Positions** (3 placements)
- **Search bar position** - "Meet them where they already look"
- **FAB button position** - "Always accessible, never intrusive"
- **Dedicated page position** - "The full discovery experience"
- Each: Visual mockup showing where it lives + brief copy

**5. CTA** (final section)
- Single focused ask: "Let's chat about it"
- Contact/demo request
- This is the only CTA on the page

---

## Technical Philosophy

### Always Interactive

Every page is a living experience, not a static brochure. These are tools in the toolkit - use what the page needs, not everything available.

### Scroll-Driven Storytelling
- Sections reveal on scroll (intersection observer, scroll-triggered animations)
- Parallax layers for depth
- Sticky elements that transform as you scroll past
- Progress indicators that feel native

### Micro-Interactions
- Buttons that breathe, magnetic hover effects
- Text that splits and animates on reveal
- Cards that tilt on hover (3D transforms)
- Cursor effects when appropriate

### WebGL / Canvas (When It Earns It)
- Hero backgrounds with particle systems or gradient meshes
- Subtle noise/grain overlays for texture
- 3D product mockups that respond to mouse
- Know when CSS is enough

### Performance-Aware
- Progressive enhancement - works without JS, delights with it
- Lazy load heavy effects
- Respects reduced-motion preferences

### Tech Toolkit
- GSAP / ScrollTrigger for complex animations
- Framer Motion for React contexts
- Three.js / WebGL for 3D when needed
- Pure CSS for everything it can handle

---

## Design System

### Primary Reference: Neobrutalist Tokens

```typescript
// From bookstore-discover tailwind.config.ts

colors: {
  light: {
    primary: "#F4EFEA",
    secondary: "#FFFFFF",
    tertiary: "#FAFAFA",
    text: "#383838",
    textSecondary: "#6B6B6B",
    textTertiary: "#999999",
    border: "#383838",
    borderSecondary: "#C4C4C4",
  },
  dark: {
    primary: "#1a1a1a",
    secondary: "#2a2a2a",
    tertiary: "#1f1f1f",
    text: "#ffffff",
    textSecondary: "#e0e0e0",
    textTertiary: "#999999",
    border: "#ffffff",
    borderSecondary: "#444444",
  },
  accent: {
    cyan: "#6FC2FF",
    cyanHover: "#2BA5FF",
    yellow: "#EAC435",
    coral: "#FF7169",
    teal: "#53DBC9",
    purple: "#667eea",
  },
}

// Typography
fontFamily: {
  display: ["Unbounded", "system-ui", "sans-serif"],  // Bold, uppercase, tight tracking
  sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "system-ui", "sans-serif"],
}

// Brutal shadows
boxShadow: {
  "brutal-card": "-8px 8px 0 0 rgb(var(--shadow-color))",
  "brutal-button": "-4px 4px 0 0 rgb(var(--shadow-color))",
  "brutal-button-hover": "-6px 6px 0 0 rgb(var(--shadow-color))",
  "brutal-hover": "-10px 10px 0 0 rgb(var(--shadow-color))",
}

// Border widths
borderWidth: {
  '3': '3px',
  '5': '5px',
}
```

### Underlying Principles (For Adaptation)

When adapting to other contexts, these principles guide the aesthetic:

- **Contrast is confidence** - Bold borders, clear hierarchy, nothing wishy-washy
- **Shadows create dimension** - Offset shadows over drop shadows
- **Color with purpose** - Neutral base, accent for action/emphasis
- **Type as personality** - Display font carries brand, body stays readable
- **Texture over flat** - Subtle grain, mesh gradients, layered depth
- **Don't be afraid of HUGE type** - Headlines should command attention

---

## Output Flexibility

The skill guides content strategy and design principles. Claude chooses format based on context:

- **Standalone HTML** - Self-contained with inline styles/scripts for quick previews and sharing
- **Next.js pages** - Uses existing Tailwind config, integrates into repo structure
- **Component-based** - Reusable sections when building a library

---

## Skill File Structure

```
~/.claude/skills/gen-z-product-showcase/
├── SKILL.md                      # Main skill file
└── references/
    ├── design-tokens.md          # Neobrutalist Tailwind reference
    └── animation-patterns.md     # Code snippets for scroll/micro animations
```

---

## What the Skill Does NOT Do

- Dictate exact copy (user provides product details)
- Force every animation technique (toolkit, not checklist)
- Lock to one output format (flexible to context)
- Over-engineer simple requests

---

## Next Steps

1. Review and approve this design
2. Create skill file structure
3. Write SKILL.md with full instructions
4. Add reference files with code examples
5. Test with a real STACKS landing page build
