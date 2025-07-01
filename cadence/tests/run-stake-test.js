const { executeJoinBattleByUser, executeStake, executeRedeem, executeGetUserStats, executeCreateBattle, executeGetBattleStats, executeJoinBattle } = require("./stake-test");

async function main() {
  console.log("🧪 Starting stake transaction test...");

  try { 
    // await executeStake();
    // await executeRedeem();
    // await executeGetUserStats();
    // await executeCreateBattle();
    // await executeGetBattleStats();
    // await executeJoinBattle(); 
    await executeJoinBattleByUser("0xf8d6e0586b0a20c7");
    // create more users
    for (let i = 0; i < 10; i++) {
      //thread sleep
      await new Promise(resolve => setTimeout(resolve, 1000));
      await executeJoinBattleByUser(`0xf8d6e0586b0a20${Math.floor(Math.random() * 100)}`);
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

main();
