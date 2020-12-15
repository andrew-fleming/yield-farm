pragma solidity ^0.6.0;

import './HodlToken.sol';
import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

interface DaiToken {
        function transfer(address dst, uint wad) external returns (bool);
        function transferFrom(address from, address to, uint wad) external returns (bool);
        function balanceOf(address user) external view returns (uint);
        function approve(address _spender, uint256 _value) external returns (bool);
        }

contract HodlFarm is Ownable {
    using SafeMath for uint256;

    string public name = 'HodlFarm'; //for testing/smoke test

    HodlToken public hodlToken;
    DaiToken public daiToken;

    address[] public stakers;

    mapping(address => uint256) public startTime;
    mapping(address => uint256) public stakingBalance;
    mapping(address => uint256) public hodlBalance;
    mapping(address => bool) public isStaking;

    /**@dev DaiToken address must be inserted in migrations when
    ///     this contract deploys.
     */
    constructor(HodlToken _hodlToken, DaiToken _daiToken) public {
        hodlToken = _hodlToken;
        daiToken = _daiToken;
    }

    /**
    *@notice A function that stakes stablecoin Dai to the contract.
    *@dev After Dai transfers to the contract, the mapped staking balance updates. 
    ///   This is necessary because the contract only pays out when the user withdraws 
    ///   their earnings. The mapping keeps track of said yield.
    *@param _amount The amount to be staked to the contract.
     */
    function stake(uint256 _amount) public {
        require(_amount > 0, 'You cannot stake zero tokens');
        daiToken.transferFrom(msg.sender, address(this), _amount);
        stakingBalance[msg.sender] += _amount;
        isStaking[msg.sender] = true;
        startTime[msg.sender] = block.timestamp;
    }

    /**@notice A method for withdrawing the hodlToken yield.
    *@dev The timeStaked uint takes the result of the calculateYield function. 
    ///   This contract gives the user 1% of their Dai balance in HodlToken every 60 
    ///   seconds. After fetching the the calculated balance, the contract checks for 
    ///   an existing balance mapped to hodlBalance. This mapping is only relevant if 
    ///   the user staked Dai multiple times without unstaking/withdrawing. Further, the
    ///   staking balance of the user is first multiplied by the time staked before
    ///   divided by 100 to equate 1% of the user's stake (per minute as seen in the
    ///   calculateYield function).
     */
    function withdrawYield() public {
        uint timeStaked = calculateYield(msg.sender);
        uint bal = (stakingBalance[msg.sender] * timeStaked) / 100;
        if(hodlBalance[msg.sender] != 0){
            uint oldBal = hodlBalance[msg.sender];
            hodlBalance[msg.sender] = 0;
            bal += oldBal;
        }
        startTime[msg.sender] = block.timestamp;
        hodlToken.transfer(msg.sender, bal);
    }


    /**@notice A method for calculating yield.
    *@dev The yield is calculated by first, subtracting the initial timestamp by the current 
    ///   timestamp. Thereafter, dividing 60 (as in 60 seconds per minute) by the timestamp 
    ///   difference. This function is left public so the frontend can fetch and display the 
    ///   user's yield in real time.
    *@param _usr The address that a user calls this function from/for.
     */
    function calculateYield(address _usr) public view returns(uint){
        uint end = block.timestamp;
        uint totalTime = end - startTime[_usr];
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
    }

}