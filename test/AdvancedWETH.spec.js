const WETH = artifacts.require('WETH9');
const AdvancedWETH = artifacts.require('AdvancedWETH');
const TargetContract = artifacts.require('TargetContract');
const BN = require('bn.js');

contract('AdvancedWETH', ([account0, account1, account2]) => {
  let weth;
  let advancedWeth;
  let targetContract;

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

  function encodeTargetCallData(wethAddress, amount) {
    return web3.eth.abi.encodeFunctionCall({
      'inputs': [
        {
          'internalType': 'address payable',
          'name': 'weth',
          'type': 'address'
        },
        {
          'internalType': 'uint256',
          'name': 'amount',
          'type': 'uint256'
        }
      ],
      'name': 'targetCall',
      'type': 'function'
    }, [wethAddress, amount]);
  }

  async function expectError(fn, msg) {
    let threw = false;
    try {
      await (typeof fn === 'function' ? fn() : fn);
    } catch (error) {
      threw = true;
      expect(error.message).to.contain(msg);
    }
    expect(threw).to.eq(true);
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

  beforeEach('deploy TargetContract', async () => {
    targetContract = await TargetContract.new();
  });

  it('is deployed', () => {
    expect(weth.address).to.be.a('string');
    expect(advancedWeth.address).to.be.a('string');
  });

  it('points at weth', async () => {
    expect(await advancedWeth.weth()).to.eq(weth.address);
  });

  describe('#depositThenCall', () => {
    afterEach('advancedWeth has no balance', async () => {
      expect((await weth.balanceOf(advancedWeth.address)).toNumber()).to.eq(0);
      expect((await getBalance(advancedWeth.address)).toNumber()).to.eq(0);
    });

    it('can call target contract without any weth', async () => {
      await targetContract.update(0, 20);

      expect((await weth.balanceOf(account0)).toNumber()).to.eq(0);
      expect((await weth.balanceOf(targetContract.address)).toNumber()).to.eq(0);

      await recordBalanceBefore(account0);
      await advancedWeth.depositThenCall(targetContract.address, encodeTargetCallData(weth.address, 20), {
        value: 25,
        gasPrice: 0
      });

      // spends 25, gets back 5
      await checkBalanceDifference(account0, -20);
      expect((await weth.balanceOf(account0)).toNumber()).to.eq(0);
      expect((await weth.balanceOf(targetContract.address)).toNumber()).to.eq(20);
    });

    it('reverts on failure', async () => {
      await targetContract.update(0, 0);

      await recordBalanceBefore(account0);
      await expectError(advancedWeth.depositThenCall(targetContract.address, encodeTargetCallData(weth.address, 20), {
        value: 25,
        gasPrice: 0
      }), 'TO_CALL_FAILED');

      await checkBalanceDifference(account0, 0);
      expect((await weth.balanceOf(account0)).toNumber()).to.eq(0);
      expect((await weth.balanceOf(targetContract.address)).toNumber()).to.eq(0);
    });
  });

  describe('#depositAndTransferFromThenCall', () => {
    beforeEach('make some weth', async () => {
      await weth.deposit({ value: 100, from: account0 });
    });

    afterEach('advancedWeth has no balance', async () => {
      expect((await weth.balanceOf(advancedWeth.address)).toNumber()).to.eq(0);
      expect((await getBalance(advancedWeth.address)).toNumber()).to.eq(0);
    });

    it('can combine weth and eth to call target', async () => {
      await weth.approve(advancedWeth.address, 20, { from: account0 });
      await targetContract.update(0, 100); // allow receiving up to 100 weth

      expect((await weth.balanceOf(account0)).toNumber()).to.eq(100); // weth not spent
      expect((await weth.balanceOf(targetContract.address)).toNumber()).to.eq(0); // target contract empty

      await recordBalanceBefore(account0);
      await advancedWeth.depositAndTransferFromThenCall(20, targetContract.address, encodeTargetCallData(weth.address, 30), {
        value: 20,
        gasPrice: 0
      });

      // spends 20 eth, 20 weth, gets back 10 weth -> eth
      await checkBalanceDifference(account0, -10);
      expect((await weth.balanceOf(account0)).toNumber()).to.eq(80);
      expect((await weth.balanceOf(targetContract.address)).toNumber()).to.eq(30);
    });

    it('reverts on missing approval', async () => {
      await targetContract.update(0, 100); // allow receiving up to 100 weth

      await recordBalanceBefore(account0);
      await expectError(advancedWeth.depositAndTransferFromThenCall(20, targetContract.address, encodeTargetCallData(weth.address, 30), {
        value: 20,
        gasPrice: 0
      }), 'revert');
    });

    it('reverts on target contract failed receive', async () => {
      await weth.approve(advancedWeth.address, 20, { from: account0 });
      await targetContract.update(0, 0); // allow receiving up to 100 weth

      await expectError(advancedWeth.depositAndTransferFromThenCall(20, targetContract.address, encodeTargetCallData(weth.address, 30), {
        value: 20,
        gasPrice: 0
      }), 'TO_CALL_FAILED');
    });
  });

  describe('#approveAndCall', () => {
    beforeEach('make some weth', async () => {
      await weth.deposit({ value: 100, from: account0 });
    });

    afterEach('advancedWeth has no balance', async () => {
      expect((await weth.balanceOf(advancedWeth.address)).toNumber()).to.eq(0);
      expect((await getBalance(advancedWeth.address)).toNumber()).to.eq(0);
    });

    it('fails if weth not approved', async () => {
      await targetContract.update(0, 100);
      await expectError(advancedWeth.approveAndCall(1, targetContract.address, encodeTargetCallData(weth.address, 1)), 'revert');
    });

    it('fails if target contract reverts', async () => {
      await targetContract.update(0, 0);
      await expectError(advancedWeth.approveAndCall(1, targetContract.address, encodeTargetCallData(weth.address, 1)), 'revert');
    });

    it('succeeds when weth approved', async () => {
      await weth.approve(advancedWeth.address, 100, { from: account0 });
      await targetContract.update(0, 1);
      await advancedWeth.approveAndCall(1, targetContract.address, encodeTargetCallData(weth.address, 1));
    });

    it('transfers the called amount weth and refunds remainder as eth', async () => {
      await weth.approve(advancedWeth.address, 100, { from: account0 });
      await targetContract.update(0, 50);
      await recordBalanceBefore(account0);
      await advancedWeth.approveAndCall(25, targetContract.address, encodeTargetCallData(weth.address, 20), { gasPrice: 0 });
      await checkBalanceDifference(account0, 5); // 5 refunded as eth of the 25 approved/transferred
      expect((await weth.balanceOf(account0)).toNumber()).to.eq(75); // whole approved amount transferred
      expect((await weth.balanceOf(targetContract.address)).toNumber()).to.eq(20); // target call took 20 of the 25
    });
  });

  describe('#receive', () => {
    it('reject if not from weth', async () => {
      await expectError(sendETH(advancedWeth.address, 1, account0), 'WETH_ONLY');
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
    });

    it('fails if to address does not receive eth', async () => {
      await weth.transfer(advancedWeth.address, 25, { from: account0 });
      await expectError(advancedWeth.withdrawTo(targetContract.address, { from: account0 }), 'WITHDRAW_TO_CALL_FAILED');
    });

    it('succeeds for contract call that receives eth', async () => {
      await weth.transfer(advancedWeth.address, 25, { from: account0 });
      await targetContract.update(25, 0);
      await recordBalanceBefore(targetContract.address);
      await advancedWeth.withdrawTo(targetContract.address, { from: account0 });
      await checkBalanceDifference(targetContract.address, 25);
    });
  });
});