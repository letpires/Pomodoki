 import BattleContract from 0xBattleContract

access(all) fun main(): [BattleContract.Battle] { 
    return BattleContract.getBattles()
} 