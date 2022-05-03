import StakingContract from "../../../../contracts/Staking.json";
import React, {useState, useEffect, useContext} from 'react'
import { ContractContext } from '../../../../App'
import "./Approve.css";

export default function Stake(props) {
    const context = useContext(ContractContext);
    const [dai, setDai] = useState();
    const [bool, setBool] = useState(false);
    const [balance, setBalance] = useState();
    const [allowance, setAllowance] = useState();
    const getDaiContract = async () => {
    let kovanDaiAddress = context.token;
    let minABI = [
      // balanceOf
      {
        "constant":true,
        "inputs":[{"name":"_owner","type":"address"}],
        "name":"balanceOf",
        "outputs":[{"name":"balance","type":"uint256"}],
        "type":"function"
      },
      // approve
      {
        "constant": false,
        "inputs": [{name: "usr",type: "address",},{name: "wad",type: "uint256",},],
        "name": "approve",
        "outputs": [{name: "",type: "bool",},],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function",
      },
    ];
        try {
            const daiToken = new context.ContractVar.web3.eth.Contract(minABI, kovanDaiAddress);
            const bal = await daiToken.methods.balanceOf(context.ContractVar.accounts[0]).call();
            const allow = await context.ContractVar.contract.methods.getAllowanceOf(context.token,context.ContractVar.accounts[0]).call();
            if(allow > 0){
              props.value(true);
            }
            setAllowance(allow);
            setDai(daiToken);
            setBalance(bal);
        } catch (error) {
            alert(error);
        }        
    }
    const approve = async () => {
      const deployedNetwork = StakingContract.networks["42"];
      await dai.methods.approve(deployedNetwork.address, balance).
        send({ from: context.ContractVar.accounts[0] })
        setBool(true);
    }
    useEffect(async () => {
      getDaiContract();
      }, []);
    useEffect(() => {
      getDaiContract();
    }, [props.data])
    useEffect(() => {
      getDaiContract();
    }, [context.token])
    
    
      if(allowance < 1){
        return (
          <button id="btn-add" onClick={approve} type="submit">1 Approve</button>
         )
      }
      else{
        return(
          <button id="btn-add" onClick={approve} type="submit" disabled>1 Approve</button>
        )
      }
  
}
