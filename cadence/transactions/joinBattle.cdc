 import BattleContract from 0xBattleContract

transaction(battleId: UInt64) { 
    let account: &Account

    prepare(signer: auth(Storage, Capabilities) &Account) { 
        self.account = signer
    }

    execute { 
        BattleContract.joinBattle(battleId: battleId, user: self.account.address)
    }
}