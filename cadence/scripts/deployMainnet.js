// run the command flow project deploy --network testnet

const { exec } = require("child_process");
const fs = require("fs");

// load .env file
require("dotenv").config({
  path: ".env",
}); 

// change smart contract reference to mainnet

const contractCode = fs.readFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  "utf8"
);

contractCode = contractCode.replace("0xFlowToken", "0x1654653399040a61");
contractCode = contractCode.replace("0xFungibleToken", "0xf233dcee88fe0abe");

fs.writeFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  contractCode
);

exec(
  "flow project deploy cadence/contracts/StakingContract.cdc --network mainnet",
  (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error}`);
      return;
    }

    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
    }

    console.log(`Command output: ${stdout}`);
  }
);
