 import Battles from 0xBattles

transaction(battleId: UInt64) { 
    let account: &Account

    prepare(signer: auth(Storage, Capabilities) &Account) { 
        self.account = signer
    }

    execute { 
        Battles.joinBattle(battleId: battleId, user: self.account.address)
    }
}