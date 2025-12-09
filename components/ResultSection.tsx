"use client";

import { Check, Package } from "lucide-react";
import type { BookSearchMatch } from "@/lib/types";

interface ResultSectionProps {
  icon: string;
  title: string;
  tags: string[];
  tagColor: string;
  books: BookSearchMatch[];
  onBookClick: (book: BookSearchMatch) => void;
}

function AvailabilityBadge({ availability }: { availability: 'in_stock' | 'can_order' }) {
  if (availability === 'in_stock') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500 border-2 border-light-border dark:border-dark-border rounded-lg text-[10px] font-black uppercase text-white">
        <Check size={10} strokeWidth={3} />
        In Stock
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500 border-2 border-light-border dark:border-dark-border rounded-lg text-[10px] font-black uppercase text-light-text">
      <Package size={10} strokeWidth={3} />
      Can Order
    </span>
  );
}

export default function ResultSection({
  icon,
  title,
  tags,
  tagColor,
  books,
  onBookClick,
}: ResultSectionProps) {
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">{icon}</span>
        <h2 className="font-display font-black text-xl uppercase tracking-tight text-light-text dark:text-dark-text">
          {title}
        </h2>
      </div>

      {/* Tags - Compact horizontal scroll on mobile */}
      {tags.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
          {tags.map((tag, index) => (
            <span
              key={index}
              className={`flex-shrink-0 px-3 py-1 border-2 border-light-border dark:border-dark-border rounded-lg text-[10px] font-black uppercase ${tagColor}`}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Book Cards - Mobile: stacked, Tablet+: side-by-side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {books.length === 0 ? (
          <div className="col-span-full text-center py-6 px-4 bg-light-secondary dark:bg-dark-secondary border-[3px] border-light-border dark:border-dark-border rounded-xl">
            <p className="font-semibold text-sm text-light-textSecondary dark:text-dark-textSecondary">
              No books found in this category
            </p>
          </div>
        ) : (
          books.map((bookMatch) => (
            <button
              key={bookMatch.book.id}
              onClick={() => onBookClick(bookMatch)}
              className="group w-full text-left flex gap-3 p-3 bg-light-secondary dark:bg-dark-secondary border-[4px] border-light-border dark:border-dark-border rounded-2xl shadow-brutal-card hover:shadow-brutal-hover transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0 active:translate-y-0 active:shadow-brutal-badge"
            >
              {/* Book Cover */}
              <div className="w-[70px] h-[105px] flex-shrink-0 border-2 border-light-border dark:border-dark-border rounded-lg overflow-hidden relative bg-light-primary dark:bg-dark-primary">
                <img
                  src={bookMatch.book.cover}
                  alt={`${bookMatch.book.title} cover`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                    if (placeholder) placeholder.style.display = 'flex';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-accent flex items-center justify-center text-2xl" style={{ display: 'none' }}>
                  📚
                </div>
              </div>

              {/* Book Info */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h3 className="font-black text-sm leading-tight mb-0.5 text-light-text dark:text-dark-text line-clamp-2 group-hover:text-accent-purple transition-colors">
                    {bookMatch.book.title}
                  </h3>
                  <p className="font-semibold text-xs text-light-textSecondary dark:text-dark-textSecondary mb-1.5 truncate">
                    {bookMatch.book.author}
                  </p>
                  <p className="font-medium text-[11px] text-light-textTertiary dark:text-dark-textTertiary leading-snug line-clamp-2">
                    {Object.values(bookMatch.matchReasons).flat().slice(0, 2).join(" • ")}
                  </p>
                </div>

                {/* Footer - Badges row */}
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  <AvailabilityBadge availability={bookMatch.availability || 'can_order'} />
                  <span className="px-2 py-1 bg-accent-purple border-2 border-light-border dark:border-dark-border rounded-lg text-[10px] font-black uppercase text-white">
                    {bookMatch.matchPercentage}%
                  </span>
                  <span className="text-[10px] font-bold text-light-textTertiary dark:text-dark-textTertiary uppercase ml-auto">
                    {bookMatch.book.pageCount}p
                  </span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </section>
  );
}
