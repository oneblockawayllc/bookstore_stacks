"use client";

interface VibeChipsProps {
  onVibeClick: (vibe: string) => void;
}

const VIBE_TAGS = [
  "Dark Academia",
  "Cozy Fantasy",
  "Romantasy",
  "Enemies to Lovers",
  "Found Family",
  "Slow Burn",
  "Psychological Thriller",
  "Uplifting",
];

export default function VibeChips({ onVibeClick }: VibeChipsProps) {
  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 py-2" style={{ width: "max-content" }}>
        {VIBE_TAGS.map((vibe) => (
          <button
            key={vibe}
            onClick={() => onVibeClick(vibe)}
            className="badge-brutal bg-white dark:bg-dark-secondary hover:shadow-brutal-button whitespace-nowrap"
          >
            {vibe}
          </button>
        ))}
      </div>
    </div>
  );
}
