import Test 
import BattleContract from 0x0000000000000007

access(all)
fun setup() {
    let err: Test.Error? = Test.deployContract(
        name: "BattleContract", 
        path: "/Users/glaiconpeixer/devSea/Pomodoki/cadence/contracts/BattleContract.cdc",
        arguments: []
    )
    Test.expect(err, Test.beNil())
}

access(all)
fun testCreateBattle() {
    let account: Test.TestAccount  = Test.createAccount()
    let options: [String] = ["Option 1", "Option 2"]
    let endDate: UFix64 = 1000.0

    let battleId = BattleContract.createBattle(end: endDate, owner: account.address)
    Test.assertEqual(battleId, UInt64(1))
    
    let battle = BattleContract.getBattle(id: battleId)
    Test.expect(battle != nil, Test.not(Test.beNil()))
    Test.assertEqual(battle!.owner, account.address) 
}

access(all)
fun testJoinBattle() {
    let owner: Test.TestAccount  = Test.createAccount()
    let user: Test.TestAccount = Test.createAccount()     
    let endDate: UFix64 = getCurrentBlock().timestamp + 1000.0
    
    let battleId = BattleContract.createBattle(end: endDate, owner: owner.address)
    BattleContract.joinBattle(battleId: battleId, user: user.address)
    
    let battle = BattleContract.getBattle(id: battleId)  
    Test.expect(battle != nil, Test.not(Test.beNil()))
    Test.assertEqual(battle!.users.length, 1)
    Test.assertEqual(battle!.users[0], user.address) 
    Test.assertEqual(battle!.endDate, endDate)
}

// access(all)
// fun testJoinBattle2() {
//     let owner: Test.TestAccount  = Test.createAccount()
//     let user: Test.TestAccount = Test.createAccount()     
//     let endDate: UFix64 = getCurrentBlock().timestamp + 1000.0
    
//     let battleId = BattleContract.createBattle(end: endDate, owner: owner.address)
//     BattleContract.joinBattle(battleId: battleId, user: user.address)

//     let staking <- StakingContract_V1.createStaking(vault: <- flowVault)
    
//     let battle = BattleContract.getBattle(id: battleId)  
//     Test.expect(battle != nil, Test.not(Test.beNil()))
//     Test.assertEqual(battle!.users.length, 1)
//     Test.assertEqual(battle!.users[0], user.address) 
//     Test.assertEqual(battle!.endDate, endDate)
// }

// Get battel users stats
// Get battle stats
// Set battle as finished


  
 