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
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
// src/pages/Home.tsx
import { useState, useEffect } from 'react';
import { useAccount, useWriteContract, useTransaction } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { formatEther } from 'viem';
import { Link } from 'react-router-dom';
import { useNFTContract } from '../hooks/useNFTContract';
import FeaturedContent from '../components/FeaturedContent/FeaturedContent';
import './Home.css';
var Home = function () {
    var _a = useState([]), nfts = _a[0], setNfts = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), purchasingId = _c[0], setPurchasingId = _c[1];
    var _d = useAccount(), address = _d.address, isConnected = _d.isConnected;
    var openConnectModal = useConnectModal().openConnectModal;
    var _e = useNFTContract(), totalNFTs = _e.totalNFTs, contractAddress = _e.contractAddress, abi = _e.abi, fetchOwner = _e.fetchOwner, fetchPrice = _e.fetchPrice, fetchTokenURI = _e.fetchTokenURI;
    // Hook per scrivere sul contratto (acquisto NFT)
    var _f = useWriteContract(), writeContract = _f.writeContract, txHash = _f.data, writeStatus = _f.status, writeError = _f.error;
    // Monitoraggio della transazione
    var txStatus = useTransaction({
        hash: txHash
    }).status;
    // Funzione per recuperare i metadati dall'URI
    var fetchMetadata = function (tokenURI) { return __awaiter(void 0, void 0, void 0, function () {
        var uri, response, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!tokenURI)
                        return [2 /*return*/, null];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    uri = tokenURI.startsWith('ipfs://')
                        ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/')
                        : tokenURI;
                    return [4 /*yield*/, fetch(uri)];
                case 2:
                    response = _a.sent();
                    if (!response.ok) {
                        throw new Error("HTTP error! status: ".concat(response.status));
                    }
                    return [4 /*yield*/, response.json()];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    err_1 = _a.sent();
                    console.error('Errore nel recupero dei metadati:', err_1);
                    return [2 /*return*/, null];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Gestione dell'acquisto
    var handlePurchase = function (tokenId, price) {
        if (!isConnected || !address) {
            alert("Connetti il tuo wallet per acquistare questo NFT");
            return;
        }
        setPurchasingId(tokenId);
        try {
            writeContract({
                address: contractAddress,
                abi: abi,
                functionName: 'purchaseNFT',
                args: [tokenId],
                value: price,
                chain: undefined,
                account: address
            });
        }
        catch (error) {
            console.error("Errore durante l'acquisto dell'NFT:", error);
            setPurchasingId(null);
        }
    };
    // Gestione degli errori di scrittura
    useEffect(function () {
        if (writeError) {
            alert("Errore durante l'acquisto: ".concat(writeError.message));
            setPurchasingId(null);
        }
        if (txStatus === 'success') {
            alert("Acquisto completato con successo!");
            setPurchasingId(null);
            fetchNFTs(); // Aggiorna la lista dopo l'acquisto
        }
    }, [writeError, txStatus]);
    // Funzione principale per recuperare tutti gli NFT
    var fetchNFTs = function () { return __awaiter(void 0, void 0, void 0, function () {
        var fetchedNFTs, i, tokenId, owner, price, tokenURI, metadata, err_2, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!isConnected || !totalNFTs || totalNFTs === 0) {
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 11, 12, 13]);
                    setLoading(true);
                    fetchedNFTs = [];
                    i = 0;
                    _a.label = 2;
                case 2:
                    if (!(i < totalNFTs)) return [3 /*break*/, 10];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 8, , 9]);
                    tokenId = i;
                    return [4 /*yield*/, fetchOwner(tokenId)];
                case 4:
                    owner = _a.sent();
                    // Salta gli NFT posseduti dall'utente connesso
                    if (address && owner.toLowerCase() === address.toLowerCase()) {
                        return [3 /*break*/, 9];
                    }
                    return [4 /*yield*/, fetchPrice(tokenId)];
                case 5:
                    price = _a.sent();
                    return [4 /*yield*/, fetchTokenURI(tokenId)];
                case 6:
                    tokenURI = _a.sent();
                    return [4 /*yield*/, fetchMetadata(tokenURI)];
                case 7:
                    metadata = _a.sent();
                    fetchedNFTs.push({
                        id: tokenId,
                        name: (metadata === null || metadata === void 0 ? void 0 : metadata.name) || "NFT #".concat(tokenId),
                        description: (metadata === null || metadata === void 0 ? void 0 : metadata.description) || '',
                        image: (metadata === null || metadata === void 0 ? void 0 : metadata.image) || '',
                        price: price,
                        owner: owner,
                        attributes: metadata === null || metadata === void 0 ? void 0 : metadata.attributes
                    });
                    return [3 /*break*/, 9];
                case 8:
                    err_2 = _a.sent();
                    console.error("Errore nel recupero dell'NFT ".concat(i, ":"), err_2);
                    return [3 /*break*/, 9];
                case 9:
                    i++;
                    return [3 /*break*/, 2];
                case 10:
                    setNfts(fetchedNFTs);
                    return [3 /*break*/, 13];
                case 11:
                    err_3 = _a.sent();
                    console.error('Errore nel caricamento degli NFT:', err_3);
                    return [3 /*break*/, 13];
                case 12:
                    setLoading(false);
                    return [7 /*endfinally*/];
                case 13: return [2 /*return*/];
            }
        });
    }); };
    // Carica gli NFT all'avvio
    useEffect(function () {
        if (isConnected) {
            fetchNFTs();
        }
    }, [isConnected, totalNFTs, address]);
    return (_jsxs("div", { className: "home", children: [_jsxs("div", { className: "home-header", children: [_jsx("h1", { children: "DnA - Discovering new Answers" }), _jsxs("h2", { children: [_jsx("p", { children: "Unlock and own exclusive scientific content as NFTs!" }), _jsx("p", { children: "This is your gateway to groundbreaking knowledge." })] })] }), !isConnected && (_jsx("div", { className: "connect-prompt", children: _jsxs("h2", { children: [_jsx("span", { className: "connect-text-button", onClick: openConnectModal, children: "Connect" }), " your wallet to discover, buy and unlock our NFTs"] }) })), _jsx(FeaturedContent, {}), isConnected && (_jsx(_Fragment, { children: loading ? (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: "Loading NFTs..." })] })) : nfts.length === 0 ? (_jsxs("div", { className: "no-nfts", children: [_jsx("h2", { children: "No NFTs available" }), _jsx("p", { children: "There are no NFTs currently for sale." })] })) : (_jsxs("div", { className: "nft-grid", children: [_jsx("h2", { children: "Available Scientific NFTs" }), _jsx("div", { className: "grid", children: nfts.map(function (nft) { return (_jsxs("div", { className: "nft-card", children: [_jsx("div", { className: "nft-image-container", children: nft.image ? (_jsx("img", { src: nft.image.startsWith('ipfs://')
                                                ? nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                                : nft.image, alt: nft.name, className: "nft-image", onError: function (e) {
                                                // Immagine di fallback se l'URL non è valido
                                                e.target.src = '/images/placeholder-nft.jpg';
                                            } })) : (_jsx("div", { className: "nft-image-placeholder", children: "No Image" })) }), _jsxs("div", { className: "nft-content", children: [_jsx("h3", { children: nft.name }), _jsx("p", { className: "nft-description", children: nft.description.length > 100
                                                    ? "".concat(nft.description.substring(0, 100), "...")
                                                    : nft.description }), _jsxs("div", { className: "nft-price", children: [formatEther(nft.price), " ETH"] }), _jsxs("div", { className: "nft-actions", children: [_jsx(Link, { to: "/nft/".concat(nft.id), className: "details-button", children: "Dettagli" }), _jsx("button", { className: "buy-button", onClick: function () { return handlePurchase(nft.id, nft.price); }, disabled: purchasingId === nft.id || writeStatus === 'pending' || txStatus === 'pending', children: purchasingId === nft.id && (writeStatus === 'pending' || txStatus === 'pending')
                                                            ? "In elaborazione..."
                                                            : "Acquista" })] })] })] }, nft.id)); }) })] })) }))] }));
};
export default Home;
