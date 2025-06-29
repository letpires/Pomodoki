 import Battles from 0xBattles

transaction(endDate: UFix64) { 
    let account: &Account

    prepare(signer: auth(Storage, Capabilities) &Account) { 
        self.account = signer
    }

    execute { 
        Battles.createBattle(end: endDate, owner: self.account.address)
    }
}