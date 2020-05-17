const AdvancedWETH = artifacts.require('AdvancedWETH');
const { networks: WETHNetworks } = require('canonical-weth/build/contracts/WETH9.json');

const NetworkKeys = {
  'mainnet': '1',
  'ropsten': '3',
  'rinkeby': '4',
  'goerli': '5',
  'kovan': '42'
};

module.exports = function (deployer, network) {
  if (network in NetworkKeys) {
    const wethDeployment = WETHNetworks[ NetworkKeys[ network ] ];
    if (wethDeployment) {
      deployer.deploy(AdvancedWETH, WETHNetworks[ NetworkKeys[ network ] ].address);
    } else if (network === 'goerli') {
      deployer.deploy(AdvancedWETH, '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6');
    } else {
      throw new Error('No WETH on this network')
    }
  }
};
