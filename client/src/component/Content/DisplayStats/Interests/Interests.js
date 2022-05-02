import React, {useState, useEffect, useContext} from 'react'
import { ContractContext } from '../../../../App';
import "./Interests.css";
export default function Interests() {
  const context = useContext(ContractContext);
  const [interests, setInterests] = useState();

  const getInterest = async () => {
    const amount = await context.ContractVar.contract.methods.getInterests(context.ContractVar.accounts[0]).call({from:context.ContractVar.accounts[0]})
    setInterests(amount);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      getInterest();
    }, 1000);
    return () => clearInterval(interval);
  }, [])
  
  return (
    <div>Interests : <strong>{(interests / 10**18)}</strong></div>
  )
}
