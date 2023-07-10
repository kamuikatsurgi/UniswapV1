const hre = require("hardhat");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main(){

  const tokencontract = await hre.ethers.deployContract("Token");
  await tokencontract.waitForDeployment();

  console.log("Token contract deployed to address:" , tokencontract.target);

  const uniswapv1 = await hre.ethers.deployContract("Uniswap", [
    tokencontract.target,
  ]);

  await uniswapv1.waitForDeployment();

  console.log("Your v1 Uniswap was deployed to:", uniswapv1.target);

  await sleep(30 * 1000);

  await hre.run("verify:verify", {
    address : tokencontract.target,
    constructorArguments : [],
    contract : "contracts/Token.sol:Token",
  });

  await hre.run("verify:verify" , {
    address: uniswapv1.target,
    constructorArguments: [tokencontract.target],
    contract: "contracts/UniswapV1.sol:Uniswap",
  });
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});