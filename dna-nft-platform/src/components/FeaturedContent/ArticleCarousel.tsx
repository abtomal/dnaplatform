// src/components/FeaturedContent/ArticleCarousel.tsx
import React, { useState, useEffect } from 'react';
import './ArticleCarousel.css';

interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  url?: string;
}

interface ArticleCarouselProps {
  articles: Article[];
}

const ArticleCarousel: React.FC<ArticleCarouselProps> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  
  // Formatta la data dell'articolo
  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('it-IT', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Cambia slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => 
      prev === 0 ? articles.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex(prev => 
      prev === articles.length - 1 ? 0 : prev + 1
    );
  };

  // Gestione dell'autoplay
  useEffect(() => {
    if (!autoplayEnabled || articles.length <= 1) return;
    
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    
    return () => clearInterval(interval);
  }, [autoplayEnabled, articles.length]);

  // Se non ci sono articoli
  if (articles.length === 0) {
    return <div className="carousel-empty">No article available</div>;
  }

  // Pulsante per leggere l'articolo completo
  const handleReadArticle = (url?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div 
      className="article-carousel"
      onMouseEnter={() => setAutoplayEnabled(false)}
      onMouseLeave={() => setAutoplayEnabled(true)}
    >
      <div className="carousel-container">
        {articles.map((article, index) => (
          <div 
            key={article.id}
            className={`carousel-item ${index === currentIndex ? 'active' : ''}`}
          >
            <div className="article-card">
              <div className="article-image-container">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="article-image"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/images/placeholder-article.jpg';
                  }}
                />
              </div>
              <div className="article-content">
                <h4 className="article-title">{article.title}</h4>
                <p className="article-excerpt">{article.excerpt}</p>
                <div className="article-metadata">
                  <span className="article-author">{article.author}</span>
                  <span className="article-date">{formatDate(article.date)}</span>
                </div>
                <button 
                  className="read-more-button"
                  onClick={() => handleReadArticle(article.url)}
                >
                  Read Article
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {articles.length > 1 && (
        <>
          <button 
            className="carousel-nav prev"
            onClick={() => {
              prevSlide();
              setAutoplayEnabled(false);
              setTimeout(() => setAutoplayEnabled(true), 10000);
            }}
            aria-label="Articolo precedente"
          >
            &#10094;
          </button>
          
          <button 
            className="carousel-nav next"
            onClick={() => {
              nextSlide();
              setAutoplayEnabled(false);
              setTimeout(() => setAutoplayEnabled(true), 10000);
            }}
            aria-label="Articolo successivo"
          >
            &#10095;
          </button>
          
          <div className="carousel-dots">
            {articles.map((_, index) => (
              <button 
                key={index}
                className={`carousel-dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  goToSlide(index);
                  setAutoplayEnabled(false);
                  setTimeout(() => setAutoplayEnabled(true), 10000);
                }}
                aria-label={`Vai all'articolo ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ArticleCarousel;