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

contractCode = contractCode.replace("0xFlowToken", "0x0ae53cb6e3f42a79");
contractCode = contractCode.replace("0xFungibleToken", "0xee82856bf20e2aa6");

fs.writeFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  contractCode
);
 
let contractCodeBattle = fs.readFileSync(
  path.join(__dirname, "../contracts/BattleContract.cdc"),
  "utf8"
);
contractCodeBattle = contractCodeBattle.replace("0xStakingContract", "0xf8d6e0586b0a20c7");

fs.writeFileSync(
  path.join(__dirname, "../contracts/BattleContract.cdc"),
  contractCodeBattle
);

exec(
  "flow deploy --network emulator --update",
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
