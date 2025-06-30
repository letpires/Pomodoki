const GET_USER_BATTLES_CADENCE = `
 import BattleContract_V2 from 0xBattleContract

access(all) fun main(user: Address): [BattleContract_V2.BattleResponse] { 
    let battles: [UInt64] = BattleContract_V2.getBattlesByUser(user: user)
    let battlesWithStats: [BattleContract_V2.BattleResponse] = []
    for battle in battles {
        let stats: BattleContract_V2.BattleResponse? = BattleContract_V2.getBattle(id: battle)
        if stats != nil {
            battlesWithStats.append(stats!)
        }
    }
    return battlesWithStats
} 
`;

export default GET_USER_BATTLES_CADENCE;