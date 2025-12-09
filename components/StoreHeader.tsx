"use client";

import type { Store } from "@/lib/types";

interface StoreHeaderProps {
  store: Store;
}

export default function StoreHeader({ store }: StoreHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      {store.logo && (
        <img
          src={store.logo}
          alt={`${store.name} logo`}
          className="w-10 h-10 rounded-xl border-[3px] border-light-border dark:border-dark-border"
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />
      )}
      <div>
        <h1 className="font-display font-black text-2xl uppercase tracking-tight text-light-text dark:text-dark-text">
          {store.name}
        </h1>
        {store.tagline && (
          <p className="text-sm font-semibold text-light-textSecondary dark:text-dark-textSecondary">
            {store.tagline}
          </p>
        )}
      </div>
    </div>
  );
}
