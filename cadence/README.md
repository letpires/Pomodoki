# Flow Staking Contract

This repository contains a Flow blockchain smart contract for staking FLOW tokens with admin-controlled release functionality.

## Prerequisites

1. Install the Flow CLI: https://docs.onflow.org/flow-cli/install/
2. Create a Flow testnet account: https://docs.onflow.org/flow-cli/create-accounts/

## Deployment Steps

1. Update the `flow.json` file with your testnet account details:
   - Replace `YOUR_TESTNET_ACCOUNT_ADDRESS` with your testnet account address
   - Replace `YOUR_TESTNET_PRIVATE_KEY` with your testnet private key

2. Deploy the contract to testnet:
```bash
flow project deploy --network testnet
```

3. After deployment, you can interact with the contract using the Flow CLI or through your application.

## Contract Features

- Users can stake FLOW tokens
- Only the admin (deployer) can release staked tokens
- Users can redeem their released tokens
- Admin resource is only creatable by the contract deployer

## Contract Structure

- `StakingContract.cdc`: Main contract file
- `deploy-testnet.cdc`: Deployment script
- `flow.json`: Flow CLI configuration

## Security Notes

- The admin resource is stored in the deployer's account storage
- Only the deployer can create the admin resource
- The admin resource has a public capability for interaction