import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

access(all) contract StakingContract_V1 {  
    access(self) var historyStats: {Address: [HistoryStats]}
 
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
 
        access(all) fun stake(address: &Account, amount: UFix64, timeCommitted: UFix64) {
            self.flowVault.deposit(from: <- self.vault.withdraw(amount: amount))
            self.stakedAmount = amount   
            if StakingContract_V1.historyStats[address.address] == nil {
                StakingContract_V1.historyStats[address.address] = []
            }
            StakingContract_V1.historyStats[address.address]!.append(HistoryStats(totalStaked: amount, timeCommitted: timeCommitted))
        } 
 
        access(all) fun cleanup(address: &Account): @{FungibleToken.Vault} {
            let remainingAmount: UFix64 = self.stakedAmount
            self.stakedAmount = 0.0  
            let historyStats: [HistoryStats]? = StakingContract_V1.historyStats[address.address]
            if historyStats != nil {
                if historyStats!.length > 0 {
                    historyStats![historyStats!.length - 1].end()
                }
            }

            return <- self.flowVault.withdraw(amount: remainingAmount)
        } 
    }     

    access(all) struct HistoryStats {
        access(self) let startDate: UFix64
        access(self) var endDate: UFix64
        access(self) let totalStaked: UFix64
        access(self) var totalUnstaked: UFix64
        access(self) let timeCommitted: UFix64

        init(totalStaked: UFix64, timeCommitted: UFix64) {
            self.startDate = getCurrentBlock().timestamp
            self.totalStaked = totalStaked 
            self.timeCommitted = timeCommitted
            self.endDate = 0.0
            self.totalUnstaked = 0.0
        } 

        access(all) fun end() {
            self.endDate = getCurrentBlock().timestamp
            self.totalUnstaked = self.totalStaked
        }
    }

    init() {
        self.historyStats = {}
    }
 
    access(all) fun createStaking(vault: @{FungibleToken.Vault}): @Staking {
        return <- create Staking(vault: <- vault)
    }  

    access(all) fun getStats(address: Address): [HistoryStats]? {
        return self.historyStats[address]
    }
} 