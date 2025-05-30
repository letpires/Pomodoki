import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

pub contract StakingContract {
    // Store the deployer's address
    pub let deployer: Address

    init() {
        self.deployer = self.account.address
    }

    // Admin resource that controls the staking contract
    pub resource Admin {
        // Function to release staked tokens
        pub fun releaseStakedTokens(userAddress: Address, amount: UFix64) {
            let stakingRef = getAccount(userAddress).getCapability(/public/Staking)
                .borrow<&Staking>() ?? panic("Staking capability not found")
            
            stakingRef.releaseTokens(amount: amount)
        }
    }

    // Resource that represents a user's staking position
    pub resource Staking {
        pub var stakedAmount: UFix64
        pub var releasedAmount: UFix64
        pub let vault: @FungibleToken.Vault

        init(vault: @FungibleToken.Vault) {
            self.stakedAmount = 0.0
            self.releasedAmount = 0.0
            self.vault = vault
        }

        // Function to stake tokens
        pub fun stake(amount: UFix64) {
            let tempVault <- self.vault.withdraw(amount: amount)
            self.stakedAmount = self.stakedAmount + amount
            destroy tempVault
        }

        // Function to release tokens (can only be called by admin)
        pub fun releaseTokens(amount: UFix64) {
            assert(amount <= self.stakedAmount, message: "Cannot release more than staked amount")
            self.releasedAmount = self.releasedAmount + amount
            self.stakedAmount = self.stakedAmount - amount
        }

        // Function to redeem released tokens
        pub fun redeemReleasedTokens(): @FungibleToken.Vault {
            let amount = self.releasedAmount
            self.releasedAmount = 0.0
            
            let vaultRef = getAccount(self.account.address).getCapability(/public/flowTokenBalance)
                .borrow<&FlowToken.Vault>() ?? panic("Flow token vault not found")
            
            return <- vaultRef.withdraw(amount: amount)
        }

        destroy() {
            destroy self.vault
        }
    }

    // Function to create a new staking position
    pub fun createStaking(): @Staking {
        let vault = FlowToken.createEmptyVault()
        return <- create Staking(vault: vault)
    }

    // Function to create admin resource - only callable by deployer
    access(account) fun createAdmin(): @Admin {
        assert(self.account.address == self.deployer, message: "Only the deployer can create admin")
        return <- create Admin()
    }
} 