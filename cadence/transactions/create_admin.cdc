import StakingContract from 0xacdf784e6e2a83f0

transaction {
    prepare(signer: auth(Contracts, Storage, Capabilities) &Account) {
        // Create and store the admin resource
        let admin <- StakingContract.createAdmin()
        signer.storage.save(<- admin, to: /storage/StakingContractAdmin)
        
        // Create a public capability for the admin
        let adminCap = signer.capabilities.storage.issue<&{StakingContract.Admin}>(/storage/StakingContractAdmin)
        signer.capabilities.publish(adminCap, at: /public/StakingContractAdmin)
    }
} 