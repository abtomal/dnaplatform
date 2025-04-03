var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import './Navbar.css';
var Navbar = function () {
    return (_jsx("nav", { className: "navbar", children: _jsxs("div", { className: "navbar-container", children: [_jsx("div", { className: "navbar-logo", children: _jsxs(Link, { to: "/", children: [_jsx("span", { className: "logo-text", children: "DnA" }), _jsx("span", { className: "logo-subtitle", children: "NFT Platform" })] }) }), _jsxs("div", { className: "navbar-links", children: [_jsx(Link, { to: "/", className: "navbar-link", children: "Home" }), _jsx(Link, { to: "/collection", className: "navbar-link", children: "Collection" })] }), _jsx("div", { className: "navbar-wallet", children: _jsx(ConnectButton.Custom, { children: function (_a) {
                            var account = _a.account, chain = _a.chain, openAccountModal = _a.openAccountModal, openConnectModal = _a.openConnectModal, mounted = _a.mounted;
                            var ready = mounted;
                            var connected = ready && account && chain;
                            return (_jsx("div", __assign({}, (!ready && {
                                'aria-hidden': true,
                                style: {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            }), { children: (function () {
                                    if (!connected) {
                                        return (_jsx("button", { onClick: openConnectModal, className: "connect-button", type: "button", children: "Connect Wallet" }));
                                    }
                                    return (_jsxs("div", { className: "dropdown", children: [_jsxs("div", { className: "dropdown-toggle", children: [account.displayName, " \u25BC"] }), _jsx("div", { className: "dropdown-menu", children: _jsx(Link, { to: "/my-collection", className: "dropdown-item", children: "My Collection" }) })] }));
                                })() })));
                        } }) })] }) }));
};
export default Navbar;
