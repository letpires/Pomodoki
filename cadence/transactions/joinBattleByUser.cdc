 import BattleContract_V2 from 0xBattleContract

transaction(battleId: UInt64, user: Address) {  
    prepare(signer: auth(Storage, Capabilities) &Account) {  
    }

    execute { 
        BattleContract_V2.joinBattle(battleId: battleId, user: user)
    }
}