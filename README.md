<div align="center">
  <h1 align="center">
    <img src="https://raw.githubusercontent.com/letpires/Pomodoki/main/public/images/avatar.png" width="200" />
  </h1> 
  <h3>◦ Stay focused, earn rewards. Meet your productivity pet with Pomodoki.</h3>
</div>

## 📖 Table of Contents

- [📍 Overview](#-overview)
- [🛣 Roadmap](#-roadmap) 
- [🎯 Contract Deployment](#-contract-deployment)
- [🙏 Acknowledgments](#acknowledgments)

---

## 📍 Overview

**Pomodoki** is a **Chrome extension** that gamifies productivity by combining the **Pomodoro technique** with **Flow blockchain staking** and a **Tamagotchi-style pet**. Users focus in timed intervals, stake FLOW tokens, and interact with an animated pet that responds to their performance.

### 🧩 Core Features

- Pomodoro timer (25/5, 50/10, or custom)
- FLOW token staking via smart contracts
- Tab-switch & distraction site monitoring
- Animated pet that reacts to your success or failure 
- Token rewards for completing sessions

If the user visits any blacklisted sites (e.g., YouTube, Instagram), the session fails and the staked tokens are lost to a community pool.

---

## 🛣 Roadmap

> - [x] `✅ Pomodoro timer`
> - [x] `✅ Chrome extension with onboarding`
> - [x] `✅ FLOW staking & reward mechanism`
> - [x] `✅ Pet avatars with emotion states`
> - [x] `✅ Tab and inactivity detection`
> - [ ] `🔜 Instead of burning your stake, we buy Bitcoin and lock it — for your own good. 💸🔒`
> - [ ] `🔜 Pet evolution system`
> - [ ] `🔜 NFT avatar integration`
> - [ ] `🔜 Group Pomodoro & social challenges`
> - [ ] `🔜 Physical Tamagotchi-style device synced with your focus account`
> - [ ] `🔜 Token utility: rewards, marketplace`
---

## 🎯 Contract Deployment
Pomodoki uses smart contracts written in Cadence on the Flow blockchain to manage staking logic and session validation.

## 🛠 What the contract does
Users stake FLOW tokens before a Pomodoro session.

If the session is completed successfully, the user receives their stake back along with a reward.

If the session fails (due to tab-switching, inactivity, or visiting a blocked site), the stake is lost to a community pool.

## 🚀 Deploying the contract with Flow CLI
Prerequisites:

Install the Flow CLI

Set up a Flow account and add it to your CLI

```bash
# Deploy the smart contract to Flow testnet
flow project deploy cadence/contracts/StakingContract.cdc --network testnet
```

## 🙏 Acknowledgments
Built during a hackathon to make focus fun and rewarding.

Inspired by productivity techniques like the Pomodoro method and the nostalgia of Tamagotchi pets.
 
