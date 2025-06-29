import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import StakingContract_V1 from 0xStakingContract

transaction(amount: UFix64, timeCommitted: UFix64) {
    let stakingRef: &StakingContract_V1.Staking
    let account: &Account

    prepare(signer: auth(Storage, Capabilities, FungibleToken.Withdraw) &Account) {
        // Borrow a reference with Withdraw entitlement from storage
        let flowVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Could not borrow Flow token vault reference")

        let flowVault <- flowVaultRef.withdraw(amount: amount)

        let staking <- StakingContract_V1.createStaking(vault: <- flowVault)
        
        // Check if storage path exists and remove if it does
        if signer.storage.check<@StakingContract_V1.Staking>(from: /storage/StakingV1) {
            let oldStaking <- signer.storage.load<@StakingContract_V1.Staking>(from: /storage/StakingV1)
            destroy oldStaking
            signer.capabilities.unpublish(/public/StakingV1)
        }
        
        signer.storage.save(<- staking, to: /storage/StakingV1)
        signer.capabilities.publish(
            signer.capabilities.storage.issue<&StakingContract_V1.Staking>(/storage/StakingV1),
            at: /public/StakingV1
        )

        self.stakingRef = signer.capabilities.borrow<&StakingContract_V1.Staking>(/public/StakingV1)
            ?? panic("Could not borrow Staking reference")
        self.account = signer
    }

    execute {
        self.stakingRef.stake(address: self.account, amount: amount, timeCommitted: timeCommitted)
    }
}