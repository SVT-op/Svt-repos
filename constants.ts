import { Manga, Chapter, UserRole, User } from './types';

export const GENRES = [
  "Action", "Adventure", "Comedy", "Drama", "Fantasy", 
  "Horror", "Isekai", "Mystery", "Romance", "Sci-Fi", "Slice of Life", "Thriller"
];

// Mock Admin User
export const MOCK_ADMIN: User = {
  id: 'admin_thorat',
  username: 'ThoratShreyash',
  email: 'thoratshreyash3@gmail.com',
  avatarUrl: 'https://ui-avatars.com/api/?name=TS&background=22c55e&color=fff',
  role: UserRole.ADMIN,
  favorites: ['m1', 'm3'],
  history: []
};

// Mock Manga Data
export const MOCK_MANGA: Manga[] = [
  {
    id: 'm1',
    title: "Solo Leveling: Reawakened",
    description: "In a world where hunters must battle deadly monsters to protect the human race from certain annihilation, a notoriously weak hunter named Sung Jinwoo finds himself in a seemingly endless struggle for survival.",
    author: "Chugong",
    coverUrl: "https://picsum.photos/seed/solo/400/600",
    genres: ["Action", "Fantasy"],
    status: 'Ongoing',
    rating: 4.9,
    views: 1250000,
    likes: 45000,
    updatedAt: new Date().toISOString(),
    uploaderId: 'u1'
  },
  {
    id: 'm2',
    title: "The Beginning After The End",
    description: "King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability. However, solitude lingers closely behind those with great power.",
    author: "TurtleMe",
    coverUrl: "https://picsum.photos/seed/tbate/400/600",
    genres: ["Adventure", "Isekai", "Magic"],
    status: 'Ongoing',
    rating: 4.8,
    views: 980000,
    likes: 32000,
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    uploaderId: 'u2'
  },
  {
    id: 'm3',
    title: "Omniscient Reader",
    description: "Dokja was an average office worker whose sole interest was reading his favorite web novel 'Three Ways to Survive the Apocalypse'.",
    author: "singNsong",
    coverUrl: "https://picsum.photos/seed/orv/400/600",
    genres: ["Fantasy", "Action"],
    status: 'Ongoing',
    rating: 4.9,
    views: 1100000,
    likes: 50000,
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    uploaderId: 'u1'
  },
  {
    id: 'm4',
    title: "Lore Olympus",
    description: "Witness what the gods do…after dark. The friendships and the lies, the gossip and the wild parties, and of course, forbidden love.",
    author: "Rachel Smythe",
    coverUrl: "https://picsum.photos/seed/lore/400/600",
    genres: ["Romance", "Drama"],
    status: 'Completed',
    rating: 4.7,
    views: 2000000,
    likes: 80000,
    updatedAt: new Date(Date.now() - 604800000).toISOString(),
    uploaderId: 'u3'
  },
  {
    id: 'm5',
    title: "Tower of God",
    description: "Reach the top, and everything will be yours. At the top of the tower exists everything in this world, and all of it can be yours.",
    author: "SIU",
    coverUrl: "https://picsum.photos/seed/tog/400/600",
    genres: ["Fantasy", "Adventure"],
    status: 'Ongoing',
    rating: 4.6,
    views: 3000000,
    likes: 95000,
    updatedAt: new Date().toISOString(),
    uploaderId: 'u3'
  }
];

// Mock Chapters Generator
export const getMockChapters = (mangaId: string): Chapter[] => {
  return Array.from({ length: 10 }).map((_, i) => ({
    id: `c${mangaId}-${10 - i}`,
    mangaId,
    title: `Episode ${10 - i}`,
    number: 10 - i,
    pages: [
      `https://picsum.photos/seed/${mangaId}-${10 - i}-1/800/1200`,
      `https://picsum.photos/seed/${mangaId}-${10 - i}-2/800/1200`,
      `https://picsum.photos/seed/${mangaId}-${10 - i}-3/800/1200`,
      `https://picsum.photos/seed/${mangaId}-${10 - i}-4/800/1200`,
    ],
    views: Math.floor(Math.random() * 10000),
    createdAt: new Date(Date.now() - i * 86400000).toISOString()
  }));
};