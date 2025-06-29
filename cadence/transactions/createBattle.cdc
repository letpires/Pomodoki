 import BattleContract from 0xBattleContract

transaction(endDate: UInt64, prize: String, title: String) { 
    let account: &Account

    prepare(signer: auth(Storage, Capabilities) &Account) { 
        self.account = signer
    }

    execute { 
        BattleContract.createBattle(end: endDate, owner: self.account.address, prize: prize, title: title)
    }
}