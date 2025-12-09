"use client";

import { Check, Package, Mail, Phone } from "lucide-react";
import type { Book, BookAvailability } from "@/lib/types";
import Modal from "./Modal";

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  matchPercentage?: number;
  matchReasons?: string[];
  availability?: BookAvailability;
}

export default function BookDetailModal({
  book,
  isOpen,
  onClose,
  matchPercentage,
  matchReasons,
  availability,
}: BookDetailModalProps) {
  if (!book) return null;

  const handleRequestBook = () => {
    // TODO: Integrate with store contact
    alert(`Request sent for "${book.title}"! The bookstore will contact you.`);
  };

  const handleContactShop = () => {
    // TODO: Integrate with store contact info
    alert('Contact: demo@bookstore.com | (555) 123-4567');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={book.title}>
      <div className="space-y-6">
        {/* Book Header */}
        <div className="flex gap-6">
          {/* Cover */}
          <div className="flex-shrink-0">
            <div className="w-32 h-48 border-[5px] border-light-border dark:border-dark-border shadow-brutal-badge rounded-[20px] overflow-hidden">
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                  if (placeholder) placeholder.style.display = 'flex';
                }}
              />
              <div className="w-full h-full bg-gradient-secondary flex items-center justify-center text-4xl" style={{ display: 'none' }}>
                📚
              </div>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="font-display font-black text-2xl uppercase tracking-tight text-light-text dark:text-dark-text mb-2">
              {book.title}
            </h3>
            <p className="font-bold text-sm text-light-textSecondary dark:text-dark-textSecondary mb-4">
              by {book.author}
            </p>

            {/* Availability + Match Badges - Side by side */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              {availability && (
                availability === 'in_stock' ? (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 border-[3px] border-light-border dark:border-dark-border rounded-xl text-sm font-black uppercase text-white shadow-brutal-badge">
                    <Check size={16} strokeWidth={3} />
                    <span>In Stock</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-500 border-[3px] border-light-border dark:border-dark-border rounded-xl text-sm font-black uppercase text-light-text shadow-brutal-badge">
                    <Package size={16} strokeWidth={3} />
                    <span>Can Order</span>
                  </div>
                )
              )}
              {matchPercentage && (
                <span className="inline-block px-4 py-2 bg-accent-purple text-white font-black text-sm uppercase border-[3px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-badge">
                  {matchPercentage}% Match
                </span>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl px-3 py-2">
                <p className="text-xs font-black uppercase text-light-textTertiary dark:text-dark-textTertiary">Pages</p>
                <p className="text-lg font-black text-light-text dark:text-dark-text">{book.pageCount}</p>
              </div>
              <div className="bg-light-primary dark:bg-dark-primary border-[3px] border-light-border dark:border-dark-border rounded-xl px-3 py-2">
                <p className="text-xs font-black uppercase text-light-textTertiary dark:text-dark-textTertiary">Year</p>
                <p className="text-lg font-black text-light-text dark:text-dark-text">{book.publishYear}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Synopsis */}
        {book.metadata?.synopsis && (
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-light-text dark:text-dark-text mb-3">
              About
            </h4>
            <p className="text-light-textSecondary dark:text-dark-textSecondary font-medium leading-relaxed">
              {book.metadata.synopsis}
            </p>
          </div>
        )}

        {/* Match Reasons */}
        {matchReasons && matchReasons.length > 0 && (
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-light-text dark:text-dark-text mb-3">
              Why This Matches
            </h4>
            <div className="space-y-2">
              {matchReasons.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-600 dark:bg-purple-400 mt-2 flex-shrink-0" />
                  <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Genres */}
        <div>
          <h4 className="font-black text-sm uppercase tracking-tight text-light-text dark:text-dark-text mb-3">
            Genres
          </h4>
          <div className="flex flex-wrap gap-2">
            {book.genres.map((genre) => (
              <span
                key={genre}
                className="px-4 py-2 bg-accent-cyan text-white font-black text-sm uppercase border-[3px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-badge"
              >
                {genre}
              </span>
            ))}
          </div>
        </div>

        {/* Mood */}
        {book.metadata?.mood && book.metadata.mood.length > 0 && (
          <div>
            <h4 className="font-black text-sm uppercase tracking-tight text-light-text dark:text-dark-text mb-3">
              Mood
            </h4>
            <div className="flex flex-wrap gap-2">
              {book.metadata.mood.map((mood) => (
                <span
                  key={mood}
                  className="px-4 py-2 bg-accent-yellow text-light-text font-black text-sm uppercase border-[3px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-badge"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-[3px] border-light-border dark:border-dark-border">
          <button
            onClick={handleRequestBook}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-accent-cyan text-white font-black text-sm uppercase border-[5px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-card hover:shadow-brutal-hover hover:-translate-x-1 hover:-translate-y-1 transition-all"
          >
            <Mail size={18} strokeWidth={3} />
            <span>Request This Book</span>
          </button>
          <button
            onClick={handleContactShop}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text font-black text-sm uppercase border-[5px] border-light-border dark:border-dark-border rounded-xl shadow-brutal-card hover:shadow-brutal-hover hover:-translate-x-1 hover:-translate-y-1 transition-all"
          >
            <Phone size={18} strokeWidth={3} />
            <span>Contact Shop</span>
          </button>
        </div>
      </div>
    </Modal>
  );
}
