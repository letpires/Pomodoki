import FungibleToken from 0x9a0766d93b6608b7
import FlowToken from 0x7e60df042a9c0868

access(all) contract StakingStats {

    access(all) struct DayStats {
        access(all) let date: String
        access(self) var totalStaked: UFix64
        access(self) var totalUnstaked: UFix64

        init(date: String) {
            self.date = date
            self.totalStaked = 0.0
            self.totalUnstaked = 0.0
        }

        access(all) fun addStaked(amount: UFix64) {
            self.totalStaked = self.totalStaked + amount
        }

        access(all) fun addUnstaked(amount: UFix64) {
            self.totalUnstaked = self.totalUnstaked + amount
        }
    }

    access(self) var statsByDay: {String: DayStats}

    init() {
        self.statsByDay = {}
    }

    access(all) fun updateStats(date: String, amount: UFix64, isStaking: Bool) {
        if self.statsByDay[date] == nil {
            self.statsByDay[date] = DayStats(date: date)
        }

        let stat: StakingStats.DayStats = self.statsByDay[date]!
        if isStaking {
            stat.addStaked(amount: amount)
        } else {
            stat.addUnstaked(amount: amount)
        }
    }

    access(all) fun getStats(date: String): DayStats? {
        return self.statsByDay[date]
    }
}
