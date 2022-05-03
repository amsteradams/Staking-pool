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
      const amount = await context.ContractVar.contract.methods.stakingOf(context.token,context.ContractVar.accounts[0]).call();
      setAmountStaked(amount);
    }, [])

    useEffect(async () => {
      const allow = context.ContractVar.contract.methods.getAllowanceOf(context.token,context.ContractVar.accounts[0]).call().then(elem => {
          setAllowance(elem)
      })
    }, [props.value])

    useEffect(async () => {
        const allow = context.ContractVar.contract.methods.getAllowanceOf(context.token,context.ContractVar.accounts[0]).call().then(elem => {
            setAllowance(elem)
        })
        const amount = await context.ContractVar.contract.methods.stakingOf(context.token,context.ContractVar.accounts[0]).call();
      setAmountStaked(amount);
      }, [context.token])
    
    useEffect(async () => {
      const amount = await context.ContractVar.contract.methods.stakingOf(context.token,context.ContractVar.accounts[0]).call();
      setAmountStaked(amount);
    }, [])

    useEffect(async () => {
        const amount = await context.ContractVar.contract.methods.stakingOf(context.token,context.ContractVar.accounts[0]).call();
        setAmountStaked(amount);
      }, [props.data])

    useEffect(async () => {
        if(allowance > 0){
            setApproved(true);
        }
      }, [allowance])  

    const stake =async () => {
        await context.ContractVar.contract.methods.stake(context.token,(input*(10**18)).toString()).send({from:context.ContractVar.accounts[0]})
    }

    const unStake = async () => {
        await context.ContractVar.contract.methods.unStake(context.token).send({from:context.ContractVar.accounts[0]})
    }

    const setImg = () => {
        if(context.token == "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa"){return "dai.png"}
        else if(context.token == "0xF00503d6771d820C94066a42EdbCc9428652C518"){return "bnb.png"}
        else if(context.token == "0xe19b09e0a62aDaEc3E1DC59CbE66bDA0Ec8A1FAa"){return "chainlink.png"}
    }
    if(amountStaked == 0){
        return (
            <div id="stake">
                <div id="up-part">
                    <input onChange={e => {inputChanged(e.target.value)}} id="input-stake" type="text" placeholder='Amount'/><img src={setImg()} alt="dai logo" className='logo'/>
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
                    Amount staked : {(amountStaked / 10**18)} <img src={setImg()} alt="dai logo" className='logo-stake'/>
                </div>
                <div id="bottom-part">
                    <button onClick={unStake} type="submit" >Unstake</button>
                </div>
            </div>
        )
    }
  
}
