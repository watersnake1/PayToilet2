// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./IFooToken.sol";
import "hardhat/console.sol";


contract Wager {
    //need to set an approved token
    address public depositToken;
    address public admin;
    uint public differential;
    uint public tolerance;
    IFooToken private currentToken;
    uint public resultHolder;

    using SafeMath for uint;

    event targetAcquired(uint tg);
    event scoreCalculated(int score);
    event scoreTooLow(string txt);
    event winner(string txt);
    event ToleranceBetPlaced(int, int, int, uint);

    modifier isAdmin(address _sender) {
        require(msg.sender == currentToken.currentOwner(), "Caller is not the deposit token owner");//call the token's smart contract here);
        _;
    }

    constructor(address _depositToken, uint _differential) {
        depositToken = _depositToken;
        admin = msg.sender;
        currentToken = IFooToken(_depositToken);
        differential = _differential;
	tolerance = 3;
    }

    function updateDepositToken(address _newToken) private isAdmin(msg.sender) returns (bool) {
        depositToken = _newToken;
        currentToken = IFooToken(_newToken);
        return true;
    }

    function updateDifferential(uint _newDifferential) external isAdmin(msg.sender) returns (bool) {
	require(_newDifferential > 1, "Must be greater than 1");
        differential = _newDifferential;
        return true;
    }

    function updateTolerance(uint _tolerance) external isAdmin(msg.sender) returns (bool) {
	require(_tolerance > 1, "Must be greater than 1");
	tolerance = _tolerance;
	return true;
    }

    function getCurrentToken() public view returns (address) {
        return depositToken;
    }

    function getTarget() public view returns (uint) {
        return block.timestamp / block.number;
    }

    function getScore(address _player) public view returns (uint) {
        return scores[_player];
    }

    function getDifferential() public view returns (uint) {
	return differential;
    }

    function getTolerance() public view returns (uint) {
	return tolerance;
    }

    function getResultHolder() public view returns (uint) {
    	return resultHolder;
    }

    function attemptToleranceBet() public payable returns (int, int, int, uint) {
	// this is the tagert value, based on block's timestamp and block number
        uint tg = getTarget();
	// score is the difference between what was wagered and what the target is
	int score = int(msg.value) - int(tg);
	// for now the random differential is just the back two digits of the target number
	int randDifferential = int(tg) % 100;
	// result is the distance of the last 2 bits of score from the random number
	int result = (score % 100) - randDifferential;
	// set to an absolute value
	result = result >= 0 ? result: -result;
	resultHolder = uint(result);
	//console.logString("Score:%s | RandDiff:%s | Result:%s | Tolerance:%s", score%100, randDifferential, result, tolerance);
	emit ToleranceBetPlaced(score % 100, randDifferential, result, tolerance);
	//made change here to avoid potential overflows?
	if (uint(result) < tolerance) {
            currentToken.credit(msg.sender, uint(result));
            scores[msg.sender] += uint(result);
	    emit winner("Success!");
	} else {
	    currentToken.debit(msg.sender, uint(result));
	}
	return (score % 100, randDifferential, result, tolerance);

    }
}
