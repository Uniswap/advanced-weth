const WETH = artifacts.require('WETH9');
const AdvancedWETH = artifacts.require('AdvancedWETH');
const BN = require('bn.js');

contract('AdvancedWETH', ([account0, account1, account2, account3]) => {
  let weth;
  let advancedWeth;

  let balancesBefore;

  async function getBalance(address) {
    return new BN((await web3.eth.getBalance(address)).toString());
  }

  async function recordBalanceBefore(address) {
    balancesBefore[ address ] = await getBalance(address);
  }

  async function checkBalanceDifference(address, diff) {
    const after = await getBalance(address);
    expect(after.sub(balancesBefore[ address ]).toString()).to.eq(diff.toString());
  }

  function sendETH(to, amount, from) {
    return web3.eth.sendTransaction({ to, value: amount, from });
  }

  beforeEach('reset balancesBefore', () => {
    balancesBefore = {};
  });

  beforeEach('deploy WETH', async () => {
    weth = await WETH.new();
  });

  beforeEach('deploy AdvancedWETH', async () => {
    advancedWeth = await AdvancedWETH.new(weth.address);
  });

  it('is deployed', () => {
    expect(weth.address).to.be.a('string');
    expect(advancedWeth.address).to.be.a('string');
  });

  it('points at weth', async () => {
    expect(await advancedWeth.weth()).to.eq(weth.address);
  });

  describe('#receive', () => {
    it('can only receive from weth', async () => {
      let threw = false;
      try {
        await sendETH(advancedWeth.address, 1, account0);
      } catch (error) {
        threw = true;
        expect(error.message).to.contain('WETH_ONLY');
      }
      expect(threw).to.eq(true);
    });
  });

  describe('#withdrawTo', () => {
    beforeEach('make some weth', async () => {
      await weth.deposit({ value: 100, from: account0 });
    });

    it('no-op if empty', async () => {
      await advancedWeth.withdrawTo(account1, { from: account0 });
      expect((await weth.balanceOf(account0)).toNumber()).to.eq(100);
      expect((await weth.balanceOf(account1)).toNumber()).to.eq(0);
    });

    it('forwards balance as eth', async () => {
      await weth.transfer(advancedWeth.address, 25, { from: account0 });
      expect((await weth.balanceOf(account0)).toNumber()).to.eq(75);
      expect((await weth.balanceOf(advancedWeth.address)).toNumber()).to.eq(25);

      await recordBalanceBefore(account2);
      await advancedWeth.withdrawTo(account2, { from: account1 }); // diff account than depositor
      expect((await weth.balanceOf(advancedWeth.address)).toNumber()).to.eq(0);
      expect((await weth.balanceOf(account2)).toNumber()).to.eq(0); // no weth on the target account
      await checkBalanceDifference(account2, 25);
    });

    // ends up depositing right back into advanced weth
    it('withdrawTo WETH is no-op', async () => {
      await weth.transfer(advancedWeth.address, 25, { from: account0 });
      await advancedWeth.withdrawTo(weth.address, { from: account0 });
      expect((await weth.balanceOf(advancedWeth.address)).toNumber()).to.eq(25);
    })
  });
});