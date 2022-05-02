import React, {useState, useEffect, useContext} from 'react'
import { ContractContext } from '../../../App';
import "./UserDisplay.css";
export default function UserDisplay() {
    const context = useContext(ContractContext);
    const [account, setAccount] = useState();

    useEffect(() => {
      getAccount();
    }, [])
    
    const getAccount = async () => {
        setAccount(context.ContractVar.accounts[0]);
    }
  return (
    <div id="userDisplay">
        {account}
    </div>
  )
}
