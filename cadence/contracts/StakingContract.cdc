import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

access(all) contract StakingContract4 {  
    // Resource that represents a user's staking position
    access(all) resource Staking {
        access(all) var stakedAmount: UFix64
        access(all) var releasedAmount: UFix64
        access(all) let vault: @{FungibleToken.Vault}
        access(all) let flowVault: @{FungibleToken.Vault} 

        init(vault: @{FungibleToken.Vault}) {
            self.stakedAmount = 0.0
            self.releasedAmount = 0.0
            self.vault <- vault 
            self.flowVault <- FlowToken.createEmptyVault(vaultType: Type<@FlowToken.Vault>())
        }

        // Function to stake tokens
        access(all) fun stake(amount: UFix64) {
            self.flowVault.deposit(from: <- self.vault.withdraw(amount: amount))
            self.stakedAmount = amount 
        }

        // Function to release tokens (can only be called by admin)
        access(all) fun releaseTokens(amount: UFix64) {
            assert(amount <= self.stakedAmount, message: "Cannot release more than staked amount")
            self.releasedAmount = self.releasedAmount + amount
            self.stakedAmount = self.stakedAmount - amount
        } 

        // Function to cleanup and withdraw remaining tokens
        access(all) fun cleanup(): @{FungibleToken.Vault} {
            let remainingAmount = self.stakedAmount
            self.stakedAmount = 0.0
            return <- self.flowVault.withdraw(amount: remainingAmount)
        }
    }

    // Function to create a new staking position
    access(all) fun createStaking(vault: @{FungibleToken.Vault}): @Staking {
        return <- create Staking(vault: <- vault)
    } 
} 