import StakingContract4 from 0xStakingContract

access(all) fun main(address: Address): [StakingContract4.HistoryStats]? { 
    return StakingContract4.getStats(address: address)
}  