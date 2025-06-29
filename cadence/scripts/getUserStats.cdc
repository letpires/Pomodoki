import StakingContract_V1 from 0xStakingContract

access(all) fun main(address: Address): [StakingContract_V1.HistoryStats]? { 
    return StakingContract_V1.getStats(address: address)
}  