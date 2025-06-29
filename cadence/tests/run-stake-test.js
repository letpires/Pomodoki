const { executeStake, executeGetUserStats, executeCreateBattle, executeGetBattleStats, executeJoinBattle } = require("./stake-test");

async function main() {
  console.log("🧪 Starting stake transaction test...");

  try { 
    // await executeStake();
    // await executeGetUserStats();
    // await executeCreateBattle();
    await executeGetBattleStats();
    await executeJoinBattle(); 

  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

main();
