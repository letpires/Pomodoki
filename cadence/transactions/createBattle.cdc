 import BattleContract from 0xBattleContract

transaction(endDate: UFix64) { 
    let account: &Account

    prepare(signer: auth(Storage, Capabilities) &Account) { 
        self.account = signer
    }

    execute { 
        BattleContract.createBattle(end: endDate, owner: self.account.address)
    }
}