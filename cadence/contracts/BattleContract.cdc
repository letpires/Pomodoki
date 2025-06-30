import StakingContract_V2 from 0xStakingContract

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
    access(all) struct BattleResponse {
        access(all) let id: UInt64
        access(all) let owner: Address 
        access(all) let startDate: UInt64
        access(all) let endDate: UInt64
        access(all) let prize: String
        access(all) let title: String
        access(all) let image: String
        access(all) var users: [Address]  
        access(all) var usersWithHistory: {Address: [StakingContract_V2.HistoryStats]}

        init(battle: Battle, usersWithHistory: {Address: [StakingContract_V2.HistoryStats]}) {
            self.id = battle.id
            self.owner = battle.owner 
            self.startDate = battle.startDate
            self.endDate = battle.endDate
            self.prize = battle.prize
            self.title = battle.title
            self.image = battle.image
            self.users = battle.users
            self.usersWithHistory = usersWithHistory
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
    access(all) fun createBattle(start: UInt64, end: UInt64, owner: Address, prize: String, title: String, image: String): UInt64 {
        let id: UInt64 = self.nextBattleId
        let startDate: UInt64 = start
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

    access(all) fun getBattle(id: UInt64): BattleContract_V2.BattleResponse? {
        let battle: BattleContract_V2.Battle? = self.battles[id]
        if battle == nil {
            return nil
        }
 
        let users: [Address] = battle!.users
        let usersWithHistory: {Address: [StakingContract_V2.HistoryStats]} = {}
        
        for user in users {
            let history: [StakingContract_V2.HistoryStats]? = StakingContract_V2.getStats(address: user)
            if history != nil {
                usersWithHistory[user] = history!
            }
        }

        let battleResponse: BattleContract_V2.BattleResponse = BattleResponse(battle: battle!, usersWithHistory: usersWithHistory)
        return battleResponse
    }
    
    access(all) fun getBattles(): [Battle] {
        return self.battles.values  
    }  
    
    access(all) fun getBattlesByUser(user: Address): [UInt64] {
        return self.battlesByUser[user] ?? []
    }  
    
}
