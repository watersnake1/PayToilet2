// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IFooToken {
    function currentOwner() external view returns (address);
    function credit(address _recipient, uint _amt) external returns (bool);
    function debit(address _recipient, uint _amt) external returns (bool);
}