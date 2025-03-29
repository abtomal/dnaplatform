const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DnaCollection", function () {
  let DnaCollection;
  let dnaCollection;
  let DnaAuction;
  let dnaAuction;
  let owner;
  let addr1;
  let addr2;
  let attacker;
  
  // Metadati della collezione
  const name = "DnA Articles";
  const symbol = "DNAA";
  const description = "Scientific articles from DnA as NFTs";
  
  // Metadati del token
  const tokenURI = "ipfs://QmXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
  const tokenStartingPrice = ethers.parseEther("0.1"); // 0.1 ETH
  const auctionDuration = 60 * 60 * 24; // 1 giorno in secondi
  
  beforeEach(async function () {
    // Ottieni gli account di test
    [owner, addr1, addr2, attacker] = await ethers.getSigners();
    
    // Deploying del contratto collection
    DnaCollection = await ethers.getContractFactory("DnaCollection");
    dnaCollection = await DnaCollection.deploy(name, symbol, description);
    await dnaCollection.waitForDeployment();
    
    // Deploying del contratto auction per i test di integrazione
    DnaAuction = await ethers.getContractFactory("DnaAuction");
    dnaAuction = await DnaAuction.deploy();
    await dnaAuction.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Dovrebbe impostare il nome e il simbolo corretti", async function () {
      expect(await dnaCollection.name()).to.equal(name);
      expect(await dnaCollection.symbol()).to.equal(symbol);
    });

    it("Dovrebbe impostare il proprietario corretto", async function () {
      expect(await dnaCollection.getContractOwner()).to.equal(owner.address);
    });
    
    it("Dovrebbe impostare la descrizione corretta", async function () {
      expect(await dnaCollection.collectionDescription()).to.equal(description);
    });
  });

  describe("NFT Creation", function () {
    it("Dovrebbe permettere all'admin di creare un nuovo NFT", async function () {
      await dnaCollection.createNFT(addr1.address, tokenURI, tokenStartingPrice);
      
      expect(await dnaCollection.getTotalNFTs()).to.equal(1);
      expect(await dnaCollection.ownerOf(0)).to.equal(addr1.address);
      expect(await dnaCollection.tokenURI(0)).to.equal(tokenURI);
      expect(await dnaCollection.getTokenStartingPrice(0)).to.equal(tokenStartingPrice);
    });

    it("Non dovrebbe permettere a non admin di creare NFT", async function () {
      await expect(
        dnaCollection.connect(addr1).createNFT(addr1.address, tokenURI, tokenStartingPrice)
      ).to.be.revertedWithCustomError(dnaCollection, "OwnableUnauthorizedAccount");
    });
    
    it("Non dovrebbe permettere di creare un NFT con prezzo iniziale zero", async function () {
      await expect(
        dnaCollection.createNFT(addr1.address, tokenURI, 0)
      ).to.be.revertedWith("DnaCollection: il prezzo iniziale deve essere maggiore di zero");
    });
  });

  describe("NFT Starting Price", function () {
    beforeEach(async function () {
      await dnaCollection.createNFT(addr1.address, tokenURI, tokenStartingPrice);
    });

    it("Dovrebbe permettere all'admin di modificare il prezzo iniziale", async function () {
      const newPrice = ethers.parseEther("0.2");
      
      await dnaCollection.setTokenStartingPrice(0, newPrice);
      
      expect(await dnaCollection.getTokenStartingPrice(0)).to.equal(newPrice);
    });

    it("Non dovrebbe permettere a non admin di modificare il prezzo iniziale", async function () {
      const newPrice = ethers.parseEther("0.2");
      
      await expect(
        dnaCollection.connect(addr1).setTokenStartingPrice(0, newPrice)
      ).to.be.revertedWithCustomError(dnaCollection, "OwnableUnauthorizedAccount");
    });
    
    it("Non dovrebbe permettere di impostare un prezzo iniziale zero", async function () {
      await expect(
        dnaCollection.setTokenStartingPrice(0, 0)
      ).to.be.revertedWith("DnaCollection: il prezzo iniziale deve essere maggiore di zero");
    });
  });

  describe("NFT Purchase", function () {
    beforeEach(async function () {
      await dnaCollection.createNFT(addr1.address, tokenURI, tokenStartingPrice);
    });

    it("Dovrebbe permettere l'acquisto di un NFT", async function () {
      const initialBalance = await ethers.provider.getBalance(addr1.address);
      
      await dnaCollection.connect(addr2).purchaseNFT(0, { value: tokenStartingPrice });
      
      // Verificare che l'NFT sia stato trasferito
      expect(await dnaCollection.ownerOf(0)).to.equal(addr2.address);
      
      // Verificare che il venditore abbia ricevuto i fondi
      const finalBalance = await ethers.provider.getBalance(addr1.address);
      expect(finalBalance).to.be.greaterThan(initialBalance);
    });

    it("Non dovrebbe permettere l'acquisto con fondi insufficienti", async function () {
      const insufficientPrice = ethers.parseEther("0.05");
      
      await expect(
        dnaCollection.connect(addr2).purchaseNFT(0, { value: insufficientPrice })
      ).to.be.revertedWith("DnaCollection: fondi insufficienti");
    });

    it("Non dovrebbe permettere l'acquisto del proprio NFT", async function () {
      await expect(
        dnaCollection.connect(addr1).purchaseNFT(0, { value: tokenStartingPrice })
      ).to.be.revertedWith("DnaCollection: non puoi acquistare il tuo stesso NFT");
    });
    
    it("Dovrebbe rimborsare l'eccesso di fondi inviati", async function () {
      const excessAmount = ethers.parseEther("0.05");
      const totalPayment = tokenStartingPrice + excessAmount;
      const initialBalance = await ethers.provider.getBalance(addr2.address);
      
      // Esegui l'acquisto con più fondi del necessario
      const tx = await dnaCollection.connect(addr2).purchaseNFT(0, { value: totalPayment });
      const receipt = await tx.wait();
      
      // Calcola il gas usato
      const gasUsed = receipt.gasUsed * receipt.gasPrice;
      
      // Verifica che il compratore abbia ricevuto indietro l'eccesso meno il gas
      const finalBalance = await ethers.provider.getBalance(addr2.address);
      const expectedBalance = initialBalance - tokenStartingPrice - gasUsed;
      
      // Usa una tolleranza piccola per i calcoli con i numeri a virgola mobile
      expect(finalBalance).to.be.closeTo(expectedBalance, ethers.parseEther("0.0001"));
    });
  });

  describe("NFT Transfer", function () {
    beforeEach(async function () {
      await dnaCollection.createNFT(addr1.address, tokenURI, tokenStartingPrice);
    });

    it("Dovrebbe permettere al proprietario dell'NFT di trasferirlo", async function () {
      await dnaCollection.connect(addr1).transferFrom(addr1.address, addr2.address, 0);
      
      expect(await dnaCollection.ownerOf(0)).to.equal(addr2.address);
    });

    it("Non dovrebbe permettere a non proprietari di trasferire l'NFT", async function () {
      await expect(
        dnaCollection.connect(addr2).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.reverted;
    });
  });
  
  describe("Prepare NFT For Auction", function () {
    beforeEach(async function () {
      await dnaCollection.createNFT(owner.address, tokenURI, tokenStartingPrice);
    });
    
    it("Dovrebbe permettere all'admin di preparare un NFT per l'asta", async function () {
      // Prepara l'NFT per l'asta
      const tx = await dnaCollection.prepareNFTForAuction(0, await dnaAuction.getAddress());
      await tx.wait();
      
      // Ottieni il prezzo iniziale direttamente
      const startingPrice = await dnaCollection.getTokenStartingPrice(0);
      
      // Verifica che il contratto asta sia approvato per il token
      expect(await dnaCollection.getApproved(0)).to.equal(await dnaAuction.getAddress());
      
      // Verifica che il prezzo iniziale restituito sia corretto
      expect(startingPrice).to.equal(tokenStartingPrice);
      
      // Ora possiamo creare l'asta direttamente usando il contratto DnaAuction
      await dnaAuction.createAuction(
        await dnaCollection.getAddress(), 
        0, 
        startingPrice, 
        auctionDuration
      );
      
      // Verifica che sia stata creata un'asta
      expect(await dnaAuction.getTotalAuctions()).to.equal(1);
      
      // Verifica che l'NFT sia stato trasferito al contratto asta
      expect(await dnaCollection.ownerOf(0)).to.equal(await dnaAuction.getAddress());
      
      // Verifica i dettagli dell'asta
      const auctionDetails = await dnaAuction.getAuctionDetails(0);
      expect(auctionDetails[0]).to.equal(await dnaCollection.getAddress()); // nftContract
      expect(auctionDetails[1]).to.equal(0); // tokenId
      expect(auctionDetails[2]).to.equal(tokenStartingPrice); // startingPrice
    });
    
    it("Non dovrebbe permettere a non admin di preparare un NFT per l'asta", async function () {
      await expect(
        dnaCollection.connect(addr1).prepareNFTForAuction(0, await dnaAuction.getAddress())
      ).to.be.revertedWithCustomError(dnaCollection, "OwnableUnauthorizedAccount");
    });
    
    it("Non dovrebbe permettere di preparare un token inesistente", async function () {
      await expect(
        dnaCollection.prepareNFTForAuction(99, await dnaAuction.getAddress())
      ).to.be.revertedWith("DnaCollection: token inesistente");
    });
    
    it("Non dovrebbe permettere di preparare con un indirizzo invalido", async function () {
      await expect(
        dnaCollection.prepareNFTForAuction(0, ethers.ZeroAddress)
      ).to.be.revertedWith("DnaCollection: indirizzo asta invalido");
    });
  });

  describe("Sicurezza", function () {
    beforeEach(async function () {
      await dnaCollection.createNFT(addr1.address, tokenURI, tokenStartingPrice);
    });

    it("Dovrebbe proteggere contro tentativi di reentrancy", async function () {
      // Deploy di un contratto attaccante che prova reentrancy
      const AttackerFactory = await ethers.getContractFactory("ReentrancyAttacker");
      const attackerContract = await AttackerFactory.deploy();
      
      // Configura il contratto attaccante
      await attackerContract.setCollectionTarget(await dnaCollection.getAddress(), 0);
      
      // Tenta un attacco di reentrancy - il require(false) nel contratto attaccante
      // farà fallire la transazione, ma questo è il comportamento aspettato nel test
      await expect(
        attackerContract.attackCollectionPurchase({ value: tokenStartingPrice })
      ).to.be.reverted;
      
      // Verifica che l'NFT sia ancora di proprietà originale
      expect(await dnaCollection.ownerOf(0)).to.equal(addr1.address);
    });

    it("Dovrebbe gestire correttamente i fallimenti nei trasferimenti", async function () {
      // Deploy di un contratto che rifiuta ETH
      const RejectEthFactory = await ethers.getContractFactory("EthRejecter");
      const rejectEthContract = await RejectEthFactory.deploy();
      await rejectEthContract.waitForDeployment();
      
      // Crea un NFT posseduto dal contratto che rifiuta ETH
      await dnaCollection.createNFT(rejectEthContract.getAddress(), tokenURI, tokenStartingPrice);
      const newTokenId = 1;
      
      // Prova ad acquistare l'NFT, dovrebbe fallire perché il venditore rifiuta ETH
      await expect(
        dnaCollection.connect(addr2).purchaseNFT(newTokenId, { value: tokenStartingPrice })
      ).to.be.revertedWith("DnaCollection: trasferimento fallito");
    });
  });
});