import StakingContract_V2 from 0xStakingContract

access(all) fun main(address: Address): [StakingContract_V2.HistoryStats]? { 
    return StakingContract_V2.getStats(address: address)
}  