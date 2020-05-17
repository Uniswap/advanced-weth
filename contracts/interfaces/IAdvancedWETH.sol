pragma solidity >=0.4.0;

// advanced WETH contract. to use, first approve the contract to spend all your WETH.
// unlocks additional features for your WETH, that allow you to spend and mint and withdraw WETH in a single transaction.
// also has methods for unwrapping WETH to specific addresses as a callback from other contracts.
interface IAdvancedWETH {
    // returns the WETH address that this contract uses
    function weth() external view returns (address payable);

    // deposits any ETH sent to the contract, and then approves the `to` address, and then calls it with the given data.
    // refunds any unspent WETH to the caller.
    function depositThenCall(address to, bytes calldata data) external payable;

    // deposits any ETH sent to the contract, and then transfers an additional amount of WETH from the caller to this
    // contract, and then approves and calls the given `to` address with the total amount of WETH and the given data.
    // similar to the above method, but allows combining ETH and WETH balances in a single call.
    function depositAndTransferFromThenCall(uint amount, address to, bytes calldata data) external payable;

    // transfers the amount from the caller to this contract, then approves the to address and calls it with the given
    // call data. refunds any remaining WETH to caller as ETH. similar to the typical approveAndCall, but for canonical WETH.
    function approveAndCall(uint amount, address to, bytes calldata data) external;

    // unwrap and forward all WETH held by this contract to the given address.
    // useful as a callback from other contracts.
    function withdrawTo(address payable to) external;
}
