import NonFungibleToken from 0xNFT
import YourNFTContract from 0xYourNFT

pub contract Battles {

    pub enum BattleStatus { pending, active, done }

    pub struct Battle {
        pub let id: UInt64
        pub let options: [String]
        pub let startDate: UFix64
        pub let endDate: UFix64
        pub var users: {Address: UInt8} // stores selected option index
        pub var status: BattleStatus

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

    pub fun createBattle(options: [String], start: UFix64, end: UFix64): UInt64 {
        let id = self.nextBattleId
        self.battles[id] = Battle(id: id, options: options, startDate: start, endDate: end)
        self.nextBattleId = self.nextBattleId + 1
        return id
    }

    pub fun joinBattle(battleId: UInt64, optionIndex: UInt8, user: Address) {
        let battle = self.battles[battleId]!
        assert(optionIndex < UInt8(battle.options.length), message: "Invalid option")
        battle.users[user] = optionIndex

        // Mint participation NFT (you'd implement this in YourNFTContract)
        YourNFTContract.mintParticipationNFT(to: user, battleId: battleId, optionIndex: optionIndex)
    }

    pub fun getBattle(id: UInt64): Battle? {
        return self.battles[id]
    }

    pub fun updateStatus(id: UInt64, status: BattleStatus) {
        let battle = self.battles[id]!
        battle.status = status
    }
}
