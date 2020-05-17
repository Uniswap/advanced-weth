# advanced-weth

A smart contract that adds functionality to the
[Wrapped Ether](https://github.com/gnosis/canonical-weth) 
smart contract which allows users to interact with other smart
contracts that consume WETH transparently as if they are using WETH.

Requires a single approval from the user for the AdvancedWETH contract
to spend any amount of their WETH, and thus benefits from widespread use of a
canonical advanced WETH contract.

## Methods documentation

All methods are documented inline in the 
[contract interface](contracts/interfaces/IAdvancedWETH.sol).

## Deploying a test version

For unit tests, you can depend on the `advanced-weth` npm package 
for access to the contract interface and the build artifacts.
Use the bytecode stored in the `build/contracts/AdvancedWETH.json`
file to deploy the contract.

Note only the interface solidity code is shared in the NPM package.
This is because to deploy the contract on a testnet, you should use
the build artifact to get an exact copy of the AdvancedWETH contract
regardless of local solc compiler settings. 

## Deploy addresses

The network addresses are contained in the build artifact for
programmatic consumption.
The AdvancedWETH contract is deployed and verified to the address 
`0x` on the networks:

- mainnet: https://etherscan.io/address/0x
- ropsten: https://ropsten.etherscan.io/address/0x
- rinkeby: https://rinkeby.etherscan.io/address/0x
- goerli: https://goerli.etherscan.io/address/0x
- kovan: https://kovan.etherscan.io/address/0x