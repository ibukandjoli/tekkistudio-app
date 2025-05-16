// app/lib/utils.ts

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind CSS
 * Combines clsx and tailwind-merge to handle conditional classes and conflicting Tailwind classes
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a price with currency symbol and proper formatting
 * @param price - The price to format
 * @param currency - The currency code (default: 'XOF')
 * @param locale - The locale for formatting (default: 'fr-FR')
 * @returns Formatted price string
 */
export function formatPrice(
  price: number,
  currency: string = 'XOF',
  locale: string = 'fr-FR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Debounce function to limit how often a function can be called
 * @param func - The function to debounce
 * @param delay - The delay in milliseconds
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return function(...args: Parameters<T>): void {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

/**
 * Get a random item from an array
 * @param array - The array to get a random item from
 * @returns A random item from the array
 */
export function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Truncate a string to a certain length and add ellipsis
 * @param str - The string to truncate
 * @param length - The maximum length
 * @returns Truncated string
 */
export function truncateString(str: string, length: number): string {
  return str.length > length ? str.substring(0, length) + '...' : str;
}

/**
 * Calculate percentage
 * @param value - The value to calculate percentage for
 * @param total - The total value
 * @returns The percentage value
 */
export function calculatePercentage(value: number, total: number): number {
  return (value / total) * 100;
}

/**
 * Get a human-readable time from a date
 * @param date - The date to format
 * @returns A human-readable time string
 */
export function getHumanReadableTime(date: Date): string {
  const now = new Date();
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000); // Difference in seconds
  
  if (diff < 60) return 'À l\'instant';
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} minute${Math.floor(diff / 60) > 1 ? 's' : ''}`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} heure${Math.floor(diff / 3600) > 1 ? 's' : ''}`;
  if (diff < 2592000) return `Il y a ${Math.floor(diff / 86400)} jour${Math.floor(diff / 86400) > 1 ? 's' : ''}`;
  if (diff < 31536000) return `Il y a ${Math.floor(diff / 2592000)} mois`;
  
  return `Il y a ${Math.floor(diff / 31536000)} an${Math.floor(diff / 31536000) > 1 ? 's' : ''}`;
}

/**
 * Check if an element is in viewport
 * @param el - The element to check
 * @returns Boolean indicating if element is in viewport
 */
export function isInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * Smooth scroll to an element
 * @param elementId - The ID of the element to scroll to
 */
export function scrollToElement(elementId: string): void {
  const element = document.getElementById(elementId);
  
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}

/**
 * Generate a unique ID
 * @returns A unique ID string
 */
export function generateUniqueId(): string {
  return `id-${Math.random().toString(36).substring(2, 9)}`;
}