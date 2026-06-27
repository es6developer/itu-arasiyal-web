import { useState, useEffect, useMemo, useRef } from 'react';
import { ArrowLeft, Clock, Share2, Bookmark, BookmarkCheck, ExternalLink, Heart, ChevronRight, User, Tag, Volume2, VolumeX } from 'lucide-react';
import { formatDate } from '../utils/helpers';
import ArticleCard from './ArticleCard';
import Ad from './Ad';
import { useBookmarks } from '../hooks/useBookmarks';

export default function ArticlePage({ article, allArticles, onBack, onOpenArticle }) {
  const [liked, setLiked] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  useEffect(() => {
    window.scrollTo(0, 0);
    speechSynthesis.cancel();
    setSpeaking(false);
  }, [article.guid]);

  const handleTTS = () => {
    if (speaking) {
      speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const text = article.description
      ? `${article.title}. ${article.description}`
      : article.title;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ta-IN';
    utterance.rate = 0.9;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  const recommended = useMemo(() => {
    return allArticles
      .filter(a => a.guid !== article.guid)
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, [article.guid, allArticles]);

  const alsoRead = useMemo(() => {
    return allArticles
      .filter(a => a.guid !== article.guid && a.source === article.source)
      .slice(0, 3);
  }, [article.guid, article.source, allArticles]);

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text: article.title, url: article.link }); } catch {}
    } else {
      navigator.clipboard?.writeText(article.link);
    }
  };

  const readTime = Math.max(1, Math.ceil((article.description?.length || 200) / 400));

  return (
    <div className="min-h-screen bg-white dark:bg-surface-900">
      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 bg-white/95 dark:bg-surface-900/95 backdrop-blur-md border-b border-surface-100 dark:border-surface-800">
        <div className="max-w-3xl mx-auto px-4 lg:px-6 flex items-center justify-between h-12">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium tamil hidden sm:inline">பின்செல்</span>
          </button>
          <div className="flex items-center gap-0.5">
            <button
              onClick={handleTTS}
              className={`p-2 rounded-lg transition-colors ${
                speaking
                  ? 'text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-900/20'
                  : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
              title={speaking ? 'Stop reading' : 'Read aloud'}
            >
              {speaking ? <VolumeX size={17} /> : <Volume2 size={17} />}
            </button>
            <button
              onClick={() => setLiked(!liked)}
              className={`p-2 rounded-lg transition-colors ${
                liked ? 'text-red-500' : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              <Heart size={17} fill={liked ? 'currentColor' : 'none'} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 rounded-lg text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              <Share2 size={17} />
            </button>
            <button
              onClick={() => toggleBookmark(article)}
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked(article.guid)
                  ? 'text-brand-600 dark:text-brand-400'
                  : 'text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800'
              }`}
            >
              {isBookmarked(article.guid) ? <BookmarkCheck size={17} fill="currentColor" /> : <Bookmark size={17} />}
            </button>
          </div>
        </div>
      </div>

      {/* Article content */}
      <article className="max-w-3xl mx-auto px-4 lg:px-6 py-5 lg:py-8">
        {/* Category breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-surface-400 mb-3">
          <span className="font-medium text-brand-600 dark:text-brand-400 uppercase tracking-wider">{article.source}</span>
          <span>•</span>
          <span>{formatDate(article.pubDate)}</span>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-[2.1rem] font-bold text-surface-900 dark:text-surface-100 leading-[1.25] mb-4 tamil">
          {article.title}
        </h1>

        {/* Author + read time */}
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-surface-100 dark:border-surface-800">
          <div className="flex items-center gap-2 text-sm text-surface-500 dark:text-surface-400">
            <div className="w-7 h-7 rounded-full bg-surface-200 dark:bg-surface-700 flex items-center justify-center">
              <User size={14} className="text-surface-400" />
            </div>
            <span className="font-medium text-surface-700 dark:text-surface-300">{article.source}</span>
          </div>
          <span className="text-surface-300 dark:text-surface-600">|</span>
          <span className="text-sm text-surface-400 flex items-center gap-1">
            <Clock size={13} />
            {readTime} min read
          </span>
        </div>

        {/* Hero image */}
        {article.imageUrl && (
          <div className="relative w-full rounded-xl overflow-hidden mb-6" style={{ paddingTop: '52%' }}>
            {!imgLoaded && (
              <div className="absolute inset-0 bg-surface-100 dark:bg-surface-800 animate-pulse" />
            )}
            <img
              src={article.imageUrl}
              alt=""
              onLoad={() => setImgLoaded(true)}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          </div>
        )}

        {/* Description / body */}
        <div className="mb-8">
          {article.description ? (
            article.description.split('\n').filter(Boolean).map((para, i) => (
              <p key={i} className="text-surface-700 dark:text-surface-300 leading-[1.8] mb-4 text-[15px] lg:text-base tamil">
                {para}
              </p>
            ))
          ) : (
            <p className="text-surface-400 italic">முழுமையான செய்தியை படிக்க மூல இணைப்பை கிளிக் செய்யவும்.</p>
          )}
        </div>

        {/* Read full article CTA */}
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3.5 bg-brand-600 text-white rounded-xl hover:bg-brand-700 active:scale-[0.98] transition-all duration-200 font-medium tamil mb-6"
        >
          முழு செய்தியை படிக்க
          <ExternalLink size={16} />
        </a>

        {/* In-content ad */}
        <div className="mb-8 py-4 border-t border-surface-100 dark:border-surface-800">
          <Ad type="mediumRectangle" />
        </div>

        {/* Tags */}
        <div className="flex items-center gap-2 flex-wrap mb-8">
          <Tag size={14} className="text-surface-400" />
          {[article.source, 'Tamil News', 'அரசியல்'].map((tag, i) => (
            <span key={i} className="px-2.5 py-1 text-xs bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Also Read */}
        {alsoRead.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-base font-bold text-surface-900 dark:text-surface-100 tamil">Also Read</h2>
              <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
            </div>
            <div className="space-y-3">
              {alsoRead.map((item) => (
                <button
                  key={item.guid}
                  onClick={() => onOpenArticle(item)}
                  className="flex items-start gap-3 text-left group w-full"
                >
                  {item.imageUrl && (
                    <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" loading="lazy" />
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 line-clamp-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors tamil">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-surface-400 mt-0.5">{formatDate(item.pubDate)}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Bottom ad */}
        <div className="mb-8 py-4 border-t border-surface-200 dark:border-surface-700">
          <Ad type="banner" />
        </div>

        {/* Recommended */}
        {recommended.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <h2 className="text-lg font-bold text-surface-900 dark:text-surface-100 tamil">பரிந்துரை செய்யப்பட்டவை</h2>
              <div className="h-px flex-1 bg-surface-200 dark:bg-surface-700" />
              <ChevronRight size={16} className="text-surface-400" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommended.map((rec, i) => (
                <div
                  key={rec.guid}
                  className="animate-fade-in"
                  style={{ animationDelay: `${i * 60}ms`, animationFillMode: 'backwards' }}
                >
                  <ArticleCard
                    article={rec}
                    isBookmarked={isBookmarked(rec.guid)}
                    onBookmark={toggleBookmark}
                    onOpen={onOpenArticle}
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
