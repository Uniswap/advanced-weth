const HDWalletProvider = require('@truffle/hdwallet-provider');

const fs = require('fs');
const { mnemonic, infuraKey } = JSON.parse(fs.readFileSync('.secrets.json', 'utf-8'));
const provider = () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraKey}`);

module.exports = {
  networks: {
    mainnet: {
      provider,
      network_id: 1,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 200
    },
    ropsten: {
      provider,
      network_id: 3,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 20
    },
    rinkeby: {
      provider,
      network_id: 4,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 20
    },
    kovan: {
      provider,
      network_id: 42,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 20
    }
  },

  compilers: {
    solc: {
      version: '0.6.7',    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 999999
        },
        evmVersion: 'istanbul'
      }
    }
  }
};
