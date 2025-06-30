// run the command flow project deploy --network testnet

const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

// load .env file
require("dotenv").config({
  path: ".env",
}); 

// change smart contract reference to mainnet

let contractCode = fs.readFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  "utf8"
);

contractCode = contractCode.replace("0xFlowToken", "0x1654653399040a61");
contractCode = contractCode.replace("0xFungibleToken", "0xf233dcee88fe0abe");

fs.writeFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  contractCode
);

let contractCodeBattle = fs.readFileSync(
  path.join(__dirname, "../contracts/BattleContract.cdc"),
  "utf8"
);
contractCodeBattle = contractCodeBattle.replace("0xStakingContract", "0x2eed39e014db1d54");

fs.writeFileSync(
  path.join(__dirname, "../contracts/BattleContract.cdc"),
  contractCodeBattle
);

exec(
  "flow deploy --network mainnet --update",
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
