import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

access(all) contract StakingContract {
    // Store the deployer's address
    access(all) let deployer: Address

    init() {
        self.deployer = self.account.address
    }

    // Admin resource that controls the staking contract
    access(all) resource Admin {
        // Function to release staked tokens
        access(all) fun releaseStakedTokens(userAddress: Address, amount: UFix64) {
            let stakingRef = getAccount(userAddress)
                .capabilities.get<&Staking>(/public/Staking)
                .borrow() ?? panic("Could not borrow Staking reference at path /public/Staking! Make sure that the account address is correct and that it has properly set up its account with a Staking resource.")
            
            stakingRef.releaseTokens(amount: amount)
        }
    }

    // Resource that represents a user's staking position
    access(all) resource Staking {
        access(all) var stakedAmount: UFix64
        access(all) var releasedAmount: UFix64
        access(all) let vault: @{FungibleToken.Vault}
        access(all) let ownerAddress: Address

        init(vault: @{FungibleToken.Vault}, ownerAddress: Address) {
            self.stakedAmount = 0.0
            self.releasedAmount = 0.0
            self.vault <- vault
            self.ownerAddress = ownerAddress
        }

        // Function to stake tokens
        access(all) fun stake(amount: UFix64) {
            let tempVault <- self.vault.withdraw(amount: amount)
            self.stakedAmount = self.stakedAmount + amount
            destroy tempVault
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
            return <- self.vault.withdraw(amount: remainingAmount)
        }
    }

    // Function to create a new staking position
    access(all) fun createStaking(vault: @{FungibleToken.Vault}): @Staking {
        return <- create Staking(vault: <- vault, ownerAddress: self.account.address)
    }

    // Function to create admin resource - only callable by deployer
    access(account) fun createAdmin(): @Admin {
        assert(self.account.address == self.deployer, message: "Only the deployer can create admin")
        return <- create Admin()
    }
} 