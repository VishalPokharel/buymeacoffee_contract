
const hre = require("hardhat");


async function getBalance(address){
  const balanceBigInt = await hre.ethers.provider.getBalance(address);
  return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses){
  let idx=0;
  for(const address of addresses){
    console.log(`Address ${idx} balance: `,await getBalance(address));
    idx++;
  }
}

async function printMemos(memos){
  for(const memo of memos){
    const timestamp = memo.timestamp;
    const tipper = memo.name;
    const tipperAddress= memo.from;
    const message = memo.message;
    console.log(`At ${timestamp}, ${tipper} (${tipperAddress}) said: "${message}"`);
  }
}



async function main() {
  
  const [owner, tipper ,tipper2,tipper3] = await hre.ethers.getSigners();

  const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
  const buyMeACoffee = await BuyMeACoffee.deploy();
  await buyMeACoffee.deployed();
  console.log("BuyMeACoffee depoyed to: " , buyMeACoffee.address);

  const addresses = [owner.address,tipper.address,buyMeACoffee.address];
  console.log("----------start----------");
  await printBalances(addresses);

  const tip = {value: hre.ethers.utils.parseEther("1")};

  await buyMeACoffee.connect(tipper).buyCoffee("Vishal","i am ",tip);
  await buyMeACoffee.connect(tipper2).buyCoffee("Vis32hal","i am ",tip);
  await buyMeACoffee.connect(tipper3).buyCoffee("Vi23shal","i am ",tip);

  console.log("----bought coffee---");
  await printBalances(addresses);

  await buyMeACoffee.connect(owner).withdrawTips();

  console.log("----withdraw---");
  await printBalances(addresses);


  
  console.log("----memos---");
  const memos = await buyMeACoffee.getMemos();
  printMemos(memos);
  

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
