const fcl = require("@onflow/fcl"); 
const EC = require("elliptic");
const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const ec = new EC.ec("secp256k1");

// Configure FCL for emulator
fcl.config({
  "accessNode.api": "http://localhost:8888",
  "discovery.wallet": "http://localhost:8888/fcl/authn",
  "fcl.accountProof.resolver": "http://localhost:8888/fcl/account-proof",
  "0xStakingContract": "0xf8d6e0586b0a20c7",
  "0xBattleContract": "0xf8d6e0586b0a20c7",
  "0xFungibleToken": "0xee82856bf20e2aa6",
  "0xFlowToken": "0x0ae53cb6e3f42a79",
});

// Emulator account configuration
const EMULATOR_ACCOUNT = {
  address: "f8d6e0586b0a20c7",
  privateKey:
    "39dbc807732235567e28598c64a402af177c0136031caf54f31c7fabd502b04b",
  keyIndex: 0,
};

const deployStakingContract = async (contractCode, authz) => {
  try {
    const transactionId = await fcl.mutate({
      cadence: `
        transaction {
          prepare(signer: AuthAccount) {
            let code = signer.contracts.get(name: "StakingContract")
            if code == nil {
              signer.contracts.add(
                name: "StakingContract", 
                code: "${contractCode}"
              )
            }
          }
        }
      `,
      proposer: authz,
      payer: authz,
      authorizations: [authz],
      limit: 999,
    });

    await fcl.tx(transactionId).onceSealed();
    console.log("✅ Successfully deployed StakingContract");
  } catch (error) {
    console.error("❌ Failed to deploy StakingContract:", error);
  }
};

// Load transaction from file
const contractCode = fs.readFileSync(
  path.join(__dirname, "../contracts/StakingContract.cdc"),
  "utf8"
);

async function authorizeMinter(addr, flowKey, privateKey) {
  return async (account = {}) => {
    // console.log("🔑 account:", account);
    const user = await getAccount(addr);
    // console.log("🔑 User:", user);
    const key = user.keys[flowKey];

    const sign = signWithKey;
    const pk = privateKey;

    return {
      ...account,
      tempId: `${user.address}-${key.index}`,
      addr: fcl.sansPrefix(user.address),
      keyId: Number(key.index),
      signingFunction: (signable) => {
        return {
          addr: fcl.withPrefix(user.address),
          keyId: Number(key.index),
          signature: sign(pk, signable.message),
        };
      },
    };
  };
}

async function getAccount(addr) {
  const { account } = await fcl.send([fcl.getAccount(addr)]);
  return account;
}

function signWithKey(privateKey, msg) {
  const key = ec.keyFromPrivate(Buffer.from(privateKey, "hex"));
  const sig = key.sign(hashMsg(msg));
  const n = 32;
  const r = sig.r.toArrayLike(Buffer, "be", n);
  const s = sig.s.toArrayLike(Buffer, "be", n);
  return Buffer.concat([r, s]).toString("hex");
}

function hashMsg(msg) {
  return crypto.createHash("sha256").update(Buffer.from(msg, "hex")).digest();
}

// Alternative function to load transaction from file
async function executeStake() {
  try {

    // Create authorization function for emulator
    const authz = await authorizeMinter(
      EMULATOR_ACCOUNT.address,
      EMULATOR_ACCOUNT.keyIndex,
      EMULATOR_ACCOUNT.privateKey
    );
    
    // await deployStakingContract(contractCode, authz);

    // Load transaction from file
    const transactionCode = fs.readFileSync(
      path.join(__dirname, "../transactions/stake.cdc"),
      "utf8"
    );

    console.log("🚀 Starting stake transaction from file..."); 

    // console.log("🔑 Authorization created", authz);

    const args = [
      fcl.arg("10.0", fcl.t.UFix64), // amount: 10 FLOW
      fcl.arg("60", fcl.t.UInt64), // timeCommitted: 1 hour
    ];

    // console.log("🔑 Arguments:", args);

    const transactionId = await fcl.send([
      fcl.transaction(transactionCode),
      fcl.args(args),
      fcl.proposer(authz),
      fcl.authorizations([authz]),
      fcl.payer(authz),
      fcl.limit(1000),
    ]);

    console.log("📝 Transaction submitted with ID:", transactionId);

    const transaction = await fcl.tx(transactionId).onceSealed();

    if (transaction.status === 4) {
      console.log("✅ Transaction successful!");
    } else {
      console.log("❌ Transaction failed:", transaction);
    }
  } catch (error) {
    // console.error("❌ Error executing stake transaction from file:", error);
  }
}


