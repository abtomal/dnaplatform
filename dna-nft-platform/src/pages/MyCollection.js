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
// src/pages/MyCollection.tsx
import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { formatEther } from 'viem';
import { Link } from 'react-router-dom';
import { useNFTContract } from '../hooks/useNFTContract';
import './MyCollection.css';
var MyCollection = function () {
    var _a = useState([]), myNfts = _a[0], setMyNfts = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useAccount(), address = _c.address, isConnected = _c.isConnected;
    var _d = useNFTContract(), totalNFTs = _d.totalNFTs, fetchOwner = _d.fetchOwner, fetchPrice = _d.fetchPrice, fetchTokenURI = _d.fetchTokenURI;
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
    // Carica gli NFT posseduti dall'utente
    useEffect(function () {
        var fetchMyNFTs = function () { return __awaiter(void 0, void 0, void 0, function () {
            var fetchedNFTs, i, tokenId, owner, price, tokenURI, metadata, err_2, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!isConnected || !address || totalNFTs === 0) {
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
                        // Includi solo gli NFT posseduti dall'utente corrente
                        if (owner.toLowerCase() !== address.toLowerCase()) {
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
                        setMyNfts(fetchedNFTs);
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
        fetchMyNFTs();
    }, [isConnected, address, totalNFTs]);
    if (!isConnected) {
        return (_jsxs("div", { className: "connect-prompt", children: [_jsx("h2", { children: "Connetti il tuo wallet" }), _jsx("p", { children: "Per visualizzare la tua collezione, connetti il tuo wallet Ethereum." })] }));
    }
    return (_jsxs("div", { className: "my-collection", children: [_jsxs("div", { className: "collection-header", children: [_jsx("h1", { children: "La mia collezione NFT" }), _jsxs("p", { className: "wallet-address", children: ["Wallet: ", address] })] }), loading ? (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: "Caricamento della collezione..." })] })) : myNfts.length === 0 ? (_jsxs("div", { className: "empty-collection", children: [_jsx("h2", { children: "Collezione vuota" }), _jsx("p", { children: "Non possiedi ancora nessun NFT. Acquistane uno dalla home page!" }), _jsx(Link, { to: "/", className: "browse-button", children: "Sfoglia gli NFT disponibili" })] })) : (_jsxs("div", { className: "nft-grid", children: [_jsx("h2", { children: "I tuoi NFT scientifici" }), _jsx("div", { className: "grid", children: myNfts.map(function (nft) { return (_jsxs("div", { className: "nft-card", children: [_jsx("div", { className: "nft-image-container", children: nft.image ? (_jsx("img", { src: nft.image.startsWith('ipfs://')
                                            ? nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                            : nft.image, alt: nft.name, className: "nft-image" })) : (_jsx("div", { className: "nft-image-placeholder", children: "No Image" })) }), _jsxs("div", { className: "nft-content", children: [_jsx("h3", { children: nft.name }), _jsx("p", { className: "nft-description", children: nft.description.length > 100
                                                ? "".concat(nft.description.substring(0, 100), "...")
                                                : nft.description }), _jsxs("div", { className: "nft-price", children: ["Valore: ", formatEther(nft.price), " ETH"] }), _jsx("div", { className: "nft-actions", children: _jsx(Link, { to: "/nft/".concat(nft.id), className: "details-button", children: "Visualizza contenuto" }) })] })] }, nft.id)); }) })] }))] }));
};
export default MyCollection;
