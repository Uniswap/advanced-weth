# advanced-weth

A smart contract that adds functionality to the
[Wrapped Ether](https://github.com/gnosis/canonical-weth) 
smart contract which allows users to interact with other smart
contracts that consume WETH transparently as if they are using ETH directly.

Requires a single approval from the user for the AdvancedWETH contract
to spend any amount of their WETH, and thus benefits from widespread use of a
canonical advanced WETH contract. Because this approval never runs out or expires,
this is a once-per-account requirement to permanently enhance the capabilities of WETH.

The benefit of removing special handling of ETH from your contract is that
you can reduce your interface size significantly, i.e. you can pretend that ETH
already implements the ERC20 interface and consume ETH via the `AdvancedWETH` contract.

## Methods documentation

All methods are documented inline in the 
[contract interface](contracts/interfaces/IAdvancedWETH.sol).

## Deploying a test version

For unit tests, you can depend on the `advanced-weth` npm package 
for access to the contract interface and the build artifacts.

```shell script
npm install --save advanced-weth
```

You can browse the build artifacts included in the npm package
via [unpkg.com/advanced-weth@1.0.0/](https://unpkg.com/browse/advanced-weth@1.0.0/).

Use the bytecode stored in the import path
`advanced-weth/build/contracts/AdvancedWETH.json`
file to deploy the contract for unit tests.

Note only the interface solidity code is shared in the npm package.
This is because to deploy the contract on a testnet, you should use
the build artifact to get an exact copy of the AdvancedWETH contract
regardless of local solc compiler settings.

The constructor has a single argument, the WETH contract address.

## Deploy addresses

The build artifacts in the npm package contain the deployment addresses for programmatic consumption.

The AdvancedWETH contract is deployed and verified to the address `0x27E90122950c9E4E669edcC90Fac6c105770420b` 
on the networks:

- mainnet: https://etherscan.io/address/0x27E90122950c9E4E669edcC90Fac6c105770420b
- ropsten: https://ropsten.etherscan.io/address/0x27E90122950c9E4E669edcC90Fac6c105770420b
- rinkeby: https://rinkeby.etherscan.io/address/0x27E90122950c9E4E669edcC90Fac6c105770420b
- kovan: https://kovan.etherscan.io/address/0x27E90122950c9E4E669edcC90Fac6c105770420b
- goerli: https://goerli.etherscan.io/address/0x27E90122950c9E4E669edcC90Fac6c105770420b

## Disclaimer

This contract has not been audited, nor formally verified. Use at your own risk.