export enum UserRole {
  USER = 'USER',
  UPLOADER = 'UPLOADER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  role: UserRole;
  favorites: string[]; // Manga IDs
  history: { mangaId: string; chapterId: string; timestamp: number }[];
}

export interface Chapter {
  id: string;
  mangaId: string;
  title: string;
  number: number;
  pages: string[]; // URLs
  views: number;
  createdAt: string;
}

export interface Manga {
  id: string;
  title: string;
  description: string;
  author: string;
  coverUrl: string;
  genres: string[];
  status: 'Ongoing' | 'Completed' | 'Hiatus';
  rating: number; // 0-5
  views: number;
  likes: number;
  updatedAt: string;
  uploaderId: string;
}

export type ReadingMode = 'vertical' | 'horizontal';
export type Theme = 'light' | 'dark';