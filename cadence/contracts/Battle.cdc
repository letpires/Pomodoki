import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

access(all) contract Battles {

    access(all) enum BattleStatus { pending, active, done }

    access(all) struct Battle {
        access(all) let id: UInt64
        access(all) let owner: Address
        access(all) let options: [String]
        access(all) let startDate: UFix64
        access(all) let endDate: UFix64
        access(all) var users: {Address: UInt8} 
        access(all) var status: BattleStatus

        init(id: UInt64, owner: Address, options: [String], startDate: UFix64, endDate: UFix64) {
            self.id = id
            self.owner = owner
            self.options = options
            self.startDate = startDate
            self.endDate = endDate
            self.users = {}
            self.status = BattleStatus.pending
        }
    }

    access(self) var battles: {UInt64: Battle}
    access(self) var nextBattleId: UInt64

    init() {
        self.battles = {}
        self.nextBattleId = 1
    }

    access(all) fun createBattle(owner: Address, options: [String], end: UFix64): UInt64 {
        let id = self.nextBattleId
        let startDate = getCurrentBlock().timestamp
        self.battles[id] = Battle(id: id, owner: owner, options: options, startDate: startDate, endDate: end)
        self.nextBattleId = self.nextBattleId + 1
        return id
    }

    access(all) fun joinBattle(battleId: UInt64, user: Address) {
        let battle = self.battles[battleId]! 
        battle.users[user] = 1 // TODO - Change this later, for now this options is useless
    }

    access(all) fun getBattle(id: UInt64): Battle? {
        return self.battles[id]
    }

    // TODO - Chage the authAccount from the params, use something else
    access(all) fun updateStatus(id: UInt64, status: BattleStatus, authAccount: AuthAccount) {
        let battle = self.battles[id]!
        assert(battle.owner == authAccount.address, message: "Only the battle owner can update status")
        battle.status = status
    }
}
