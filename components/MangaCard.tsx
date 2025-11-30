import React from 'react';
import { Manga } from '../types';

interface MangaCardProps {
  manga: Manga;
  onClick: (id: string) => void;
  compact?: boolean;
}

export const MangaCard: React.FC<MangaCardProps> = ({ manga, onClick, compact = false }) => {
  return (
    <div 
      onClick={() => onClick(manga.id)}
      className="group cursor-pointer flex flex-col gap-2"
    >
      <div className="relative overflow-hidden rounded-lg aspect-[2/3] shadow-md hover:shadow-xl transition-all duration-300">
        <img 
          src={manga.coverUrl} 
          alt={manga.title} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
          {manga.rating}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-white text-xs line-clamp-2">{manga.description}</p>
        </div>
      </div>
      <div>
        <h3 className={`font-semibold text-slate-900 dark:text-white leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors ${compact ? 'text-sm' : 'text-base'}`}>
          {manga.title}
        </h3>
        {!compact && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{manga.genres.slice(0, 2).join(', ')}</p>
        )}
      </div>
    </div>
  );
};