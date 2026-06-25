import { useState, useMemo, useCallback, useEffect } from 'react';
import { Zap, TrendingUp, Clock, ChevronRight } from 'lucide-react';
import { useNews } from '../hooks/useNews';
import { useBookmarks } from '../hooks/useBookmarks';
import ArticleCard from '../components/ArticleCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorState from '../components/ErrorState';
import EmptyState from '../components/EmptyState';
import BreakingTicker from '../components/BreakingTicker';
import { fetchSectionArticles } from '../services/rssService';

export default function HomePage({ category = 'all', onOpenArticle }) {
  const { articles, isLoading, error, refresh } = useNews(category);
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [sectionData, setSectionData] = useState({});
  const [loadingSections, setLoadingSections] = useState({});

  const handleBookmark = useCallback((article) => {
    toggleBookmark(article);
  }, [toggleBookmark]);

  const openArticle = useCallback((article) => {
    onOpenArticle(article, articles);
  }, [onOpenArticle, articles]);

  const hero = useMemo(() => articles[0], [articles]);
  const sideList = useMemo(() => articles.slice(1, 5), [articles]);

  useEffect(() => {
    if (category !== 'all') return;

    const loadSections = async () => {
      const sections = [
        { key: 'politics', cat: 'politics' },
        { key: 'cinema', cat: 'cinema' },
        { key: 'technology', cat: 'technology' },
        { key: 'spiritual', cat: 'spiritual' },
        { key: 'health', cat: 'health' },
        { key: 'education', cat: 'education' },
      ];

      for (const s of sections) {
        setLoadingSections(prev => ({ ...prev, [s.key]: true }));
        try {
          const data = await fetchSectionArticles(s.cat);
          setSectionData(prev => ({ ...prev, [s.key]: data.slice(0, 6) }));
        } catch {
          setSectionData(prev => ({ ...prev, [s.key]: [] }));
        } finally {
          setLoadingSections(prev => ({ ...prev, [s.key]: false }));
        }
      }
    };

    loadSections();
  }, [category]);

  const renderSection = (key, title, titleEn, articlesData, showAd = false) => {
    if (loadingSections[key]) {
      return (
        <section key={key} className="mb-10">
          <SectionHeading title={title} titleEn={titleEn} />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-surface-800 rounded-xl overflow-hidden card-shadow animate-pulse">
                <div className="aspect-[16/10] bg-surface-200 dark:bg-surface-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-16" />
                  <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4" />
                  <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }

    if (!articlesData || articlesData.length === 0) return null;

    return (
      <section key={key} className="mb-10">
        <SectionHeading title={title} titleEn={titleEn} />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {articlesData.map((article, i) => (
            <div
              key={article.guid}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
            >
              <ArticleCard
                article={article}
                isBookmarked={isBookmarked(article.guid)}
                onBookmark={handleBookmark}
                onOpen={openArticle}
              />
            </div>
          ))}
        </div>
        {showAd && (
          <div className="mt-6 py-3 border-t border-surface-100 dark:border-surface-800">
            <div className="bg-surface-100 dark:bg-surface-800 rounded-xl h-16 flex items-center justify-center">
              <p className="text-xs text-surface-400">Advertisement</p>
            </div>
          </div>
        )}
      </section>
    );
  };

  if (category !== 'all') {
    if (isLoading) return <LoadingSpinner />;
    if (error) return <ErrorState message={error} onRetry={refresh} />;
    if (!articles.length) return <EmptyState title="செய்திகள் இல்லை" subtitle="வேறு வகையை தேர்வு செய்யவும்" />;

    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          {articles.map((article, i) => (
            <div
              key={article.guid}
              className="animate-fade-in"
              style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
            >
              <ArticleCard
                article={article}
                isBookmarked={isBookmarked(article.guid)}
                onBookmark={handleBookmark}
                onOpen={openArticle}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading && !articles.length) return <LoadingSpinner />;
  if (error && !articles.length) return <ErrorState message={error} onRetry={refresh} />;

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-6">
      {/* Breaking ticker */}
      <BreakingTicker articles={articles.slice(0, 5)} onSelect={openArticle} />

      {/* Hero + Sidebar */}
      {hero && (
        <div className="mb-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6">
            <div className="lg:col-span-2">
              <ArticleCard
                article={hero}
                isBookmarked={isBookmarked(hero.guid)}
                onBookmark={handleBookmark}
                onOpen={openArticle}
                size="hero"
              />
            </div>
            <div className="hidden lg:flex flex-col gap-0">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={14} className="text-surface-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-surface-500">சமீபத்தியவை</span>
              </div>
              {sideList.map((article) => (
                <div key={article.guid} className="flex items-start gap-3 pb-3.5 mb-3.5 border-b border-surface-100 dark:border-surface-800 last:border-0 last:pb-0 last:mb-0">
                  {article.imageUrl && (
                    <img
                      src={article.imageUrl}
                      alt=""
                      className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                      loading="lazy"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">
                      {article.source}
                    </span>
                    <button
                      onClick={() => openArticle(article)}
                      className="text-sm font-semibold text-surface-900 dark:text-surface-100 leading-tight mt-0.5 line-clamp-2 hover:text-brand-600 dark:hover:text-brand-400 transition-colors tamil text-left"
                    >
                      {article.title}
                    </button>
                    <p className="text-[11px] text-surface-400 mt-1">
                      {article.pubDate ? new Date(article.pubDate).toLocaleDateString('ta-IN', { day: 'numeric', month: 'short' }) : ''}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Trending row */}
      {articles.length > 5 && (
        <section className="mb-10">
          <SectionHeading title="ட்ரெண்டிங்" titleEn="Trending" />
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 lg:mx-0 lg:px-0">
            {articles.slice(5, 11).map((article, i) => (
              <div
                key={article.guid}
                className="flex-shrink-0 w-64 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
              >
                <ArticleCard
                  article={article}
                  isBookmarked={isBookmarked(article.guid)}
                  onBookmark={handleBookmark}
                  onOpen={openArticle}
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Ad placeholder */}
      <div className="mb-10 py-4 border-t border-surface-200 dark:border-surface-700">
        <div className="bg-surface-100 dark:bg-surface-800 rounded-xl h-16 flex items-center justify-center">
          <p className="text-xs text-surface-400">Advertisement</p>
        </div>
      </div>

      {/* Category sections */}
      {renderSection('politics', 'அரசியல்', 'Politics', sectionData.politics)}
      {renderSection('cinema', 'சினிமா', 'Cinema', sectionData.cinema, true)}
      {renderSection('technology', 'தொழில்நுட்பம்', 'Technology', sectionData.technology)}
      {renderSection('spiritual', 'ஆன்மிகம்', 'Spiritual', sectionData.spiritual, true)}
      {renderSection('health', 'உடல்நலம்', 'Health', sectionData.health)}
      {renderSection('education', 'கல்வி', 'Education', sectionData.education, true)}

      {/* More news */}
      {articles.length > 11 && (
        <section className="mb-10">
          <SectionHeading title="மேலும் செய்திகள்" titleEn="More News" />
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
            {articles.slice(11, 23).map((article, i) => (
              <div
                key={article.guid}
                className="animate-fade-in"
                style={{ animationDelay: `${i * 40}ms`, animationFillMode: 'backwards' }}
              >
                <ArticleCard
                  article={article}
                  isBookmarked={isBookmarked(article.guid)}
                  onBookmark={handleBookmark}
                  onOpen={openArticle}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function SectionHeading({ title, titleEn }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 tamil">{title}</h2>
      {titleEn && (
        <span className="text-xs text-surface-400 uppercase tracking-wider font-medium hidden sm:inline">{titleEn}</span>
      )}
      <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
      <ChevronRight size={16} className="text-surface-400" />
    </div>
  );
}
