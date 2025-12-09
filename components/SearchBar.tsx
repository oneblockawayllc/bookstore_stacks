"use client";

import { Sparkles, X } from "lucide-react";
import { useState, useEffect } from "react";

const defaultPlaceholders = [
  "try: 'cozy mystery in a bookshop'",
  "try: 'like Succession but a book'",
  "try: 'uplifting after a hard week'",
  "try: 'dark academia vibes'",
  "try: 'found family fantasy'",
];

interface SearchBarProps {
  placeholder?: string;
  placeholders?: string[];
  onSearch?: (query: string) => void;
  onClear?: () => void;
  loading?: boolean;
}

export default function SearchBar({
  placeholder,
  placeholders = defaultPlaceholders,
  onSearch,
  onClear,
  loading = false,
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    if (placeholder || query) return;

    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [placeholder, placeholders.length, query]);

  const currentPlaceholder = placeholder || placeholders[placeholderIndex];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery("");
    if (onClear) {
      onClear();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={currentPlaceholder}
          className="w-full px-5 py-[18px] pl-14 pr-14 border-4 border-black dark:border-white
                   bg-white dark:bg-dark-secondary text-black dark:text-white
                   font-semibold text-lg rounded-xl
                   shadow-brutal-sm focus:shadow-brutal-input-focus
                   focus:outline-none focus:-translate-x-[1px] focus:-translate-y-[1px]
                   transition-all placeholder:text-gray-500 dark:placeholder:text-gray-400"
          disabled={loading}
        />

        <div className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" strokeWidth={2.5} />
        </div>

        {query && !loading && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-5 top-1/2 -translate-y-1/2
                     text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-400
                     transition-colors"
          >
            <X className="w-5 h-5" strokeWidth={2.5} />
          </button>
        )}

        {loading && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2">
            <div className="w-5 h-5 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </form>
  );
}
