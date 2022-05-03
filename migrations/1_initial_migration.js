const Oracle = artifacts.require("./Oracle.sol");
const Staking = artifacts.require("./Staking.sol");

module.exports = async function(deployer, _network, accounts) {
  await deployer.deploy(Oracle);
  const chainlink = await Oracle.deployed();
  await deployer.deploy(Staking, chainlink.address);
};
