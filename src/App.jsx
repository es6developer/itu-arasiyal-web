import { useState, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import Footer from './components/Footer';
import ArticlePage from './components/ArticlePage';
import HomePage from './pages/HomePage';
import BookmarksPage from './pages/BookmarksPage';
import SearchPage from './pages/SearchPage';

export default function App() {
  const [activeView, setActiveView] = useState('home');
  const [darkMode, setDarkMode] = useLocalStorage('ithu_theme', false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [allArticles, setAllArticles] = useState([]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [selectedArticle]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const getCategory = (view) => {
    switch (view) {
      case 'tamil_nadu': return 'tamil_nadu';
      case 'india': return 'india';
      case 'cinema': return 'cinema';
      case 'sports': return 'sports';
      case 'business': return 'business';
      case 'technology': return 'technology';
      case 'lifestyle': return 'lifestyle';
      case 'spiritual': return 'spiritual';
      case 'health': return 'health';
      case 'education': return 'education';
      case 'politics': return 'politics';
      default: return 'all';
    }
  };

  const handleTabChange = (tab) => {
    setActiveView(tab);
    setSelectedArticle(null);
  };

  const handleOpenArticle = (article, articles) => {
    setSelectedArticle(article);
    if (articles) setAllArticles(articles);
  };

  const handleBack = () => {
    setSelectedArticle(null);
  };

  const renderPage = () => {
    switch (activeView) {
      case 'bookmarks':
        return <BookmarksPage onOpenArticle={handleOpenArticle} />;
      case 'search':
        return <SearchPage onOpenArticle={handleOpenArticle} />;
      default:
        return <HomePage category={getCategory(activeView)} onOpenArticle={handleOpenArticle} />;
    }
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-white dark:bg-surface-900">
        <ArticlePage
          article={selectedArticle}
          allArticles={allArticles}
          onBack={handleBack}
          onOpenArticle={(a) => handleOpenArticle(a, allArticles)}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface-50 dark:bg-surface-900">
      <Header
        activeTab={activeView}
        onTabChange={handleTabChange}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onSearchToggle={() => setActiveView(activeView === 'search' ? 'home' : 'search')}
        onBookmarks={() => setActiveView(activeView === 'bookmarks' ? 'home' : 'bookmarks')}
      />
      <main className="flex-1">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
}
