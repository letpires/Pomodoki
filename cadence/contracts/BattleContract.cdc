access(all) contract BattleContract_V2 {  
    access(all) struct Battle {
        access(all) let id: UInt64
        access(all) let owner: Address 
        access(all) let startDate: UInt64
        access(all) let endDate: UInt64
        access(all) let prize: String
        access(all) let title: String
        access(all) let image: String
        access(all) var users: [Address]  

        init(id: UInt64, owner: Address,  startDate: UInt64, endDate: UInt64, prize: String, title: String, image: String) {
            self.id = id
            self.owner = owner 
            self.startDate = startDate
            self.endDate = endDate
            self.prize = prize
            self.title = title
            self.image = image
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
    access(all) fun createBattle(end: UInt64, owner: Address, prize: String, title: String, image: String): UInt64 {
        let id: UInt64 = self.nextBattleId
        let startDate: UInt64 = UInt64(getCurrentBlock().timestamp)
        self.battles[id] = Battle(id: id, owner: owner, startDate: startDate, endDate: end, prize: prize, title: title, image: image) 
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
        return self.battlesByUser[user] ?? []
    }  
    
}
