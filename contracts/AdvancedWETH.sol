pragma solidity =0.6.7;

import "./interfaces/IWETH9.sol";
import "./interfaces/IAdvancedWETH.sol";

contract AdvancedWETH is IAdvancedWETH {
    address payable public override immutable weth;

    // create the wrapped WETH contract
    constructor(address payable weth_) public {
        weth = weth_;
    }

    // internal impl of both deposit methods
    function _depositAndTransferFromThenCall(uint amount, address to, bytes memory data) internal {
        if (msg.value > 0) {
            IWETH9(weth).deposit{value: msg.value}();
        }
        if (amount > 0) {
            IWETH9(weth).transferFrom(msg.sender, address(this), amount);
        }
        IWETH9(weth).approve(to, amount + msg.value);
        (bool success,) = to.call(data);
        require(success, 'TO_CALL_FAILED');
        // refund any remaining WETH to the caller
        withdrawTo(msg.sender);
    }

    // see interface for documentation
    function depositThenCall(address to, bytes calldata data) external override payable {
        _depositAndTransferFromThenCall(0, to, data);
    }

    // see interface for documentation
    function depositAndTransferFromThenCall(uint amount, address to, bytes calldata data) external override payable {
        _depositAndTransferFromThenCall(amount, to, data);
    }

    // see interface for documentation
    function approveAndCall(uint amount, address to, bytes calldata data) external override {
        IWETH9(weth).transferFrom(msg.sender, address(this), amount);
        IWETH9(weth).approve(to, amount);
        (bool success,) = to.call(data);
        require(success, 'TO_CALL_FAILED');
        withdrawTo(msg.sender);
    }

    // see interface for documentation
    function withdrawTo(address payable to) public override {
        uint balance = IWETH9(weth).balanceOf(address(this));
        if (balance > 0) {
            IWETH9(weth).withdraw(balance);
            (bool success,) = to.call{value: balance}('');
            require(success, 'WITHDRAW_TO_CALL_FAILED');
        }
    }
}
