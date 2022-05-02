import React, {useState, useEffect, useContext} from 'react'
import { ContractContext } from '../../../../App';
import "./LpInterests.css";
export default function LpInterests() {
  const context = useContext(ContractContext);
  const [interests, setInterests] = useState();

  const getInterest = async () => {
    const amount = await context.ContractVar.contract.methods.getLpInterests(context.ContractVar.accounts[0]).call({from:context.ContractVar.accounts[0]})
    setInterests(amount);
  }
  useEffect(() => {
      const interval = setInterval(() => {
      getInterest();
    }, 1000);
    return () => clearInterval(interval);
  }, [])
  
  return (
    <div>Lp Interests : <strong>{(interests / 10**18)}</strong></div>
  )
}
