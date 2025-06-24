import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

access(all) contract Battles {

    access(all) enum BattleStatus { pending, active, done }

    access(all) struct Battle {
        access(all) let id: UInt64
        access(all) let options: [String]
        access(all) let startDate: UFix64
        access(all) let endDate: UFix64
        access(all) var users: {Address: UInt8} 
        access(all) var status: BattleStatus

        init(id: UInt64, options: [String], startDate: UFix64, endDate: UFix64) {
            self.id = id
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

    access(all) fun createBattle(options: [String], start: UFix64, end: UFix64): UInt64 {
        let id = self.nextBattleId
        self.battles[id] = Battle(id: id, options: options, startDate: start, endDate: end)
        self.nextBattleId = self.nextBattleId + 1
        return id
    }

    access(all) fun joinBattle(battleId: UInt64, optionIndex: UInt8, user: Address) {
        let battle = self.battles[battleId]!
        assert(optionIndex < UInt8(battle.options.length), message: "Invalid option")
        battle.users[user] = optionIndex

        // Mint participation NFT (you'd implement this in YourNFTContract)
        // YourNFTContract.mintParticipationNFT(to: user, battleId: battleId, optionIndex: optionIndex)
    }

    access(all) fun getBattle(id: UInt64): Battle? {
        return self.battles[id]
    }

    access(all) fun updateStatus(id: UInt64, status: BattleStatus) {
        let battle = self.battles[id]!
        battle.status = status
    }
}
