// SPDX-License-Identifier: MIT
///@author Adam Korchane - Alyra
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOracle{
    function getLatestPrice() external view returns (int);
}

contract Staking is Ownable, ERC20{
IOracle oracle;
    IERC20 dai;
    uint rate = 3;
    uint lPTrate = 2;
    mapping(address => uint) Balance;
    mapping(address => uint) DepositDate;

    event Staked(address indexed _from, uint _value);
    event UnStaked(address indexed _from, uint _value);

    constructor(address _addr) ERC20("LpToken", "LpT"){
        oracle = IOracle(_addr);
        dai = IERC20(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa);
    }

    /**
    *@param amount is the amount we want to stake
    *@dev user has to approve contract before
    *@notice Stake your token and make you earn 3% APR and 2% of LpTokens
    */
    function stake(uint amount)external{
        require(dai.balanceOf(msg.sender) >= amount, "Dai balance is too low");
        require(getAllowanceOf(msg.sender) >= amount, "Contract not approved");
        dai.transferFrom(msg.sender, address(this), amount);
        Balance[msg.sender] = amount;
        DepositDate[msg.sender] = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    /**
    *@notice Unstake your tokens + 3%/year + 2% of LpTokens
    *@dev I used Chainlink because it was required by the specifications, but
    *because Dai is a stable coin and solidity does not support float numbers
    *in this case it will only multiply by 1 (and not 1.010...)
    */
    function unStake()external{
        require(Balance[msg.sender] > 0, "No dai staked");
        uint timeStaked = block.timestamp - DepositDate[msg.sender];
        uint interest = (((Balance[msg.sender] * rate) / 3153600000) * timeStaked) * (1 +(uint(oracle.getLatestPrice())/(1*10**9)));
        uint lptInterest = ((Balance[msg.sender] * lPTrate) / 3153600000) * timeStaked;
        uint balance = Balance[msg.sender];
        Balance[msg.sender] = 0;
        _mint(msg.sender, lptInterest);
        dai.transfer(msg.sender, (balance + interest));
        emit UnStaked(msg.sender, balance);
    }

    //Getters

    /**
    *@param _addr is the address we want to get interests of
    *@return winned interests of _addr
    */
    function getInterests(address _addr)public view returns(uint){
        require(Balance[_addr] > 0, "No dai staked");
        uint timeStaked = block.timestamp - DepositDate[msg.sender];
        uint interest = (((Balance[msg.sender] * rate) / 3153600000) * timeStaked) * (1 +(uint(oracle.getLatestPrice())/(1*10**9)));
        return interest;
    }

    /**
    *@param _addr is the address we want to get Lp tokens interests of
    *@return winned Lp tokens interests of _addr
    */
    function getLpInterests(address _addr)public view returns(uint){
        require(Balance[_addr] > 0, "No dai staked");
        uint timeStaked = block.timestamp - DepositDate[msg.sender];
        uint lptInterest = ((Balance[msg.sender] * lPTrate) / 3153600000) * timeStaked;
        return lptInterest;
    }

    /**
    *@return the amount of dai stored in the contract
    */
    function getContractBalance()external view returns(uint){
        return dai.balanceOf(address(this));
    }

    /**
    *@param _addr is the address we want to verify
    *@return the allowance that approved '_addr' to this contract
    */
    function getAllowanceOf(address _addr)public view returns(uint){
        return dai.allowance(_addr, address(this));
    }

    /**
    *@param _addr is the address we want to verify
    *@return the amount of dai _addr got
    */
    function getDaiBalanceOf(address _addr)public view returns(uint){
        return dai.balanceOf(_addr);
    }

    /**
    *@param _addr is the address we want to verify
    *@return the amount of dai _addr stake in this contract
    */
    function stakingOf(address _addr)external view returns(uint){
        return Balance[_addr];
    }

    /**
    *@param _addr is the address we want to verify
    *@return how much time(in seconds) _addr stake his dai 
    */
    function getStakingTime(address _addr)external view returns(uint){
        return uint(oracle.getLatestPrice()) - DepositDate[_addr];
    }

    /**
    *@param _addr is the address we want to verify
    *@return the total of dai + lpTokens this contract own to _addr 
    */
    function gainsOf(address _addr)external view returns(uint){
        return Balance[_addr] + getInterests(_addr) + getLpInterests(_addr);
    }

}