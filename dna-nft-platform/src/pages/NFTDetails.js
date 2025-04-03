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
// src/pages/NFTDetails.tsx
import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { useAccount, useWriteContract, useWatchContractEvent } from 'wagmi';
import { formatEther } from 'viem';
import { useNFTContract } from '../hooks/useNFTContract';
import './NFTDetails.css';
var NFTDetails = function () {
    var id = useParams().id;
    var _a = useState(null), nft = _a[0], setNft = _a[1];
    var _b = useState(true), loading = _b[0], setLoading = _b[1];
    var _c = useState(null), error = _c[0], setError = _c[1];
    var _d = useAccount(), address = _d.address, isConnected = _d.isConnected;
    var _e = useNFTContract(), contractAddress = _e.contractAddress, abi = _e.abi, tokenExists = _e.tokenExists, fetchOwner = _e.fetchOwner, fetchPrice = _e.fetchPrice, fetchTokenURI = _e.fetchTokenURI;
    // Ottieni l'ID del token
    var tokenId = id ? parseInt(id) : -1;
    // Hook per scrivere sul contratto (acquisto NFT)
    var _f = useWriteContract(), writeContract = _f.writeContract, txHash = _f.data, isPending = _f.isPending, isWriteError = _f.isError, writeError = _f.error;
    // Ascolta eventi di acquisto per aggiornare l'interfaccia
    useWatchContractEvent({
        address: contractAddress,
        abi: abi,
        eventName: 'NFTPurchased',
        onLogs: function () {
            // Ricarica i dettagli dell'NFT quando viene emesso un evento
            loadNFTDetails();
        },
    });
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
    // Funzione per caricare i dettagli dell'NFT
    var loadNFTDetails = function () { return __awaiter(void 0, void 0, void 0, function () {
        var exists, owner, price, tokenURI, metadata, nftData, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (tokenId < 0) {
                        setError("ID NFT non valido");
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 7, , 8]);
                    return [4 /*yield*/, tokenExists(tokenId)];
                case 2:
                    exists = _a.sent();
                    if (!exists) {
                        setError("NFT non trovato");
                        setLoading(false);
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, fetchOwner(tokenId)];
                case 3:
                    owner = _a.sent();
                    return [4 /*yield*/, fetchPrice(tokenId)];
                case 4:
                    price = _a.sent();
                    return [4 /*yield*/, fetchTokenURI(tokenId)];
                case 5:
                    tokenURI = _a.sent();
                    return [4 /*yield*/, fetchMetadata(tokenURI)];
                case 6:
                    metadata = _a.sent();
                    nftData = {
                        id: tokenId,
                        name: (metadata === null || metadata === void 0 ? void 0 : metadata.name) || "NFT #".concat(tokenId),
                        description: (metadata === null || metadata === void 0 ? void 0 : metadata.description) || '',
                        image: (metadata === null || metadata === void 0 ? void 0 : metadata.image) || '',
                        price: price,
                        owner: owner,
                        attributes: metadata === null || metadata === void 0 ? void 0 : metadata.attributes
                    };
                    setNft(nftData);
                    setError(null);
                    setLoading(false);
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error("Errore nel recupero dei dettagli dell'NFT:", error_1);
                    setError("Errore nel caricamento dei dettagli dell'NFT");
                    setLoading(false);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    }); };
    // Effetto per caricare i dettagli dell'NFT al caricamento o quando cambia l'ID
    useEffect(function () {
        loadNFTDetails();
    }, [tokenId]);
    // Gestione degli errori di scrittura
    useEffect(function () {
        if (isWriteError && writeError) {
            alert("Errore durante l'acquisto: ".concat(writeError.message));
        }
    }, [isWriteError, writeError]);
    // Gestione dell'acquisto
    var handlePurchase = function () {
        if (!isConnected || !address || !nft) {
            alert("Connetti il tuo wallet per acquistare questo NFT");
            return;
        }
        try {
            writeContract({
                address: contractAddress,
                abi: abi,
                functionName: 'purchaseNFT',
                args: [nft.id],
                value: nft.price,
                chain: undefined,
                account: address
            });
        }
        catch (error) {
            console.error("Errore durante l'acquisto dell'NFT:", error);
        }
    };
    // Verifica se l'utente è il proprietario dell'NFT
    var isOwner = isConnected && address && nft && nft.owner.toLowerCase() === address.toLowerCase();
    if (loading) {
        return (_jsxs("div", { className: "loading", children: [_jsx("div", { className: "loading-spinner" }), _jsx("p", { children: "Caricamento dettagli NFT..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "error-container", children: [_jsx("h2", { children: "Si \u00E8 verificato un errore" }), _jsx("p", { children: error }), _jsx(Link, { to: "/", className: "back-button", children: "Torna alla home" })] }));
    }
    if (!nft) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    return (_jsxs("div", { className: "nft-details", children: [_jsxs("div", { className: "details-header", children: [_jsx(Link, { to: "/", className: "back-link", children: "\u2190 Torna alla home" }), _jsx("h1", { children: nft.name })] }), _jsxs("div", { className: "details-content", children: [_jsx("div", { className: "nft-image-container", children: nft.image ? (_jsx("img", { src: nft.image.startsWith('ipfs://')
                                ? nft.image.replace('ipfs://', 'https://ipfs.io/ipfs/')
                                : nft.image, alt: nft.name, className: "nft-image-large" })) : (_jsx("div", { className: "nft-image-placeholder-large", children: "No Image" })) }), _jsxs("div", { className: "nft-info", children: [_jsxs("div", { className: "info-section", children: [_jsx("h2", { children: "Descrizione" }), _jsx("p", { className: "nft-description-full", children: nft.description })] }), nft.attributes && nft.attributes.length > 0 && (_jsxs("div", { className: "info-section", children: [_jsx("h2", { children: "Attributi" }), _jsx("div", { className: "attributes-container", children: nft.attributes.map(function (attr, index) { return (_jsxs("div", { className: "attribute-card", children: [_jsx("div", { className: "attribute-trait", children: attr.trait_type }), _jsx("div", { className: "attribute-value", children: attr.value })] }, index)); }) })] })), _jsxs("div", { className: "info-section", children: [_jsx("h2", { children: "Dettagli" }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "detail-label", children: "ID Token:" }), _jsx("span", { className: "detail-value", children: nft.id })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "detail-label", children: "Proprietario:" }), _jsx("span", { className: "detail-value address", children: nft.owner })] }), _jsxs("div", { className: "detail-row", children: [_jsx("span", { className: "detail-label", children: "Prezzo:" }), _jsxs("span", { className: "detail-value price", children: [formatEther(nft.price), " ETH"] })] })] }), _jsx("div", { className: "action-section", children: isOwner ? (_jsxs("div", { className: "owner-message", children: [_jsx("p", { children: "Sei il proprietario di questo NFT" }), _jsx(Link, { to: "/my-collection", className: "collection-link", children: "Visualizza la tua collezione" })] })) : (_jsx("button", { className: "purchase-button", onClick: handlePurchase, disabled: isPending, children: isPending ? "Transazione in corso..." : "Acquista per ".concat(formatEther(nft.price), " ETH") })) })] })] }), isOwner && (_jsxs("div", { className: "content-access", children: [_jsx("h2", { children: "Contenuto esclusivo" }), _jsxs("div", { className: "exclusive-content", children: [_jsx("p", { children: "In quanto proprietario di questo NFT, hai accesso al contenuto esclusivo!" }), _jsxs("div", { className: "content-box", children: [_jsx("h3", { children: "Contenuto scientifico protetto da NFT" }), _jsx("p", { children: "Questo \u00E8 un esempio di articolo scientifico accessibile solo ai proprietari dell'NFT." }), _jsxs("div", { className: "scientific-content", children: [_jsx("h4", { children: "Abstract" }), _jsx("p", { children: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula." }), _jsx("h4", { children: "Introduzione" }), _jsx("p", { children: "Ut ultrices ultrices enim. Curabitur sit amet mauris. Morbi in dui quis est pulvinar ullamcorper. Nulla facilisi. Integer lacinia sollicitudin massa." }), _jsx("h4", { children: "Metodologia" }), _jsx("p", { children: "Cras metus. Sed aliquet risus a tortor. Integer id quam. Morbi mi. Quisque nisl felis, venenatis tristique, dignissim in, ultrices sit amet, augue." }), _jsx("h4", { children: "Risultati" }), _jsx("p", { children: "Proin sodales libero eget ante. Nulla quam. Aenean laoreet. Vestibulum nisi lectus, commodo ac, facilisis ac, ultricies eu, pede." }), _jsx("h4", { children: "Conclusioni" }), _jsx("p", { children: "Donec lacus nunc, viverra nec, blandit vel, egestas et, augue. Vestibulum tincidunt malesuada tellus. Ut ultrices ultrices enim." })] })] })] })] }))] }));
};
export default NFTDetails;
