 import Battles from 0xBattles

access(all) fun main(battleId: UInt64): Battles.Battle? { 
    return Battles.getBattle(id: battleId)
} 