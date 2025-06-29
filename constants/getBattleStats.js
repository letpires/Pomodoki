const GET_BATTLE_STATS_CADENCE = `
import BattleContract_V2 from 0xBattleContract

access(all) fun main(battleId: UInt64): BattleContract_V2.Battle? { 
    return BattleContract_V2.getBattle(id: battleId)
} 
`;

export default GET_BATTLE_STATS_CADENCE;