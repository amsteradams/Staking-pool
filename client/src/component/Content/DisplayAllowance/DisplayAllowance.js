import React, {useEffect, useState, useContext} from 'react'
import { ContractContext } from '../../../App'

export default function DisplayAllowance() {
    const context = useContext(ContractContext);

    const seeAllowance = async () => {
        const allow = await context.ContractVar.contract.methods.getAllowanceOf(context.ContractVar.accounts[0]).call();
        console.log(allow);
    }
  return (
    <div><button type='submit' onClick={seeAllowance}>Allowance</button></div>
  )
}
