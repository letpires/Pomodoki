const STAKE_CADENCE = `
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import StakingContract_V2 from 0xStakingContract

transaction(amount: UFix64, timeCommitted: UInt64) {
    let stakingRef: &StakingContract_V2.Staking
    let account: &Account

    prepare(signer: auth(Storage, Capabilities, FungibleToken.Withdraw) &Account) {
        // Borrow a reference with Withdraw entitlement from storage
        let flowVaultRef = signer.storage.borrow<auth(FungibleToken.Withdraw) &FlowToken.Vault>(
            from: /storage/flowTokenVault
        ) ?? panic("Could not borrow Flow token vault reference")

        let flowVault <- flowVaultRef.withdraw(amount: amount)

        let staking <- StakingContract_V2.createStaking(vault: <- flowVault)
        
        // Check if storage path exists and remove if it does
        if signer.storage.check<@StakingContract_V2.Staking>(from: /storage/StakingV2) {
            let oldStaking <- signer.storage.load<@StakingContract_V2.Staking>(from: /storage/StakingV2)
            destroy oldStaking
            signer.capabilities.unpublish(/public/StakingV2)
        }
        
        signer.storage.save(<- staking, to: /storage/StakingV2)
        signer.capabilities.publish(
            signer.capabilities.storage.issue<&StakingContract_V2.Staking>(/storage/StakingV2),
            at: /public/StakingV2
        )

        self.stakingRef = signer.capabilities.borrow<&StakingContract_V2.Staking>(/public/StakingV2)
            ?? panic("Could not borrow Staking reference")
        self.account = signer
    }

    execute {
        self.stakingRef.stake(address: self.account, amount: amount, timeCommitted: timeCommitted)
    }
}
`;

export default STAKE_CADENCE;
