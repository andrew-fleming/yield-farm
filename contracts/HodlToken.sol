pragma solidity ^0.6.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract HodlToken is ERC20 {
    constructor(uint256 initialSupply) ERC20('Hodl', 'HODL') public {
        _mint(msg.sender, initialSupply);
    }
}