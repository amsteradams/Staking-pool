// SPDX-License-Identifier: MIT
///@author Adam Korchane - Alyra
pragma solidity 0.8.13;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOracle{
    function getLatestPrice(address _addr) external view returns (int);
}

contract Staking is ERC20{
    IOracle oracle;
    uint rate = 3;
    uint lPTrate = 2;
    mapping(address => mapping(address => uint)) Balance; //guy => token => balance
    mapping(address => mapping(address => uint)) DepositDate; //guy => token => timestamp

    event Staked(address indexed _from, uint _value);
    event UnStaked(address indexed _from, uint _value);

    constructor(address _addr) ERC20("LpToken", "LpT"){
        oracle = IOracle(_addr);
    }

    /**
    *@param amount is the amount we want to stake
    *@param _addr is the token we want to stake
    *@dev user has to approve contract before
    *@notice Stake your token and make you earn 3% APR and 2% of LpTokens
    */
    function stake(address _addr, uint amount)external{
        require(IERC20(_addr).balanceOf(msg.sender) >= amount, "Balance is too low");
        require(getAllowanceOf(_addr, msg.sender) >= amount, "Contract not approved");
        IERC20(_addr).transferFrom(msg.sender, address(this), amount);
        Balance[msg.sender][_addr] = amount;
        DepositDate[msg.sender][_addr] = block.timestamp;
        emit Staked(msg.sender, amount);
    }

    /**
    *@param _token is wich token user want to Unstake
    *@notice Unstake your tokens + 3%/year + 2% of LpTokens
    */
    function unStake(address _token)external{
        require(Balance[msg.sender][_token] > 0, "No tokens staked");
        uint timeStaked = block.timestamp - DepositDate[msg.sender][_token];

        uint interest = (((Balance[msg.sender][_token] * rate) / 3153600000) * timeStaked) * (1 +(uint(oracle.getLatestPrice(getOracleAddress(_token)))/(1*10**9)));
        uint lptInterest = ((Balance[msg.sender][_token] * lPTrate) / 3153600000) * timeStaked;
        uint balance = Balance[msg.sender][_token];
        Balance[msg.sender][_token] = 0;
        _mint(msg.sender, lptInterest);
        IERC20(_token).transfer(msg.sender, (balance + interest));
        emit UnStaked(msg.sender, balance);
    }

    //Interests Getters : 
    /**
    *@param _token is the tokens we want to get interests of
    *@param _addr is the address we want to get interests of
    *@return winned interests of _addr
    */
    function getInterests(address _token ,address _addr)public view returns(uint){
        require(Balance[_addr][_token] > 0, "No tokens staked");
        uint timeStaked = block.timestamp - DepositDate[msg.sender][_token];
        uint interest = (((Balance[msg.sender][_token] * rate) / 3153600000) * timeStaked) * (1 +(uint(oracle.getLatestPrice(getOracleAddress(_token)))/(1*10**9)));
        return interest;
    }

    /**
    *@param _token is the tokens we want to get interests of
    *@param _addr is the address we want to get Lp tokens interests of
    *@return winned Lp tokens interests of _addr
    */
    function getLpInterests(address _token ,address _addr)public view returns(uint){
        require(Balance[_addr][_token] > 0, "No tokens staked");
        uint timeStaked = block.timestamp - DepositDate[msg.sender][_token];
        uint lptInterest = ((Balance[msg.sender][_token] * lPTrate) / 3153600000) * timeStaked;
        return lptInterest;
    }

    //Getters : 

    /**
    *@param _token to get the contract's balance of this token
    *@return the amount of dai stored in the contract
    */
    function getContractBalance(address _token)external view returns(uint){
        return IERC20(_token).balanceOf(address(this));
    }

    /**
    *@param _token is the token we want to get the balance
    *@param _addr is the address we want to verify
    *@return the amount of dai _addr got
    */
    function getTokenBalanceOf(address _token ,address _addr)public view returns(uint){
        return IERC20(_token).balanceOf(_addr);
    }

    /**
    *@param _token is the token we want to get the staking
    *@param _addr is the address we want to verify
    *@return the amount of dai _addr stake in this contract
    */
    function stakingOf(address _token, address _addr)public view returns(uint){
        return Balance[_addr][_token];
    }

    /**
    *@param _addr is the address we want to verify
    *@return how much time(in seconds) _addr stake his dai 
    */
    function getStakingTime(address  _token, address _addr)external view returns(uint){
        return block.timestamp - DepositDate[_addr][_token];
    }

    /**
    *@param _token is wich token we want to check allowance of
    *@param _addr is the address we want to verify
    *@return the allowance that approved '_addr' to this contract
    */
    function getAllowanceOf(address _token, address _addr)public view returns(uint){
        return IERC20(_token).allowance(_addr, address(this));
    }
    /**
    *@param _addr is the guy we want to get the total balance
    *@return amount locked in the contract in dollar
    */
    function getMyDollarBalance(address _addr)external view returns(uint){
        uint daiBal = (stakingOf(0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa, _addr) / 10**18);
        uint bnbBal = (stakingOf(0xF00503d6771d820C94066a42EdbCc9428652C518, _addr) / 10**18) * (uint(oracle.getLatestPrice(getOracleAddress(0xF00503d6771d820C94066a42EdbCc9428652C518)))/(10**8));
        uint linkBal = (stakingOf(0xe19b09e0a62aDaEc3E1DC59CbE66bDA0Ec8A1FAa, _addr) / 10**18) * (uint(oracle.getLatestPrice(getOracleAddress(0xe19b09e0a62aDaEc3E1DC59CbE66bDA0Ec8A1FAa)))/(10**8));

        return linkBal + bnbBal + daiBal;
    }

    //Utils

    /**
    *@param _token is the token we want to get the price
    *@dev return token's correspondant chainlink's data feeder
    */
    function getOracleAddress(address _token)private pure returns(address){
        if(_token == 0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa){
            return 0x777A68032a88E5A84678A77Af2CD65A7b3c0775a;
            }
        else if(_token == 0xF00503d6771d820C94066a42EdbCc9428652C518){
            return 0x8993ED705cdf5e84D0a3B754b5Ee0e1783fcdF16;
            }
        else if(_token == 0xe19b09e0a62aDaEc3E1DC59CbE66bDA0Ec8A1FAa){
            return 0x396c5E36DD0a0F5a5D33dae44368D4193f69a1F0;
            }
        else{
            revert();
            }
    }
}