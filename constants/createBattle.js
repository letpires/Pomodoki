const CREATE_BATTLE_CADENCE = `
 import BattleContract_V2 from 0xBattleContract

transaction(endDate: UInt64, prize: String, title: String, image: String) { 
    let account: &Account

    prepare(signer: auth(Storage, Capabilities) &Account) { 
        self.account = signer
    }

    execute { 
        BattleContract_V2.createBattle(end: endDate, owner: self.account.address, prize: prize, title: title, image: image)
    }
}
`;

export default CREATE_BATTLE_CADENCE;