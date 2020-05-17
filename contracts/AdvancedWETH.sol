pragma solidity =0.6.7;

import "./interfaces/IWETH9.sol";
import "./interfaces/IAdvancedWETH.sol";

// See interface for documentation.
contract AdvancedWETH is IAdvancedWETH {
    address payable public override immutable weth;

    constructor(address payable weth_) public {
        weth = weth_;
    }

    // See interface for documentation.
    function depositAndTransferFromThenCall(uint amount, address to, bytes calldata data) external override payable {
        if (msg.value > 0) {
            IWETH9(weth).deposit{value: msg.value}();
        }
        if (amount > 0) {
            IWETH9(weth).transferFrom(msg.sender, address(this), amount);
        }
        uint total = msg.value + amount;
        require(total >= msg.value, 'OVERFLOW'); // nobody should be this rich.
        require(total > 0, 'ZERO_INPUTS');
        IWETH9(weth).approve(to, total);
        (bool success,) = to.call(data);
        require(success, 'TO_CALL_FAILED');
        // unwrap and refund any unspent WETH.
        withdrawTo(msg.sender);
    }

    // Only the WETH contract may send ETH via a call to withdraw.
    receive() payable external { require(msg.sender == weth, 'WETH_ONLY'); }

    // See interface for documentation.
    function withdrawTo(address payable to) public override {
        uint wethBalance = IWETH9(weth).balanceOf(address(this));
        if (wethBalance > 0) {
            IWETH9(weth).withdraw(wethBalance);
            (bool success,) = to.call{value: wethBalance}('');
            require(success, 'WITHDRAW_TO_CALL_FAILED');
        }
    }
}
