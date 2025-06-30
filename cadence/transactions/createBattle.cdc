 import BattleContract_V2 from 0xBattleContract

transaction(startDate: UInt64, endDate: UInt64, prize: String, title: String, image: String) { 
    let account: &Account

    prepare(signer: auth(Storage, Capabilities) &Account) { 
        self.account = signer
    }

    execute { 
        BattleContract_V2.createBattle(start: startDate, end: endDate, owner: self.account.address, prize: prize, title: title, image: image)
    }
}