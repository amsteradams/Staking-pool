import React, {useState, useEffect, useContext} from 'react'
import { ContractContext } from '../../../App';
import "./Locked.css";
export default function Locked() {
    const context = useContext(ContractContext);
    const [value, setValue] = useState();
    const [bool, setBool] = useState(false);

    useEffect(() => {
      getLockedValue();
    }, [])
    
    useEffect(() => {
      getLockedValue();
    }, [bool])
    

    const getLockedValue = async () => {
        const value = await context.ContractVar.contract.methods.getMyDollarBalance(context.ContractVar.accounts[0]).call({from:context.ContractVar.accounts[0]});
        setValue(value);

        await context.ContractVar.contract.events.Staked()
          .on('data', event => {
            if(event.returnValues._from == context.ContractVar.accounts[0]){
              setBool(true);
            }
          })
          .on('changed', changed => console.log(changed))
          // .on('error', err => throw err)
          .on('connected', str => console.log(str))

          await context.ContractVar.contract.events.UnStaked()
          .on('data', event => {
            if(event.returnValues._from == context.ContractVar.accounts[0]){
                setBool(true);
            }
          })
          .on('changed', changed => console.log(changed))
          // .on('error', err => throw err)
          .on('connected', str => console.log(str))
    }
    console.log(value);
    if(context.ContractVar.web3){
        return (
            <div id='locked'>Locked amount : <strong>{value} $</strong></div>
        )
    }
    else{
        return (
            <div id='locked'>Locked amount : 0 $</div>
        )
    }
}
