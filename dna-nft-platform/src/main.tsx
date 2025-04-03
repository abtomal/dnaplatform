import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { 
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme
} from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { sepolia, mainnet } from 'wagmi/chains'
import { http } from 'viem'

// Crea un client per React Query
const queryClient = new QueryClient()

// Configura un projectId per WalletConnect
const projectId = '00cdf751fb35365bd2e553912727c3c9' // https://cloud.walletconnect.com

// Configura wagmi e RainbowKit insieme
const config = getDefaultConfig({
  appName: 'DnA NFT Platform',
  projectId,
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(),
    [mainnet.id]: http()
  },
})

// Rendering dell'applicazione
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme()}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)