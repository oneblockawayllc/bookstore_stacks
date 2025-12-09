import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-light-primary dark:bg-dark-primary flex items-center justify-center p-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🏪</div>
        <h1 className="font-display font-black text-3xl uppercase tracking-tight text-light-text dark:text-dark-text mb-2">
          Store Not Found
        </h1>
        <p className="text-light-textSecondary dark:text-dark-textSecondary font-semibold mb-6">
          This bookstore doesn't exist or hasn't been set up yet.
        </p>
        <Link
          href="/demo"
          className="inline-block px-6 py-3 bg-accent-cyan border-[5px] border-light-border dark:border-dark-border rounded-xl font-black uppercase text-sm text-white shadow-brutal-badge hover:shadow-brutal-button transition-all"
        >
          Try Demo Store
        </Link>
      </div>
    </div>
  );
}
