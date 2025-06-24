pub contract StakingStats {

    pub struct DayStats {
        pub let date: String
        pub var totalStaked: UFix64
        pub var totalUnstaked: UFix64

        init(date: String) {
            self.date = date
            self.totalStaked = 0.0
            self.totalUnstaked = 0.0
        }
    }

    access(self) var statsByDay: {String: DayStats}

    init() {
        self.statsByDay = {}
    }

    pub fun updateStats(date: String, amount: UFix64, isStaking: Bool) {
        if self.statsByDay[date] == nil {
            self.statsByDay[date] = DayStats(date: date)
        }

        let stat = self.statsByDay[date]!
        if isStaking {
            stat.totalStaked = stat.totalStaked + amount
        } else {
            stat.totalUnstaked = stat.totalUnstaked + amount
        }
    }

    pub fun getStats(date: String): DayStats? {
        return self.statsByDay[date]
    }
}
