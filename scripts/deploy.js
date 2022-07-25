const hre = require("hardhat");

async function main(){

    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();
    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee depoyed to: " , buyMeACoffee.address);
  
}





main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });