import React, { useState, useEffect, createContext, useContext } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MOCK_ADMIN, MOCK_MANGA, GENRES, getMockChapters } from './constants';
import { User, Manga, Chapter, Theme, UserRole } from './types';
import { Button } from './components/Button';
import { MangaCard } from './components/MangaCard';
import { getMangaRecommendations } from './services/geminiService';

// --- CONTEXT DEFINITIONS ---
interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  user: User | null;
  login: () => void;
  logout: () => void;
  allManga: Manga[];
  addManga: (manga: Manga) => void;
  deferredPrompt: any;
  installApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};

// --- PAGES & COMPONENTS ---

// 1. Navbar
const Navbar = () => {
  const { theme, toggleTheme, user, login, logout, deferredPrompt, installApp } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(searchQuery.trim()) navigate(`/search?q=${searchQuery}`);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2 md:gap-8">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">O</div>
              <span className="hidden md:inline text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-600 to-emerald-500">OneStop Manga</span>
              <span className="md:hidden text-lg font-bold text-brand-600">OneStop</span>
            </Link>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link to="/" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Home</Link>
              <Link to="/search" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Explore</Link>
              <Link to="/rankings" className="hover:text-brand-600 dark:hover:text-brand-400 transition-colors">Rankings</Link>
              {user?.role === UserRole.ADMIN && (
                <span className="text-red-500 font-bold px-2 py-0.5 border border-red-200 bg-red-50 dark:bg-red-900/30 dark:border-red-900 rounded text-xs">ADMIN</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
             {/* PWA Install Button */}
            {deferredPrompt && (
              <button 
                onClick={installApp}
                className="hidden md:flex items-center gap-2 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                Install App
              </button>
            )}

            <form onSubmit={handleSearch} className="hidden md:block relative">
              <input 
                type="text" 
                placeholder="Search..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-10 pr-4 py-2 rounded-full bg-slate-100 dark:bg-slate-800 border-none focus:ring-2 focus:ring-brand-500 text-sm transition-all"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </form>

            <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              {theme === 'dark' ? (
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
              ) : (
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              )}
            </button>

            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/upload" className="hidden sm:block">
                   <Button size="sm" variant="primary">Upload</Button>
                </Link>
                <div className="w-8 h-8 rounded-full bg-brand-100 overflow-hidden cursor-pointer border border-brand-200" onClick={logout} title={`Logged in as ${user.email}`}>
                  <img src={user.avatarUrl} alt={user.username} className="w-full h-full object-cover" />
                </div>
              </div>
            ) : (
              <Button size="sm" variant="outline" onClick={login}>Login</Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// 2. Ad Banner
const AdBanner = () => (
  <div className="w-full h-24 bg-slate-200 dark:bg-slate-800 my-8 rounded-lg flex items-center justify-center relative overflow-hidden">
    <span className="text-slate-400 text-xs font-mono border border-slate-400 px-2 py-1 rounded">ADVERTISEMENT</span>
  </div>
);

// 3. Home Page
const HomePage = () => {
  const { allManga } = useAppContext();
  const navigate = useNavigate();
  
  const featured = allManga[0];
  const trending = allManga.slice(0, 4);
  const newUploads = allManga.slice(2, 5);

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="relative h-[500px] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src={featured.coverUrl} className="w-full h-full object-cover blur-sm opacity-50 dark:opacity-30" alt="Background" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 dark:from-slate-950 to-transparent" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="flex flex-col md:flex-row gap-8 items-end md:items-center">
            <img 
              src={featured.coverUrl} 
              alt={featured.title} 
              className="w-48 md:w-64 rounded-xl shadow-2xl transform rotate-[-5deg] border-4 border-white dark:border-slate-800"
            />
            <div className="max-w-2xl mb-8 md:mb-0">
              <span className="inline-block px-3 py-1 bg-brand-500 text-white text-xs font-bold rounded-full mb-4">FEATURED TODAY</span>
              <h1 className="text-4xl md:text-6xl font-bold mb-4 text-slate-900 dark:text-white leading-tight">{featured.title}</h1>
              <p className="text-lg text-slate-700 dark:text-slate-300 mb-6 line-clamp-3">{featured.description}</p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate(`/manga/${featured.id}`)}>Read Now</Button>
                <Button size="lg" variant="secondary">Add to Favorites</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-brand-500">🔥</span> Trending Now
            </h2>
            <Link to="/search?sort=trending" className="text-brand-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {trending.map(m => <MangaCard key={m.id} manga={m} onClick={(id) => navigate(`/manga/${id}`)} />)}
          </div>
        </section>

        <AdBanner />

        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-blue-500">🆕</span> New Uploads
            </h2>
            <Link to="/search?sort=new" className="text-brand-600 text-sm font-medium hover:underline">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {newUploads.map(m => <MangaCard key={m.id} manga={m} onClick={(id) => navigate(`/manga/${id}`)} />)}
          </div>
        </section>
      </div>
    </div>
  );
};

// 4. Manga Detail Page
const MangaDetail = () => {
  const { id } = useParams();
  const { allManga } = useAppContext();
  const navigate = useNavigate();
  const manga = allManga.find(m => m.id === id);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    if (id) {
        setChapters(getMockChapters(id));
    }
  }, [id]);

  if (!manga) return <div className="p-20 text-center">Manga not found</div>;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 pb-20">
      <div className="h-64 bg-slate-900 overflow-hidden relative">
        <img src={manga.coverUrl} className="w-full h-full object-cover opacity-30 blur-md" alt="banner"/>
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-slate-950 to-transparent" />
      </div>
      
      <div className="max-w-5xl mx-auto px-4 -mt-32 relative">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <img src={manga.coverUrl} alt={manga.title} className="w-64 rounded-lg shadow-xl border-4 border-white dark:border-slate-800" />
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                    <div className="text-xs text-slate-500">Rating</div>
                    <div className="font-bold text-yellow-500">★ {manga.rating}</div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800 p-2 rounded">
                    <div className="text-xs text-slate-500">Views</div>
                    <div className="font-bold">{manga.views.toLocaleString()}</div>
                </div>
            </div>
          </div>
          
          <div className="flex-grow pt-4 md:pt-32">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{manga.title}</h1>
            <p className="text-brand-600 dark:text-brand-400 font-medium mb-4">{manga.author}</p>
            <div className="flex flex-wrap gap-2 mb-6">
                {manga.genres.map(g => (
                    <span key={g} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-xs font-medium">{g}</span>
                ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-8">{manga.description}</p>
            
            <div className="flex gap-4 mb-8">
                <Button size="lg" onClick={() => {
                   if(chapters.length > 0) navigate(`/read/${manga.id}/${chapters[chapters.length-1].id}`);
                }}>Read First Chapter</Button>
                <Button variant="outline" size="lg">Bookmark</Button>
            </div>
          </div>
        </div>

        <div className="mt-12">
            <h3 className="text-xl font-bold mb-6 border-b border-slate-200 dark:border-slate-800 pb-2">Chapters ({chapters.length})</h3>
            <div className="space-y-2">
                {chapters.map(chapter => (
                    <div 
                        key={chapter.id}
                        onClick={() => navigate(`/read/${manga.id}/${chapter.id}`)}
                        className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <span className="text-slate-400 font-mono w-8">#{chapter.number}</span>
                            <span className="font-medium group-hover:text-brand-600 dark:group-hover:text-brand-400">{chapter.title}</span>
                        </div>
                        <span className="text-xs text-slate-400">{new Date(chapter.createdAt).toLocaleDateString()}</span>
                    </div>
                ))}
            </div>
        </div>

        <div className="mt-12 p-6 bg-slate-50 dark:bg-slate-900 rounded-xl">
           <h3 className="text-lg font-bold mb-4">Comments</h3>
           <textarea placeholder="Leave a comment..." className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 focus:ring-2 focus:ring-brand-500 outline-none mb-3" rows={3}></textarea>
           <div className="flex justify-end">
               <Button size="sm">Post Comment</Button>
           </div>
        </div>
      </div>
    </div>
  );
};

// 5. Reader Page
const Reader = () => {
    const { mangaId, chapterId } = useParams();
    const { allManga } = useAppContext();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
    const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal'>('vertical');
    const [showHeader, setShowHeader] = useState(true);

    useEffect(() => {
        if(mangaId) {
            const list = getMockChapters(mangaId);
            setChapters(list);
            const found = list.find(c => c.id === chapterId);
            setCurrentChapter(found || null);
        }
    }, [mangaId, chapterId]);

    if (!currentChapter) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    const nextChapter = chapters.find(c => c.number === currentChapter.number + 1);
    const prevChapter = chapters.find(c => c.number === currentChapter.number - 1);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col">
            {/* Sticky Reader Header */}
            <div className={`fixed top-0 inset-x-0 z-50 bg-gray-900/90 backdrop-blur border-b border-gray-800 transition-transform duration-300 ${showHeader ? 'translate-y-0' : '-translate-y-full'}`}>
                <div className="flex items-center justify-between p-4 max-w-7xl mx-auto w-full">
                    <button onClick={() => navigate(`/manga/${mangaId}`)} className="text-gray-400 hover:text-white flex items-center gap-2">
                        ← <span className="hidden sm:inline">Back to Manga</span>
                    </button>
                    <div className="text-center">
                        <h2 className="text-sm font-medium text-gray-400">{currentChapter.title}</h2>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setReadingMode('vertical')} className={`p-2 rounded ${readingMode === 'vertical' ? 'bg-brand-600' : 'bg-gray-800'}`}>
                            📜
                        </button>
                         <button onClick={() => setReadingMode('horizontal')} className={`p-2 rounded ${readingMode === 'horizontal' ? 'bg-brand-600' : 'bg-gray-800'}`}>
                            📖
                        </button>
                    </div>
                </div>
            </div>

            {/* Reading Content */}
            <div 
                className={`flex-grow ${readingMode === 'vertical' ? 'flex flex-col items-center pt-16' : 'flex items-center justify-center h-screen pt-16'}`}
                onClick={() => setShowHeader(!showHeader)}
            >
                {readingMode === 'vertical' ? (
                    <div className="w-full max-w-3xl bg-black shadow-2xl">
                        {currentChapter.pages.map((page, idx) => (
                            <img key={idx} src={page} alt={`Page ${idx}`} className="w-full h-auto block" loading="lazy" />
                        ))}
                    </div>
                ) : (
                    <div className="flex overflow-x-auto snap-x snap-mandatory h-full w-full">
                        {currentChapter.pages.map((page, idx) => (
                            <div key={idx} className="flex-shrink-0 w-full h-full flex items-center justify-center snap-center bg-black">
                                <img src={page} alt={`Page ${idx}`} className="max-h-full max-w-full object-contain" />
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Reader Footer Controls */}
            {readingMode === 'vertical' && (
                <div className="max-w-3xl mx-auto w-full p-8 flex justify-between items-center bg-gray-900">
                    <Button 
                        disabled={!prevChapter} 
                        onClick={(e) => { e.stopPropagation(); if(prevChapter) navigate(`/read/${mangaId}/${prevChapter.id}`); }}
                        variant="secondary"
                    >
                        Previous
                    </Button>
                    <Button 
                        disabled={!nextChapter} 
                        onClick={(e) => { e.stopPropagation(); if(nextChapter) navigate(`/read/${mangaId}/${nextChapter.id}`); }}
                    >
                        Next Chapter
                    </Button>
                </div>
            )}
             <div className="w-full max-w-3xl mx-auto">
                 <div className="h-32 bg-gray-800 flex items-center justify-center text-gray-500 mb-8 rounded">
                    AD SPACE
                 </div>
             </div>
        </div>
    );
};

// 6. Search Page with Gemini
const Search = () => {
    const { allManga } = useAppContext();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialQuery = queryParams.get('q') || '';
    
    const [query, setQuery] = useState(initialQuery);
    const [results, setResults] = useState(allManga);
    const [aiRecommendation, setAiRecommendation] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);

    // New State for Filters
    const [selectedStatus, setSelectedStatus] = useState<string>('All');
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

    const STATUS_OPTIONS = ['All', 'Ongoing', 'Completed', 'Hiatus'];

    useEffect(() => {
        let filtered = allManga;

        // 1. Text Search
        if (query) {
            const lower = query.toLowerCase();
            filtered = filtered.filter(m => 
                m.title.toLowerCase().includes(lower) || 
                m.author.toLowerCase().includes(lower)
            );
        }

        // 2. Status Filter
        if (selectedStatus !== 'All') {
            filtered = filtered.filter(m => m.status === selectedStatus);
        }

        // 3. Genre Filter (Must include ALL selected genres)
        if (selectedGenres.length > 0) {
            filtered = filtered.filter(m => 
                selectedGenres.every(g => m.genres.includes(g))
            );
        }

        setResults(filtered);
    }, [query, selectedStatus, selectedGenres, allManga]);

    const handleAiAsk = async () => {
        setIsAiLoading(true);
        const rec = await getMangaRecommendations(query, allManga);
        setAiRecommendation(rec);
        setIsAiLoading(false);
    }

    const toggleGenre = (genre: string) => {
        setSelectedGenres(prev => 
            prev.includes(genre) 
                ? prev.filter(g => g !== genre) 
                : [...prev, genre]
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex flex-col gap-4 mb-8">
                {/* Search Header Row */}
                <div className="flex gap-4">
                    <input 
                        type="text" 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search titles, authors..."
                        className="flex-grow p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-500 outline-none"
                    />
                    <Button variant="secondary" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
                        Filters
                    </Button>
                    <Button onClick={handleAiAsk} isLoading={isAiLoading} className="whitespace-nowrap flex items-center gap-2 bg-purple-600 hover:bg-purple-700">
                       <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 8v4"/><path d="M12 16h.01"/></svg>
                       <span className="hidden sm:inline">Ask AI Librarian</span>
                       <span className="sm:hidden">AI</span>
                    </Button>
                </div>

                {/* Filters Section */}
                <div className={`bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm ${showFilters ? 'block' : 'hidden md:block'}`}>
                    <div className="flex flex-col gap-6">
                        {/* Status Row */}
                        <div>
                            <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">Status</label>
                            <div className="flex flex-wrap gap-2">
                                {STATUS_OPTIONS.map(status => (
                                    <button
                                        key={status}
                                        onClick={() => setSelectedStatus(status)}
                                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                                            selectedStatus === status 
                                            ? 'bg-brand-600 text-white border-brand-600' 
                                            : 'bg-transparent text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700 hover:border-brand-500 dark:hover:border-slate-500'
                                        }`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Genres Cloud */}
                        <div>
                            <label className="block text-sm font-bold mb-3 text-slate-700 dark:text-slate-300">Genres (Select multiple)</label>
                            <div className="flex flex-wrap gap-2">
                                {GENRES.map(genre => {
                                    const isSelected = selectedGenres.includes(genre);
                                    return (
                                        <button 
                                            key={genre}
                                            onClick={() => toggleGenre(genre)}
                                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors border ${
                                                isSelected 
                                                ? 'bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-900/30 dark:text-brand-300 dark:border-brand-800' 
                                                : 'bg-slate-50 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-750'
                                            }`}
                                        >
                                            {genre} {isSelected && '✓'}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {aiRecommendation && (
                <div className="mb-8 p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg animate-fade-in">
                    <h4 className="font-bold text-purple-700 dark:text-purple-300 mb-2 flex items-center gap-2">
                        ✨ AI Recommendation
                    </h4>
                    <p className="text-slate-700 dark:text-slate-300 italic">"{aiRecommendation}"</p>
                </div>
            )}

            <div className="mb-4 text-sm text-slate-500 dark:text-slate-400 font-medium">
                Found {results.length} results
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {results.map(m => (
                    <MangaCard key={m.id} manga={m} onClick={(id) => navigate(`/manga/${id}`)} />
                ))}
            </div>
            
            {results.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
                    <svg className="w-16 h-16 mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p className="text-lg">No manga found matching your filters.</p>
                    <Button 
                        variant="ghost" 
                        className="mt-4"
                        onClick={() => { setQuery(''); setSelectedStatus('All'); setSelectedGenres([]); }}
                    >
                        Clear all filters
                    </Button>
                </div>
            )}
        </div>
    );
};

// 7. Upload Page
const UploadPage = () => {
    const { addManga, user } = useAppContext();
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [genre, setGenre] = useState(GENRES[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newManga: Manga = {
            id: `m${Date.now()}`,
            title,
            description: desc,
            author: user?.username || 'Unknown',
            coverUrl: `https://picsum.photos/seed/${Date.now()}/400/600`, // Mock upload
            genres: [genre],
            status: 'Ongoing',
            rating: 0,
            views: 0,
            likes: 0,
            updatedAt: new Date().toISOString(),
            uploaderId: user?.id || 'guest'
        };
        addManga(newManga);
        navigate(`/manga/${newManga.id}`);
    };

    if (!user) return <div className="p-20 text-center">Please login to upload.</div>;

    return (
        <div className="max-w-2xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Upload New Manga</h1>
            <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-slate-900 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                <div>
                    <label className="block text-sm font-medium mb-1">Series Title</label>
                    <input required value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 rounded border bg-transparent dark:border-slate-700" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea required value={desc} onChange={e => setDesc(e.target.value)} className="w-full p-2 rounded border bg-transparent dark:border-slate-700 h-32" />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Primary Genre</label>
                    <select value={genre} onChange={e => setGenre(e.target.value)} className="w-full p-2 rounded border bg-transparent dark:border-slate-700">
                        {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center text-slate-500">
                    <p>Drag and drop cover image here</p>
                    <p className="text-xs mt-2">(Simulated for demo)</p>
                </div>
                <Button type="submit" className="w-full">Create Series</Button>
            </form>
        </div>
    );
};

// --- APP COMPONENT ---

const AppContent = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Routes>
                <Route path="/read/:mangaId/:chapterId" element={<Reader />} />
                <Route path="*" element={
                    <>
                        <Navbar />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/manga/:id" element={<MangaDetail />} />
                                <Route path="/search" element={<Search />} />
                                <Route path="/upload" element={<UploadPage />} />
                            </Routes>
                        </main>
                        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 text-center text-slate-500 text-sm">
                            <p>© 2024 OneStop Manga Reader. All rights reserved.</p>
                            <div className="flex justify-center gap-4 mt-4">
                                <span>Privacy Policy</span>
                                <span>Terms of Service</span>
                                <span>DMCA</span>
                            </div>
                        </footer>
                    </>
                } />
            </Routes>
        </div>
    );
};

export default function App() {
  const [theme, setTheme] = useState<Theme>('light');
  const [user, setUser] = useState<User | null>(null);
  const [allManga, setAllManga] = useState<Manga[]>(MOCK_MANGA);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // PWA Install Prompt Capture
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const installApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  // Auto-login as the requested admin
  const login = () => setUser(MOCK_ADMIN);
  const logout = () => setUser(null);
  const addManga = (manga: Manga) => setAllManga(prev => [manga, ...prev]);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, login, logout, allManga, addManga, deferredPrompt, installApp }}>
        <Router>
            <AppContent />
        </Router>
    </AppContext.Provider>
  );
}