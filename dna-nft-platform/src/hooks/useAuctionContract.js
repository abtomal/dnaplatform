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
// src/hooks/useAuctionContract.ts
import { useState, useEffect } from 'react';
import { useReadContract, useConfig } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http, createConfig } from 'wagmi';
import { readContract } from '@wagmi/core';
import DnaAuctionABI from '../contracts/DnaAuction.json';
import addresses from '../contracts/addresses.json';
// Configurazione specifica per le chiamate di solo lettura
var config = createConfig({
    chains: [sepolia],
    transports: (_a = {},
        _a[sepolia.id] = http(),
        _a),
});
export var useAuctionContract = function () {
    var _a = useState(0), totalAuctions = _a[0], setTotalAuctions = _a[1];
    var wagmiConfig = useConfig();
    // Indirizzo del contratto
    var contractAddress = addresses.DnaAuction;
    // Leggi il numero totale di aste
    var _b = useReadContract({
        address: contractAddress,
        abi: DnaAuctionABI,
        functionName: 'getTotalAuctions',
    }), totalAuctionsData = _b.data, isError = _b.isError, error = _b.error;
    useEffect(function () {
        if (totalAuctionsData) {
            setTotalAuctions(Number(totalAuctionsData));
        }
        if (isError) {
            console.error('Errore nel recupero del numero totale di aste:', error);
        }
    }, [totalAuctionsData, isError, error]);
    // Funzione per recuperare i dettagli di un'asta
    var fetchAuctionDetails = function (auctionId) { return __awaiter(void 0, void 0, void 0, function () {
        var data, _a, nftContract, tokenId, startingPrice, endTime, highestBidder, highestBid, ended, nftClaimed, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readContract(wagmiConfig || config, {
                            address: contractAddress,
                            abi: DnaAuctionABI,
                            functionName: 'getAuctionDetails',
                            args: [auctionId]
                        })];
                case 1:
                    data = _b.sent();
                    _a = data, nftContract = _a[0], tokenId = _a[1], startingPrice = _a[2], endTime = _a[3], highestBidder = _a[4], highestBid = _a[5], ended = _a[6], nftClaimed = _a[7];
                    return [2 /*return*/, {
                            id: auctionId,
                            nftContract: nftContract,
                            tokenId: Number(tokenId),
                            startingPrice: startingPrice,
                            endTime: endTime,
                            highestBidder: highestBidder,
                            highestBid: highestBid,
                            ended: ended,
                            nftClaimed: nftClaimed
                        }];
                case 2:
                    error_1 = _b.sent();
                    console.error("Errore nel recupero dei dettagli dell'asta ".concat(auctionId, ":"), error_1);
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Funzione per verificare lo stato di un'asta
    var isAuctionActive = function (auctionId) { return __awaiter(void 0, void 0, void 0, function () {
        var auction, now, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fetchAuctionDetails(auctionId)];
                case 1:
                    auction = _a.sent();
                    if (!auction)
                        return [2 /*return*/, false];
                    now = BigInt(Math.floor(Date.now() / 1000));
                    return [2 /*return*/, !auction.ended && auction.endTime > now];
                case 2:
                    error_2 = _a.sent();
                    console.error("Errore nella verifica dello stato dell'asta ".concat(auctionId, ":"), error_2);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Funzione per recuperare l'offerta di un utente
    var fetchUserBid = function (auctionId, address) { return __awaiter(void 0, void 0, void 0, function () {
        var data, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, readContract(wagmiConfig || config, {
                            address: contractAddress,
                            abi: DnaAuctionABI,
                            functionName: 'getBid',
                            args: [auctionId, address]
                        })];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, data];
                case 2:
                    error_3 = _a.sent();
                    console.error("Errore nel recupero dell'offerta dell'utente per l'asta ".concat(auctionId, ":"), error_3);
                    return [2 /*return*/, BigInt(0)];
                case 3: return [2 /*return*/];
            }
        });
    }); };
    // Funzione per recuperare tutte le aste attive
    var fetchActiveAuctions = function () { return __awaiter(void 0, void 0, void 0, function () {
        var auctions, i, auction, _a, err_1, err_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    if (totalAuctions === 0)
                        return [2 /*return*/, []];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 10, , 11]);
                    auctions = [];
                    i = 0;
                    _b.label = 2;
                case 2:
                    if (!(i < totalAuctions)) return [3 /*break*/, 9];
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    return [4 /*yield*/, fetchAuctionDetails(i)];
                case 4:
                    auction = _b.sent();
                    _a = auction;
                    if (!_a) return [3 /*break*/, 6];
                    return [4 /*yield*/, isAuctionActive(i)];
                case 5:
                    _a = (_b.sent());
                    _b.label = 6;
                case 6:
                    if (_a) {
                        auctions.push(auction);
                    }
                    return [3 /*break*/, 8];
                case 7:
                    err_1 = _b.sent();
                    console.error("Errore nel recupero dell'asta ".concat(i, ":"), err_1);
                    return [3 /*break*/, 8];
                case 8:
                    i++;
                    return [3 /*break*/, 2];
                case 9: return [2 /*return*/, auctions];
                case 10:
                    err_2 = _b.sent();
                    console.error('Errore nel recupero delle aste attive:', err_2);
                    return [2 /*return*/, []];
                case 11: return [2 /*return*/];
            }
        });
    }); };
    // Calcola il tempo rimanente di un'asta in millisecondi
    var getRemainingTime = function (endTime) {
        var now = Date.now(); // Millisecondi attuali
        var end = Number(endTime) * 1000; // Converti secondi Unix in millisecondi
        return Math.max(0, end - now);
    };
    return {
        totalAuctions: totalAuctions,
        contractAddress: contractAddress,
        abi: DnaAuctionABI,
        fetchAuctionDetails: fetchAuctionDetails,
        isAuctionActive: isAuctionActive,
        fetchUserBid: fetchUserBid,
        fetchActiveAuctions: fetchActiveAuctions,
        getRemainingTime: getRemainingTime
    };
};
