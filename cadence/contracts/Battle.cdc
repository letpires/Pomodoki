access(all) contract Battles {  
    access(all) struct Battle {
        access(all) let id: UInt64
        access(all) let owner: Address
        access(all) let options: [String]
        access(all) let startDate: UFix64
        access(all) let endDate: UFix64
        access(all) var users: [Address] 

        init(id: UInt64, owner: Address, options: [String], startDate: UFix64, endDate: UFix64) {
            self.id = id
            self.owner = owner
            self.options = options
            self.startDate = startDate
            self.endDate = endDate
            self.users = [] 
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
        pre {
            self.battles[battleId] != nil: "Battle does not exist"
        } 

        self.battles[battleId]!.users.append(user) 
    }

    access(all) fun getBattle(id: UInt64): Battle? {
        return self.battles[id]
    } 
}
