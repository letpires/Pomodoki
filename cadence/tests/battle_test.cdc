import Test
import Battles from 0x0000000000000007


access(all)
fun setup() {
    let err = Test.deployContract(
        name: "Battles", 
        path: "/Users/glaiconpeixer/devSea/Pomodoki/cadence/contracts/Battle.cdc",
        arguments: []
    )
    Test.expect(err, Test.beNil())
}

access(all)
fun testCreateBattle() {
    let account  = Test.createAccount()
    let options = ["Option 1", "Option 2"]
    let endDate = 1000.0
    
    let battleId = Battles.createBattle(owner: account.address, options: options, end: endDate)
    Test.assertEqual(battleId, UInt64(1))
    
    let battle = Battles.getBattle(id: battleId)
    Test.expect(battle != nil, Test.not(Test.beNil()))
    Test.assertEqual(battle!.owner, account.address)
    Test.assertEqual(battle!.options, options)
}

access(all)
fun testJoinBattle() {
    let owner = Test.createAccount()
    let user = Test.createAccount()
    let options = ["Option 1", "Option 2"]
    let endDate = 1000.0
    
    let battleId = Battles.createBattle(owner: owner.address, options: options, end: endDate)
    Battles.joinBattle(battleId: battleId, user: user.address)
    
    let battle = Battles.getBattle(id: battleId)  
    Test.expect(battle != nil, Test.not(Test.beNil()))
    Test.assertEqual(battle!.users.length, 1)
    Test.assertEqual(battle!.users[0], user.address)
}
  
 