const WrappedWETH = artifacts.require('WrappedWETH');
const WETH = artifacts.require('WETH9')
const { networks: WETHNetworks } = require('canonical-weth/build/contracts/WETH9.json');

const NetworkKeys = {
  'mainnet': '1',
  'ropsten': '3',
  'rinkeby': '4',
  'kovan': '42'
};

module.exports = function (deployer, network) {
  if (network in NetworkKeys) {
    deployer.deploy(WrappedWETH, NetworkKeys[network]);
  }
};
