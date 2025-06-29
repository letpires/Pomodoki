 import BattleContract_V2 from 0xBattleContract

access(all) fun main(): [BattleContract_V2.Battle] { 
    return BattleContract_V2.getBattles()
} 