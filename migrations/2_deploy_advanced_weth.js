const AdvancedWETH = artifacts.require('AdvancedWETH');
const { networks: WETHNetworks } = require('canonical-weth/build/contracts/WETH9.json');

const NetworkKeys = {
  'mainnet': '1',
  'ropsten': '3',
  'rinkeby': '4',
  'kovan': '42'
};

module.exports = function (deployer, network) {
  if (network in NetworkKeys) {
    deployer.deploy(AdvancedWETH, WETHNetworks[ NetworkKeys[ network ] ].address);
  }
};
