import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import NFTDetails from './pages/NFTDetails';
import MyCollection from './pages/MyCollection';
import Collection from './pages/Collection';
import './App.css';
function App() {
    return (_jsxs("div", { className: "app", children: [_jsx(Navbar, {}), _jsx("main", { className: "main-content", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/nft/:id", element: _jsx(NFTDetails, {}) }), _jsx(Route, { path: "/collection", element: _jsx(Collection, {}) }), _jsx(Route, { path: "/my-collection", element: _jsx(MyCollection, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) }), _jsx(Footer, {})] }));
}
export default App;
