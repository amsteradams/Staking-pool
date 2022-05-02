import React,{useState, useContext, useEffect} from 'react'
import { ContractContext } from '../../../App';
import Approve from "./Approve/Approve";
import "./Stake.css";
export default function Stake(props) {
    const context = useContext(ContractContext);
    const [approved, setApproved] = useState(false);
    const [allowance, setAllowance] = useState();
    const [input, setInput] = useState();
    const [amountStaked, setAmountStaked] = useState();
    const inputChanged = (e) => {
        setInput(e);
    }
    useEffect(async () => {
      const amount = await context.ContractVar.contract.methods.stakingOf(context.ContractVar.accounts[0]).call();
      setAmountStaked(amount);
    }, [])

    useEffect(async () => {
      const allow = context.ContractVar.contract.methods.getAllowanceOf(context.ContractVar.accounts[0]).call().then(elem => {
          setAllowance(elem)
      })
    }, [props.value])
    
    useEffect(async () => {
      const amount = await context.ContractVar.contract.methods.stakingOf(context.ContractVar.accounts[0]).call();
      setAmountStaked(amount);
    }, [])

    useEffect(async () => {
        const amount = await context.ContractVar.contract.methods.stakingOf(context.ContractVar.accounts[0]).call();
        setAmountStaked(amount);
      }, [props.data])

    useEffect(async () => {
        if(allowance > 0){
            setApproved(true);
        }
      }, [allowance])  

    const stake =async () => {
        await context.ContractVar.contract.methods.stake((input*(10**18)).toString()).send({from:context.ContractVar.accounts[0]})
    }

    const unStake = async () => {
        await context.ContractVar.contract.methods.unStake().send({from:context.ContractVar.accounts[0]})
    }
    if(amountStaked == 0){
        return (
            <div id="stake">
                <div id="up-part">
                    <input onChange={e => {inputChanged(e.target.value)}} id="input-stake" type="text" placeholder='Amount'/><img src="dai.png" alt="dai logo" class='logo'/>
                </div>
                <div id="bottom-part">
                    <Approve value={setApproved} data={approved}/>
                    <button onClick={stake} type="submit" disabled={approved == false}>2 Stake</button>
                </div>
            </div>
          )
    }
    else{
        return (
            <div id="stake">
                <div id="up-part">
                    Amount staked : {amountStaked / 10**18} <img src="dai.png" alt="dai logo" class='logo-stake'/>
                </div>
                <div id="bottom-part">
                    <button onClick={unStake} type="submit" >Unstake</button>
                </div>
            </div>
        )
    }
  
}
