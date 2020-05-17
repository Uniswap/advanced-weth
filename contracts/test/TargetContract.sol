pragma solidity >=0.6.0;

import "../interfaces/IWETH9.sol";

// SPDX-License-Identifier: GPL-3.0-or-later
contract TargetContract {
    uint private acceptETH;
    uint private acceptWETH;

    function update(uint acceptETH_, uint acceptWETH_) external {
        acceptETH = acceptETH_;
        acceptWETH = acceptWETH_;
    }

    // just takes the weth from the caller
    function targetCall(address payable weth, uint amount) external {
        require(amount <= acceptWETH, 'ACCEPT_WETH_LIMIT');
        IWETH9(weth).transferFrom(msg.sender, address(this), amount);
    }

    // receives the eth
    receive() payable external {
        require(msg.value <= acceptETH, 'ACCEPT_ETH_LIMIT');
    }
}
