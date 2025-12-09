"use client";

import { useRouter, useParams } from "next/navigation";
import SearchBar from "@/components/SearchBar";
import VibeChips from "@/components/VibeChips";
import { getStore } from "@/lib/stores";
import { notFound } from "next/navigation";

export default function DiscoverPage() {
  const router = useRouter();
  const params = useParams();
  const storeSlug = params.storeSlug as string;

  const store = getStore(storeSlug);

  if (!store) {
    notFound();
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/${storeSlug}/results?q=${encodeURIComponent(query)}`);
    }
  };

  const handleVibeClick = (vibe: string) => {
    router.push(`/${storeSlug}/results?q=${encodeURIComponent(vibe)}`);
  };

  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary">
      {/* Atmospheric background */}
      <div className="fixed inset-0 opacity-[0.02] dark:opacity-[0.04] pointer-events-none mix-blend-multiply dark:mix-blend-screen">
        <div className="absolute inset-0 bg-mesh-cool"></div>
      </div>

      {/* Hero Section - Responsive */}
      <div className="relative z-10 border-b-[5px] border-light-border dark:border-dark-border bg-light-secondary/95 dark:bg-dark-secondary/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
          {/* Store Branding - Centered on desktop */}
          <div className="flex flex-col items-center text-center mb-8 md:mb-12">
            {store.logo && (
              <img
                src={store.logo}
                alt={`${store.name} logo`}
                className="max-h-24 md:max-h-32 w-auto mb-4"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            )}
            <h1 className="font-display font-black text-4xl md:text-6xl uppercase tracking-tight text-light-text dark:text-dark-text mb-2">
              Discover
            </h1>
            <p className="text-base md:text-lg font-semibold text-light-textSecondary dark:text-dark-textSecondary">
              Powered by <span className="font-display font-black text-light-text dark:text-dark-text tracking-tight">STACKS</span>
            </p>
            <p className="text-light-textSecondary dark:text-dark-textSecondary font-semibold mt-2 max-w-md">
              Describe what you're in the mood for—a vibe, a feeling, or even a movie you love—and we'll find the perfect book.
            </p>
          </div>

          {/* Hero Search - Larger on desktop */}
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              loading={false}
            />

            {/* Vibe Chips */}
            <div className="mt-6">
              <VibeChips onVibeClick={handleVibeClick} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Example searches */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight text-light-text dark:text-dark-text mb-2">
            Find Your Next Read
          </h2>
          <p className="text-light-textSecondary dark:text-dark-textSecondary font-semibold">
            Search for books using natural language or tap a vibe above
          </p>
        </div>

        {/* Example Searches - Grid on desktop */}
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-black uppercase text-light-textTertiary dark:text-dark-textTertiary text-center mb-4">
            Try These
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "cozy fantasy with found family",
              "like Succession but a book",
              "dark academia with secret societies",
              "uplifting after a hard week"
            ].map((example) => (
              <button
                key={example}
                onClick={() => handleSearch(example)}
                className="w-full text-left px-4 py-3 bg-light-secondary dark:bg-dark-secondary border-[3px] border-light-border dark:border-dark-border rounded-xl font-semibold text-light-text dark:text-dark-text hover:shadow-brutal-button transition-all hover:-translate-x-0.5 hover:-translate-y-0.5"
              >
                "{example}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
