pragma solidity ^0.6.0;

import './HodlToken.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import './MockDai.sol';

contract HodlFarmTest is Ownable {

    event Staking(bool);

    string public name = 'HodlFarm';

    HodlToken public hodlToken;
    MockDai public daiToken;

    address[] public stakers;

    mapping(address => uint256) public startTime;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public hodlBalance;
    mapping(address => bool) public isStaking;

    constructor(HodlToken _hodlToken, MockDai _daiToken) public {
        hodlToken = _hodlToken;
        daiToken = _daiToken;
    }

    //staking
    function stake(
        uint256 _amount
        ) public {

        require(_amount > 0, 'You cannot stake zero tokens');

        //approve tx
        daiToken.approve(address(this), _amount);

        //transfer after approved
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;

        //update user status and mark beginning of yield earnings
        isStaking[msg.sender] = true;
        startTime[msg.sender] = block.timestamp;

        emit Staking(true);
    }

    //withdraw yield
    function withdrawYield() public {
        uint timeStaked = calculateYield(msg.sender);
        uint bal = (stakingBalance[msg.sender] * timeStaked) / 100;

        //reset timestamp
        startTime[msg.sender] = block.timestamp;
        
        //transfer hodl
        hodlToken.transfer(msg.sender, bal);
    }


    //for calculating and fetching
    function calculateYield(address _usr) public view returns(uint){
        uint end = block.timestamp;
        uint totalTime = end - startTime[_usr];
        //convert sec to minutes
        uint minTime = totalTime / 60;
        return minTime;
    }


    //unstaking
    function unstake() public {
        require(isStaking[msg.sender] = true, 'You are not staking tokens');
        
        //map address to hodl balance so yield isn't lost after unstaking
        uint timeStaked = calculateYield(msg.sender);

        //calculate yield balance
        uint yield = (stakingBalance[msg.sender] * timeStaked) / 100;

        //reset timestamp
        startTime[msg.sender] = block.timestamp;

        //update mapping
        hodlBalance[msg.sender] += yield;
        

        //start actual unstaking process
        uint256 balance = stakingBalance[msg.sender];
        require(balance > 0, 'You do not have funds to fetch');
        stakingBalance[msg.sender] = 0;
        daiToken.transfer(msg.sender, balance);

        //update staking status
        isStaking[msg.sender] = false;

        emit Staking(false);
    }

}