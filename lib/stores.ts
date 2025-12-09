/**
 * Store configuration management
 * MVP: Manual JSON files in /stores directory
 * Phase 2: Database-backed with admin dashboard
 */

import type { Store } from './types';

// Demo store for showcasing the product
export const demoStore: Store = {
  slug: 'demo',
  name: 'Demo Bookstore',
  logo: '/stores/demo/logo.png',
  tagline: 'AI-Powered Book Discovery',
};

// Quail Ridge Books - Raleigh, NC
export const quailRidgeStore: Store = {
  slug: 'quail',
  name: 'Quail Ridge Books',
  logo: '/stores/quail/logo.png',
  tagline: 'North Hills • Raleigh, NC',
  contactPhone: '919.828.1588',
};

// Store registry (MVP: hardcoded, Phase 2: from DB)
const stores: Record<string, Store> = {
  demo: demoStore,
  quail: quailRidgeStore,
};

/**
 * Get store by slug
 */
export function getStore(slug: string): Store | null {
  return stores[slug] || null;
}

/**
 * Get all available stores
 */
export function getAllStores(): Store[] {
  return Object.values(stores);
}

/**
 * Check if store exists
 */
export function storeExists(slug: string): boolean {
  return slug in stores;
}
