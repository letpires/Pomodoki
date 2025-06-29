access(all) contract BattleContract {  
    access(all) struct Battle {
        access(all) let id: UInt64
        access(all) let owner: Address 
        access(all) let startDate: UFix64
        access(all) let endDate: UFix64
        access(all) var users: [Address]  

        init(id: UInt64, owner: Address,  startDate: UFix64, endDate: UFix64) {
            self.id = id
            self.owner = owner 
            self.startDate = startDate
            self.endDate = endDate
            self.users = []  
        }  
    }

    access(self) var battles: {UInt64: Battle} 
    access(self) var battlesByUser: {Address: [UInt64]} 
    access(self) var nextBattleId: UInt64

    init() {
        self.battles = {}
        self.battlesByUser = {}
        self.nextBattleId = 1
    }

    // TODO - Create a stake mechanism for the battle, user needs to stake a certain amount of tokens to create a battle
    access(all) fun createBattle(end: UFix64, owner: Address): UInt64 {
        let id: UInt64 = self.nextBattleId
        let startDate: UFix64 = getCurrentBlock().timestamp
        self.battles[id] = Battle(id: id, owner: owner, startDate: startDate, endDate: end) 
        self.nextBattleId = self.nextBattleId + 1
        return id
    }

    access(all) fun joinBattle(battleId: UInt64, user: Address) {
        pre {
            self.battles[battleId] != nil: "Battle does not exist"
        } 

        self.battles[battleId]!.users.append(user) 
        if self.battlesByUser[user] == nil {
            self.battlesByUser[user] = [battleId]
        } else {
            self.battlesByUser[user]!.append(battleId)
        }
    }

    access(all) fun getBattle(id: UInt64): Battle? {
        return self.battles[id]
    }  
    
    access(all) fun getBattles( ): [Battle] {
        return self.battles.values  
    }  
    
    
    access(all) fun getBattlesByUser(user: Address): [UInt64] {
        return self.battlesByUser[user]!
    }  
    
}
