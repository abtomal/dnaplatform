var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/FeaturedContent/FeaturedContent.tsx
import { useState, useEffect } from 'react';
import ArticleCarousel from './ArticleCarousel';
import './FeaturedContent.css';
// Fallback data in case of API failure
var fallbackArticles = [
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
var FeaturedContent = function () {
    var _a = useState([]), articles = _a[0], setArticles = _a[1];
    var _b = useState(true), isLoading = _b[0], setIsLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    // Your API key for The Guardian
    var apiKey = '61f9c26d-ad81-4ca9-b0d1-ecfbd7be0399';
    useEffect(function () {
        var fetchGuardianArticles = function () { return __awaiter(void 0, void 0, void 0, function () {
            var articlesResponse, articlesData, transformedArticles, err_1;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _b.trys.push([0, 3, 4, 5]);
                        setIsLoading(true);
                        return [4 /*yield*/, fetch("https://content.guardianapis.com/search?section=science&show-fields=headline,trailText,thumbnail,byline&order-by=newest&page-size=8&api-key=".concat(apiKey))];
                    case 1:
                        articlesResponse = _b.sent();
                        return [4 /*yield*/, articlesResponse.json()];
                    case 2:
                        articlesData = _b.sent();
                        if ((_a = articlesData.response) === null || _a === void 0 ? void 0 : _a.results) {
                            transformedArticles = articlesData.response.results
                                .slice(0, 4)
                                .map(function (item, index) { return ({
                                id: index,
                                title: item.fields.headline,
                                excerpt: item.fields.trailText || item.webTitle,
                                image: item.fields.thumbnail || '/images/placeholder-article.jpg',
                                date: item.webPublicationDate,
                                author: item.fields.byline || 'The Guardian',
                                url: item.webUrl
                            }); });
                            setArticles(transformedArticles);
                            setError(null);
                        }
                        else {
                            throw new Error('Invalid data from API response');
                        }
                        return [3 /*break*/, 5];
                    case 3:
                        err_1 = _b.sent();
                        console.error('Error fetching data from The Guardian:', err_1);
                        setError('Unable to load real-time content. Displaying sample articles.');
                        // Use fallback data
                        setArticles(fallbackArticles);
                        return [3 /*break*/, 5];
                    case 4:
                        setIsLoading(false);
                        return [7 /*endfinally*/];
                    case 5: return [2 /*return*/];
                }
            });
        }); };
        fetchGuardianArticles();
        // Set an interval to update the data every hour
        var intervalId = setInterval(fetchGuardianArticles, 300000);
        return function () { return clearInterval(intervalId); };
    }, [apiKey]);
    // Handle loading state
    if (isLoading) {
        return (_jsx("div", { className: "featured-content", children: _jsxs("div", { className: "featured-loading", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: "Loading the latest science articles..." })] }) }));
    }
    return (_jsxs("div", { className: "featured-content", children: [_jsxs("div", { className: "featured-header", children: [_jsx("h2", { children: "What's happening around the Globe?" }), _jsx("p", { className: "featured-subtitle", children: "Discover the latest articles and science updates" }), error && _jsx("p", { className: "featured-error", children: error })] }), _jsx("div", { className: "articles-only-container", children: _jsx(ArticleCarousel, { articles: articles }) }), _jsx("div", { className: "featured-footer", children: _jsxs("p", { className: "featured-attribution", children: ["Content provided by ", _jsx("a", { href: "https://www.theguardian.com/science", target: "_blank", rel: "noopener noreferrer", children: "The Guardian" })] }) })] }));
};
export default FeaturedContent;
