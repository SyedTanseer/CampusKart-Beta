import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Constructs a valid URL for images based on the provided path
 * @param path The image path to process
 * @returns A complete URL to the image
 */
export function getImageUrl(path: string | undefined | null): string | null {
  if (!path) return null;
  
  // Convert Windows backslashes to forward slashes
  const normalizedPath = path.replace(/\\/g, '/');
  
  // Already a full URL
  if (normalizedPath.startsWith('http')) {
    return normalizedPath;
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  
  // Check for duplicate paths like "uploads/profiles/uploads/profiles/"
  if (normalizedPath.includes('uploads/profiles/uploads/profiles')) {
    const fixedPath = normalizedPath.replace('uploads/profiles/uploads/profiles', 'uploads/profiles');
    return `${baseUrl}/${fixedPath}`;
  }
  
  // Path already includes uploads directory (avoid duplications)
  if (normalizedPath.includes('uploads/')) {
    return `${baseUrl}/${normalizedPath}`;
  }
  
  // Path starts with slash
  if (normalizedPath.startsWith('/')) {
    return `${baseUrl}${normalizedPath}`;
  }
  
  // Assume it's a profile picture filename
  return `${baseUrl}/uploads/profiles/${normalizedPath}`;
}
