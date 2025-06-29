// run the command flow project deploy --network testnet

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// load .env file
require("dotenv").config({
  path: ".env",
}); 

let contractCode = fs.readFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  "utf8"
);

contractCode = contractCode.replace("0xFlowToken", "0x7e60df042a9c0868");
contractCode = contractCode.replace("0xFungibleToken", "0x9a0766d93b6608b7");

fs.writeFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  contractCode
);

exec(
  "flow project deploy cadence/contracts/StakingContract.cdc --network testnet",
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
