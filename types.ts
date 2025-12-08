
export enum UserRole {
  USER = 'user', // Renter (Public doesn't strictly need login, but this is for potential expansion)
  OWNER = 'owner',
  ADMIN = 'admin'
}

export enum ItemStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  REJECTED = 'rejected'
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  // New Profiling Fields
  bio?: string;
  avatarUrl?: string;
  joinDate: string;
  isVerified: boolean; // Admin verified
  hasSelfieVerified: boolean; // Webcam verified
  selfieUrl?: string;
  trustScore: number; // 0 to 100
}

export interface Item {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  location: string;
  pricePerDay: number; // 0 means 'Contact for price'
  contactPhone: string;
  imageUrl: string;
  status: ItemStatus;
  isFeatured: boolean;
  isAvailable: boolean; // Owner can toggle this (e.g., currently rented out)
  createdAt: string;
}

export interface AdBanner {
  id: string;
  position: 'top' | 'sidebar' | 'list_insert';
  imageUrl: string;
  linkUrl: string;
  title: string;
}

export const CATEGORIES = [
  "Tools & Hardware",
  "Camping & Outdoor",
  "Electronics & Gadgets",
  "Party & Events",
  "Barang Bayi",
  "Pakaian & Kostum",
  "Perabot",
  "Lain-lain"
];

export const LOCATIONS = [
  "Precint 1", "Precint 2", "Precint 3", "Precint 4",
  "Precint 5", "Precint 6", "Precint 7", "Precint 8",
  "Precint 9", "Precint 10", "Precint 11", "Precint 12",
  "Precint 13", "Precint 14", "Precint 15", "Precint 16",
  "Lot kedai 1 (Shell)",
  "Lot kedai 2 (TMB)",
  "Tasek"
];