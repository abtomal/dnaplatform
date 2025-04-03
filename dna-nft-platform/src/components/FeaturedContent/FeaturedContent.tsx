// src/components/FeaturedContent/FeaturedContent.tsx
import React, { useState, useEffect } from 'react';
import ArticleCarousel from './ArticleCarousel';
import './FeaturedContent.css';

// Interfaces for data
interface Article {
  id: number;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  url?: string;
}

// Fallback data in case of API failure
const fallbackArticles: Article[] = [
  {
    id: 1,
    title: "The Discovery of the Higgs Boson: Implications and Future",
    excerpt: "An in-depth look at the consequences of the Higgs boson discovery and the future directions of particle physics.",
    image: "/images/articles/higgs-boson.jpg",
    date: "2023-12-15",
    author: "Dr. Maria Rossi"
  },
  {
    id: 2,
    title: "CRISPR and the Future of Genetic Engineering",
    excerpt: "How CRISPR technology is revolutionizing medicine and the ethical challenges it presents.",
    image: "/images/articles/crispr.jpg",
    date: "2024-01-20",
    author: "Prof. Luca Bianchi"
  },
  {
    id: 3,
    title: "Artificial Intelligence: Myths and Reality",
    excerpt: "An objective analysis of AI's real capabilities today and future prospects beyond media hype.",
    image: "/images/articles/ai-reality.jpg",
    date: "2024-02-10",
    author: "Dr. Elena Verdi"
  },
  {
    id: 4,
    title: "Quantum Mechanics Explained Simply",
    excerpt: "The fundamental concepts of quantum physics presented in an accessible way for everyone.",
    image: "/images/articles/quantum.jpg",
    date: "2024-03-05",
    author: "Prof. Marco Neri"
  }
];

const FeaturedContent: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Your API key for The Guardian
  const apiKey = '61f9c26d-ad81-4ca9-b0d1-ecfbd7be0399';
  
  useEffect(() => {
    const fetchGuardianArticles = async () => {
      try {
        setIsLoading(true);
        
        // Fetch science articles
        const articlesResponse = await fetch(
          `https://content.guardianapis.com/search?section=science&show-fields=headline,trailText,thumbnail,byline&order-by=newest&page-size=8&api-key=${apiKey}`
        );
        
        const articlesData = await articlesResponse.json();
        
        if (articlesData.response?.results) {
          // Transform the article results into the correct format
          const transformedArticles = articlesData.response.results
            .slice(0, 4)
            .map((item: any, index: number) => ({
              id: index,
              title: item.fields.headline,
              excerpt: item.fields.trailText || item.webTitle,
              image: item.fields.thumbnail || '/images/placeholder-article.jpg',
              date: item.webPublicationDate,
              author: item.fields.byline || 'The Guardian',
              url: item.webUrl
            }));
          
          setArticles(transformedArticles);
          setError(null);
        } else {
          throw new Error('Invalid data from API response');
        }
      } catch (err) {
        console.error('Error fetching data from The Guardian:', err);
        setError('Unable to load real-time content. Displaying sample articles.');
        
        // Use fallback data
        setArticles(fallbackArticles);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchGuardianArticles();
    
    // Set an interval to update the data every hour
    const intervalId = setInterval(fetchGuardianArticles, 300000);
    
    return () => clearInterval(intervalId);
  }, [apiKey]);
  
  // Handle loading state
  if (isLoading) {
    return (
      <div className="featured-content">
        <div className="featured-loading">
          <div className="loading-spinner"></div>
          <p>Loading the latest science articles...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="featured-content">
      <div className="featured-header">
        <h2>What's happening around the Globe?</h2>
        <p className="featured-subtitle">Discover the latest articles and science updates</p>
        {error && <p className="featured-error">{error}</p>}
      </div>
      
      <div className="articles-only-container">
        <ArticleCarousel articles={articles} />
      </div>
      
      <div className="featured-footer">
        <p className="featured-attribution">
          Content provided by <a href="https://www.theguardian.com/science" target="_blank" rel="noopener noreferrer">The Guardian</a>
        </p>
      </div>
    </div>
  );
};

export default FeaturedContent;
