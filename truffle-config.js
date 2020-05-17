const HDWalletProvider = require('@truffle/hdwallet-provider');

const fs = require('fs');
const { mnemonic, infuraKey, etherscanApiKey } = JSON.parse(fs.readFileSync('.secrets.json', 'utf-8'));

module.exports = {
  networks: {
    mainnet: {
      provider: () => new HDWalletProvider(mnemonic, `https://mainnet.infura.io/v3/${infuraKey}`),
      network_id: 1,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    },
    ropsten: {
      provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/${infuraKey}`),
      network_id: 3,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 20,
      gasPrice: 1,
      skipDryRun: true
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 20,
      gasPrice: 1,
      skipDryRun: true
    },
    kovan: {
      provider: () => new HDWalletProvider(mnemonic, `https://kovan.infura.io/v3/${infuraKey}`),
      network_id: 42,
      gas: 2000000,
      confirmations: 2,
      timeoutBlocks: 20,
      gasPrice: 1,
      skipDryRun: true
    }
  },

  compilers: {
    solc: {
      version: '0.6.8',
      settings: {
        optimizer: {
          enabled: true,
          runs: 999999
        },
        evmVersion: 'istanbul'
      }
    }
  },

  plugins: [
    'truffle-plugin-verify'
  ],

  api_keys: {
    etherscan: etherscanApiKey
  }
};
