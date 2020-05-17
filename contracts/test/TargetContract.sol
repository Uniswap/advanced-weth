pragma solidity >=0.6.0;

contract TargetContract {
    uint private acceptETH;
    uint private acceptWETH;

    // just takes the weth from the caller
    function targetCall(address weth, uint amount) external {
        require(amount <= acceptWETH, 'ACCEPT_WETH_LIMIT');
        IWETH(weth).transferFrom(msg.sender, amount);
    }

    // receives the eth
    receive() payable external {
        require(msg.value <= acceptETH, 'ACCEPT_ETH_LIMIT')
    }
}
