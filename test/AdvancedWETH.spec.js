const WETH = artifacts.require('WETH9');
const AdvancedWETH = artifacts.require('AdvancedWETH');

contract('AdvancedWETH', ([account0, account1, account2, account3]) => {
  let weth;
  let advancedWeth;

  before('deploy WETH', async () => {
    weth = await WETH.new();
  });

  before('deploy AdvancedWETH', async () => {
    advancedWeth = await AdvancedWETH.new(weth.address);
  });

  it('is deployed', () => {
    expect(weth.address).to.be.a('string');
    expect(advancedWeth.address).to.be.a('string');
  });

  it('points at weth', async () => {
    expect(await advancedWeth.weth()).to.eq(weth.address);
  });
});