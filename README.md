# advanced-weth

A smart contract that adds functionality to the
[Wrapped Ether](https://github.com/gnosis/canonical-weth) 
smart contract which allows users to interact with other smart
contracts that consume WETH transparently as if they are using ETH directly.

Requires a single approval from the user for the AdvancedWETH contract
to spend any amount of their WETH, and thus benefits from widespread use of a
canonical advanced WETH contract. Because this approval never runs out or expires,
this is a once-per-account requirement.

The benefit of removing special handling of ETH from your contract is that
you can reduce your interface size significantly.

## Methods documentation

All methods are documented inline in the 
[contract interface](contracts/interfaces/IAdvancedWETH.sol).

## Deploying a test version

For unit tests, you can depend on the `advanced-weth` npm package 
for access to the contract interface and the build artifacts.

```shell script
npm install --save advanced-weth
```

Use the bytecode stored in the import path
`advanced-weth/build/contracts/AdvancedWETH.json`
file to deploy the contract for unit tests.

Note only the interface solidity code is shared in the npm package.
This is because to deploy the contract on a testnet, you should use
the build artifact to get an exact copy of the AdvancedWETH contract
regardless of local solc compiler settings.

The constructor has a single argument, the WETH contract address.

## Deploy addresses

The network addresses are contained in the build artifact for
programmatic consumption.
The AdvancedWETH contract is deployed and verified to the address 
`0x` on the networks:

- mainnet: https://etherscan.io/address/0x
- ropsten: https://ropsten.etherscan.io/address/0x
- rinkeby: https://rinkeby.etherscan.io/address/0x
- kovan: https://kovan.etherscan.io/address/0x

It is not deployed to Goerli because WETH is not deployed to Goerli.