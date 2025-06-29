import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import StakingContract4 from 0xStakingContract

transaction(amount: UFix64, timeCommitted: UFix64) {
    let stakingRef: &StakingContract4.Staking

    prepare(signer: auth(Storage, Capabilities, FungibleToken.Withdraw) &Account) {
        // Borrow a reference with Withdraw entitlement from storage
        let flowVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Could not borrow Flow token vault reference")

        let flowVault <- flowVaultRef.withdraw(amount: amount)

        let staking <- StakingContract4.createStaking(vault: <- flowVault)
        
        // Check if storage path exists and remove if it does
        if signer.storage.check<@StakingContract4.Staking>(from: /storage/Staking) {
            let oldStaking <- signer.storage.load<@StakingContract4.Staking>(from: /storage/Staking)
            destroy oldStaking
            signer.capabilities.unpublish(/public/Staking)
        }
        
        signer.storage.save(<- staking, to: /storage/Staking)
        signer.capabilities.publish(
            signer.capabilities.storage.issue<&StakingContract4.Staking>(/storage/Staking),
            at: /public/Staking
        )

        self.stakingRef = signer.capabilities.borrow<&StakingContract4.Staking>(/public/Staking)
            ?? panic("Could not borrow Staking reference")
    }

    execute {
        self.stakingRef.stake(amount: amount, timeCommitted: timeCommitted)
    }
}