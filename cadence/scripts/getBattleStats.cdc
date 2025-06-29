 import BattleContract_V2 from 0xBattleContract

access(all) fun main(battleId: UInt64): BattleContract_V2.BattleResponse? { 
    return BattleContract_V2.getBattle(id: battleId)
} 