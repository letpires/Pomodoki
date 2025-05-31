import StakingContract from "../contracts/StakingContract.cdc"

transaction {
    prepare(signer: AuthAccount) {
        // Deploy the contract
        signer.contracts.add(
            name: "StakingContract",
            code: StakingContract.code
        )

        // Create and store the admin resource
        let admin <- StakingContract.createAdmin()
        signer.save(<- admin, to: /storage/StakingContractAdmin)
        
        // Create a public capability for the admin
        signer.link<&StakingContract.Admin>(
            /public/StakingContractAdmin,
            target: /storage/StakingContractAdmin
        )
    }
} 