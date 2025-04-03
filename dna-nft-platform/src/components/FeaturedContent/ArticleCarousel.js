import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/components/FeaturedContent/ArticleCarousel.tsx
import { useState, useEffect } from 'react';
import './ArticleCarousel.css';
var ArticleCarousel = function (_a) {
    var articles = _a.articles;
    var _b = useState(0), currentIndex = _b[0], setCurrentIndex = _b[1];
    var _c = useState(true), autoplayEnabled = _c[0], setAutoplayEnabled = _c[1];
    // Formatta la data dell'articolo
    var formatDate = function (dateStr) {
        try {
            var date = new Date(dateStr);
            return date.toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });
        }
        catch (e) {
            return dateStr;
        }
    };
    // Cambia slide
    var goToSlide = function (index) {
        setCurrentIndex(index);
    };
    var prevSlide = function () {
        setCurrentIndex(function (prev) {
            return prev === 0 ? articles.length - 1 : prev - 1;
        });
    };
    var nextSlide = function () {
        setCurrentIndex(function (prev) {
            return prev === articles.length - 1 ? 0 : prev + 1;
        });
    };
    // Gestione dell'autoplay
    useEffect(function () {
        if (!autoplayEnabled || articles.length <= 1)
            return;
        var interval = setInterval(function () {
            nextSlide();
        }, 7000);
        return function () { return clearInterval(interval); };
    }, [autoplayEnabled, articles.length]);
    // Se non ci sono articoli
    if (articles.length === 0) {
        return _jsx("div", { className: "carousel-empty", children: "No article available" });
    }
    // Pulsante per leggere l'articolo completo
    var handleReadArticle = function (url) {
        if (url) {
            window.open(url, '_blank', 'noopener,noreferrer');
        }
    };
    return (_jsxs("div", { className: "article-carousel", onMouseEnter: function () { return setAutoplayEnabled(false); }, onMouseLeave: function () { return setAutoplayEnabled(true); }, children: [_jsx("div", { className: "carousel-container", children: articles.map(function (article, index) { return (_jsx("div", { className: "carousel-item ".concat(index === currentIndex ? 'active' : ''), children: _jsxs("div", { className: "article-card", children: [_jsx("div", { className: "article-image-container", children: _jsx("img", { src: article.image, alt: article.title, className: "article-image", onError: function (e) {
                                        e.target.src = '/images/placeholder-article.jpg';
                                    } }) }), _jsxs("div", { className: "article-content", children: [_jsx("h4", { className: "article-title", children: article.title }), _jsx("p", { className: "article-excerpt", children: article.excerpt }), _jsxs("div", { className: "article-metadata", children: [_jsx("span", { className: "article-author", children: article.author }), _jsx("span", { className: "article-date", children: formatDate(article.date) })] }), _jsx("button", { className: "read-more-button", onClick: function () { return handleReadArticle(article.url); }, children: "Read Article" })] })] }) }, article.id)); }) }), articles.length > 1 && (_jsxs(_Fragment, { children: [_jsx("button", { className: "carousel-nav prev", onClick: function () {
                            prevSlide();
                            setAutoplayEnabled(false);
                            setTimeout(function () { return setAutoplayEnabled(true); }, 10000);
                        }, "aria-label": "Articolo precedente", children: "\u276E" }), _jsx("button", { className: "carousel-nav next", onClick: function () {
                            nextSlide();
                            setAutoplayEnabled(false);
                            setTimeout(function () { return setAutoplayEnabled(true); }, 10000);
                        }, "aria-label": "Articolo successivo", children: "\u276F" }), _jsx("div", { className: "carousel-dots", children: articles.map(function (_, index) { return (_jsx("button", { className: "carousel-dot ".concat(index === currentIndex ? 'active' : ''), onClick: function () {
                                goToSlide(index);
                                setAutoplayEnabled(false);
                                setTimeout(function () { return setAutoplayEnabled(true); }, 10000);
                            }, "aria-label": "Vai all'articolo ".concat(index + 1) }, index)); }) })] }))] }));
};
export default ArticleCarousel;
