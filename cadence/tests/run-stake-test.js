const { executeStakeFromFile, executeGetUserStats, executeCreateBattle } = require("./stake-test");

async function main() {
  console.log("🧪 Starting stake transaction test...");

  try { 
    // await executeStakeFromFile();
    // await executeGetUserStats();
    await executeCreateBattle();
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

main();
