import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868
import StakingContract3 from 0x01

transaction(amount: UFix64) {
    let stakingRef: &StakingContract3.Staking
    let flowVault: @FungibleToken.Vault

    prepare(signer: auth(Storage, Capabilities) &Account) {
        // Get the Flow token vault
        let flowVaultRef = signer.capabilities.borrow<&FlowToken.Vault>(/public/flowTokenBalance)
            ?? panic("Could not borrow Flow token vault reference")

        // Create a temporary vault to hold the amount to stake
        self.flowVault <- flowVaultRef.withdraw(amount: amount)

        // Create the staking position
        let staking <- StakingContract3.createStaking(vault: <- self.flowVault)
        
        // Save the staking resource to the account
        signer.storage.save(<- staking, to: /storage/Staking)

        // Create a public capability for the staking resource
        signer.capabilities.link<&StakingContract3.Staking>(/public/Staking, target: /storage/Staking)

        // Get a reference to the staking resource
        self.stakingRef = signer.capabilities.borrow<&StakingContract3.Staking>(/public/Staking)
            ?? panic("Could not borrow Staking reference")
    }

    execute {
        // Stake the tokens
        self.stakingRef.stake(amount: amount)
    }
} 