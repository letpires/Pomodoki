 import BattleContract from 0xBattleContract

access(all) fun main(battleId: UInt64): BattleContract.Battle? { 
    return BattleContract.getBattle(id: battleId)
} 