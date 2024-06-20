import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "YourContract" using the deployer account and
 * constructor arguments set to the deployer address
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  /*
    On localhost, the deployer account is the one that comes with Hardhat, which is already funded.

    When deploying to live networks (e.g `yarn deploy --network sepolia`), the deployer account
    should have sufficient balance to pay for the gas fees for contract creation.

    You can generate a random account with `yarn generate` which will fill DEPLOYER_PRIVATE_KEY
    with a random private key in the .env file (then used on hardhat.config.ts)
    You can run the `yarn account` command to check your balance in every network.
  */
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  //deploy the depositing token contract
  //we need the contract to store the deployer address as well and take that in as a constructor argument
  await deploy("FooToken", {
    from: deployer,
    args: ["FooToken", "FTN"],
    log: true,
    autoMine: true,
  });
  const fooToken = await hre.ethers.getContract<Contract>("FooToken", deployer);
  console.log(fooToken);
  //deploy the wager contract
  await deploy("Wager", {
    from: deployer,
    args: [fooToken.target, 1000000000],
    log: true,
    autoMine: true,
  });
  //const wager = await hre.ethers.getContract<Contract>("Wager", deployer);
};

export default deployYourContract;

// Tags are useful if you have multiple deploy files and only want to run one of them.
// e.g. yarn deploy --tags YourContract
deployYourContract.tags = ["PayToilet"];
