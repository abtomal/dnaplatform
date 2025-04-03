import React from 'react';
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
declare const ArticleCarousel: React.FC<ArticleCarouselProps>;
export default ArticleCarousel;
