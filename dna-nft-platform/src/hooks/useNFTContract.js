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
var _a;
// src/hooks/useNFTContract.ts
import { useState, useEffect } from 'react';
import { useReadContract, useConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import DnaCollectionABI from '../contracts/DnaCollection.json';
import addresses from '../contracts/addresses.json';
// Configurazione specifica per le chiamate di solo lettura
var config = createConfig({
    chains: [sepolia],
    transports: (_a = {},
        _a[sepolia.id] = http(),
        _a),
});
export var useNFTContract = function () {
    var _a = useState(0), totalNFTs = _a[0], setTotalNFTs = _a[1];
    var wagmiConfig = useConfig();
    // Indirizzo del contratto
    var contractAddress = addresses.DnaCollection;
    // Leggi il numero totale di NFT
    var _b = useReadContract({
        address: contractAddress,
        abi: DnaCollectionABI,
        functionName: 'getTotalNFTs',
    }), totalNFTsData = _b.data, isError = _b.isError, error = _b.error;
    useEffect(function () {
        if (totalNFTsData) {
            setTotalNFTs(Number(totalNFTsData));
        }
        if (isError) {
            console.error('Errore nel recupero del numero totale di NFT:', error);
        }
    }, [totalNFTsData, isError, error]);
    // Funzione per verificare se un token esiste usando la config wagmi
    var tokenExists = function (tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readContract(wagmiConfig || config, {
                            address: contractAddress,
                            abi: DnaCollectionABI,
                            functionName: 'tokenExists',
                            args: [tokenId]
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_1 = _a.sent();
                    console.error("Errore nella verifica dell'esistenza del token ".concat(tokenId, ":"), error_1);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Funzione per recuperare il proprietario di un NFT
    var fetchOwner = function (tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        var exists, data, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, tokenExists(tokenId)];
                case 1:
                    exists = _a.sent();
                    if (!exists) {
                        throw new Error("Il token ".concat(tokenId, " non esiste"));
                    }
                    return [4 /*yield*/, readContract(wagmiConfig || config, {
                            address: contractAddress,
                            abi: DnaCollectionABI,
                            functionName: 'ownerOf',
                            args: [tokenId]
                        })];
                case 2:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 3:
                    error_2 = _a.sent();
                    console.error("Errore nel recupero del proprietario per l'NFT ".concat(tokenId, ":"), error_2);
                    return [2 /*return*/, "0x0000000000000000000000000000000000000000"];
                case 4: return [2 /*return*/];
            }
        });
    }); };
    // Funzione per recuperare il prezzo di un NFT
    var fetchPrice = function (tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readContract(wagmiConfig || config, {
                            address: contractAddress,
                            abi: DnaCollectionABI,
                            functionName: 'getTokenStartingPrice',
                            args: [tokenId]
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_3 = _a.sent();
                    console.error("Errore nel recupero del prezzo per l'NFT ".concat(tokenId, ":"), error_3);
                    return [2 /*return*/, BigInt(0)];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Funzione per recuperare l'URI di un NFT
    var fetchTokenURI = function (tokenId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readContract(wagmiConfig || config, {
                            address: contractAddress,
                            abi: DnaCollectionABI,
                            functionName: 'tokenURI',
                            args: [tokenId]
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_4 = _a.sent();
                    console.error("Errore nel recupero dell'URI per l'NFT ".concat(tokenId, ":"), error_4);
                    return [2 /*return*/, ""];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    return {
        totalNFTs: totalNFTs,
        contractAddress: contractAddress,
        abi: DnaCollectionABI,
        tokenExists: tokenExists,
        fetchOwner: fetchOwner,
        fetchPrice: fetchPrice,
        fetchTokenURI: fetchTokenURI
    };
};
