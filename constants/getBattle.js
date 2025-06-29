const GET_BATTLE_CADENCE = `
import BattleContract from 0xBattleContract

access(all) fun main(): [BattleContract.Battle] { 
    return BattleContract.getBattles()
} 
`;

export default GET_BATTLE_CADENCE;