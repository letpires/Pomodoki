 import Battles from 0xBattles

pub fun main(battleId: UInt64): Battles.Battle? { 
    return Battles.getBattle(battleId)
} 