const REDEEM_CADENCE = `
import FungibleToken from 0xFungibleToken
import FlowToken from 0xFlowToken
import StakingContract4 from 0xStakingContract

    transaction {
        prepare(signer: auth(Storage, Capabilities) &Account) {
            // Get the staking resource
            let staking <- signer.storage.load<@StakingContract4.Staking>(from: /storage/Staking)
                ?? panic("No staking resource found")

            // Get the vault from staking
            let vault <- staking.cleanup()
            
            // Get the receiver capability
            let receiver = signer.capabilities.borrow<&{FungibleToken.Receiver}>(/public/flowTokenReceiver)
                ?? panic("Could not borrow Flow token receiver")

            // Deposit the tokens back to the user's vault
            receiver.deposit(from: <- vault)

            // Clean up the staking resource
            destroy staking
            signer.capabilities.unpublish(/public/Staking)
        }
    }
`;

export default REDEEM_CADENCE;