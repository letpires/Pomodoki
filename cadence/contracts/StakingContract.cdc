import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken

access(all) contract StakingContract4 {  
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
 
        access(all) fun stake(amount: UFix64, timeCommitted: UFix64) {
            self.flowVault.deposit(from: <- self.vault.withdraw(amount: amount))
            self.stakedAmount = amount  
            if self.historyStats[self.address] == nil {
                self.historyStats[self.address] = []
            }
            self.historyStats[self.address]!.append(HistoryStats(totalStaked: amount, timeCommitted: timeCommitted))
        } 
 
        access(all) fun cleanup(): @{FungibleToken.Vault} {
            let remainingAmount = self.stakedAmount
            self.stakedAmount = 0.0  
            let historyStats = self.historyStats[self.address]
            if historyStats !== nil {
                if historyStats!.length > 0 {
                    historyStats![historyStats!.length - 1].end()
                }
            }

            return <- self.flowVault.withdraw(amount: remainingAmount)
        } 
    }     

    access(all) struct HistoryStats {
        access(self) let startDate: UFix64
        access(self) let endDate: UFix64
        access(self) var totalStaked: UFix64
        access(self) var totalUnstaked: UFix64
        access(self) var timeCommitted: UFix64

        init(totalStaked: UFix64, timeCommitted: UFix64) {
            self.startDate = getCurrentBlock().timestamp
            self.totalStaked = totalStaked 
            self.timeCommitted = timeCommitted
        } 

        access(all) fun end() {
            self.endDate = getCurrentBlock().timestamp
            self.totalUnstaked = self.totalStaked
        }
    }

    init() {
        self.statsByDay = {}
    }
 
    access(all) fun createStaking(vault: @{FungibleToken.Vault}): @Staking {
        return <- create Staking(vault: <- vault)
    }  

    access(all) fun getStats(address: Address): [HistoryStats]? {
        return self.historyStats[address]
    }
} 