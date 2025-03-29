// scripts/deploy.js
const fs = require('fs');
const path = require('path');
const { ethers } = require("hardhat");

async function main() {
  // Deploy DnaCollection
  const DnaCollection = await ethers.getContractFactory("DnaCollection");
  const dnaCollection = await DnaCollection.deploy("DnA NFT Collection", "DNA", "Collezione di NFT per contenuti scientifici di DnA");
  await dnaCollection.deployed();
  
  console.log("DnaCollection deployed to:", dnaCollection.address);

  // Deploy DnaAuction
  const DnaAuction = await ethers.getContractFactory("DnaAuction");
  const dnaAuction = await DnaAuction.deploy();
  await dnaAuction.deployed();
  
  console.log("DnaAuction deployed to:", dnaAuction.address);

  // Salva gli indirizzi in un file JSON
  const addresses = {
    DnaCollection: dnaCollection.address,
    DnaAuction: dnaAuction.address,
    network: network.name
  };
  
  // Crea la directory se non esiste
  const addressDir = path.join(__dirname, "../frontend/src/contracts");
  if (!fs.existsSync(addressDir)) {
    fs.mkdirSync(addressDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(addressDir, "addresses.json"),
    JSON.stringify(addresses, null, 2)
  );
  
  console.log("Indirizzi salvati in:", path.join(addressDir, "addresses.json"));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });