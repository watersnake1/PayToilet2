// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
//import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract FooToken is ERC20 {
    using SafeMath for uint;
    address public owner;
    address public bookie;

    modifier isOwner() {
        require(msg.sender == owner, "Not Authorized");
        _;
    }

    modifier isBookie() { 
        require(msg.sender == bookie, "Not Authorized or Bookie not set");
        _;
    }

    constructor(string memory name_, string memory symbol_) 
    ERC20(name_, symbol_) {
        owner = msg.sender;
        uint256 totalSupply = 100;
        _mint(msg.sender, totalSupply);
    }

    function currentOwner() external view returns (address) {
        return owner;
    }

    function updateOwner(address _newOwner) public isOwner() returns (bool) {
        require(_newOwner != address(0), "Can't use 0 address");
        owner = _newOwner;
        return true;
    }

    function setBookie(address _bookie) public isOwner() returns (bool) {
        bookie = _bookie;
        return true;
    }

    function credit(address _recipient, uint _amt) external returns (bool) {
        require(msg.sender == bookie, "Attempted Credit Rejected.");
        _mint(_recipient, _amt);
        return true;
    }

    function debit(address _recipient, uint _amt) external returns (bool) {
        require(msg.sender == bookie, "Attempted Debit Rejected");
        if (balanceOf(_recipient) > _amt) {
            _burn(_recipient, _amt);
            return true;
        }
        return false;
    }
}