// Alternative function to load transaction from file
async function executeRedeem() {
  try {

    // Create authorization function for emulator
    const authz = await authorizeMinter(
      EMULATOR_ACCOUNT.address,
      EMULATOR_ACCOUNT.keyIndex,
      EMULATOR_ACCOUNT.privateKey
    );
    
    // await deployStakingContract(contractCode, authz);

    // Load transaction from file
    const transactionCode = fs.readFileSync(
      path.join(__dirname, "../transactions/redeem.cdc"),
      "utf8"
    );

    console.log("🚀 Starting redeem transaction from file..."); 

    // console.log("🔑 Authorization created", authz);

    const args = [ 
    ];

    // console.log("🔑 Arguments:", args);

    const transactionId = await fcl.send([
      fcl.transaction(transactionCode),
      fcl.args(args),
      fcl.proposer(authz),
      fcl.authorizations([authz]),
      fcl.payer(authz),
      fcl.limit(1000),
    ]);

    console.log("📝 Transaction submitted with ID:", transactionId);

    const transaction = await fcl.tx(transactionId).onceSealed();

    if (transaction.status === 4) {
      console.log("✅ Transaction successful!");
    } else {
      console.log("❌ Transaction failed:", transaction);
    }
  } catch (error) {
    // console.error("❌ Error executing stake transaction from file:", error);
  }
}

// execute get user stats
async function executeGetUserStats() {
  try { 
    const transactionCode = fs.readFileSync(
      path.join(__dirname, "../scripts/getUserStats.cdc"),
      "utf8"
    );

    const result = await fcl.query({
      cadence: transactionCode,
      args: (arg, t) => [arg("0xf8d6e0586b0a20c7", t.Address)],
    }) 
    console.log("🔑 Result:", result);
  } catch (error) {
    console.error("❌ Error executing get user stats transaction:", error);
  }
}

// execute get user stats
async function executeCreateBattle() {
  try { 
    // Create authorization function for emulator
    const authz = await authorizeMinter(
      EMULATOR_ACCOUNT.address,
      EMULATOR_ACCOUNT.keyIndex,
      EMULATOR_ACCOUNT.privateKey
    );
    
    const transactionCode = fs.readFileSync(
      path.join(__dirname, "../transactions/createBattle.cdc"),
      "utf8"
    );

    const args = [ 
      fcl.arg("3600.0", fcl.t.UFix64), 
    ];

    console.log("🔑 Arguments:", args);

    const transactionId = await fcl.send([
      fcl.transaction(transactionCode),
      fcl.args(args),
      fcl.proposer(authz),
      fcl.authorizations([authz]),
      fcl.payer(authz),
      fcl.limit(1000),
    ]);
    const transaction = await fcl.tx(transactionId).onceSealed();

    if (transaction.status === 4) {
      console.log("✅ Transaction successful!");
    } else {
      console.log("❌ Transaction failed:", transaction);
    }
  } catch (error) {
    console.error("❌ Error executing get user stats transaction:", error);
  }
}

// execute get user stats
async function executeGetBattleStats() {
  try { 
    const transactionCode = fs.readFileSync(
      path.join(__dirname, "../scripts/getBattleStats.cdc"),
      "utf8"
    );

    const result = await fcl.query({
      cadence: transactionCode,
      args: (arg, t) => [arg("1", t.UInt64)],
    }) 
    console.log("🔑 Result:", result);
  } catch (error) {
    console.error("❌ Error executing get battle stats transaction:", error);
  }
} 

// execute get user stats
async function executeJoinBattle() {
  try { 
    // Create authorization function for emulator
    const authz = await authorizeMinter(
      EMULATOR_ACCOUNT.address,
      EMULATOR_ACCOUNT.keyIndex,
      EMULATOR_ACCOUNT.privateKey
    );
    
    const transactionCode = fs.readFileSync(
      path.join(__dirname, "../transactions/joinBattle.cdc"),
      "utf8"
    );

    const args = [ 
      fcl.arg("1", fcl.t.UInt64), 
    ];

    console.log("🔑 Arguments:", args);

    const transactionId = await fcl.send([
      fcl.transaction(transactionCode),
      fcl.args(args),
      fcl.proposer(authz),
      fcl.authorizations([authz]),
      fcl.payer(authz),
      fcl.limit(1000),
    ]);
    const transaction = await fcl.tx(transactionId).onceSealed();

    if (transaction.status === 4) {
      console.log("✅ Transaction successful!");
    } else {
      console.log("❌ Transaction failed:", transaction);
    }
  } catch (error) {
    console.error("❌ Error executing get user stats transaction:", error);
  }
} 

// Export functions for use in other files
module.exports = {
  executeStake,
  executeGetUserStats,
  executeCreateBattle,
  executeGetBattleStats,
  executeJoinBattle,
  executeRedeem,
  EMULATOR_ACCOUNT,
};
