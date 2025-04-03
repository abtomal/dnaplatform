var _a;
import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, getDefaultConfig, darkTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { sepolia, mainnet } from 'wagmi/chains';
import { http } from 'viem';
// Crea un client per React Query
var queryClient = new QueryClient();
// Configura un projectId per WalletConnect
var projectId = '00cdf751fb35365bd2e553912727c3c9'; // https://cloud.walletconnect.com
// Configura wagmi e RainbowKit insieme
var config = getDefaultConfig({
    appName: 'DnA NFT Platform',
    projectId: projectId,
    chains: [sepolia, mainnet],
    transports: (_a = {},
        _a[sepolia.id] = http(),
        _a[mainnet.id] = http(),
        _a),
});
// Rendering dell'applicazione
ReactDOM.createRoot(document.getElementById('root')).render(_jsx(React.StrictMode, { children: _jsx(WagmiProvider, { config: config, children: _jsx(QueryClientProvider, { client: queryClient, children: _jsx(RainbowKitProvider, { theme: darkTheme(), children: _jsx(BrowserRouter, { children: _jsx(App, {}) }) }) }) }) }));
