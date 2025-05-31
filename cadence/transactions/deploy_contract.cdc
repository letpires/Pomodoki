import StakingContract from "../contracts/StakingContract.cdc"

transaction {
    prepare(signer: auth(Contracts, Storage, Capabilities) &Account) {
        // Deploy the contract
        signer.contracts.add(
            name: "StakingContract",
            code: StakingContract.code
        )

        // Create and store the admin resource
        let admin <- StakingContract.createAdmin()
        signer.storage.save(<- admin, to: /storage/StakingContractAdmin)
        
        // Create a public capability for the admin
        let adminCap = signer.capabilities.storage.issue<&{StakingContract.Admin}>(/storage/StakingContractAdmin)
        signer.capabilities.publish(adminCap, at: /public/StakingContractAdmin)
    }
} 