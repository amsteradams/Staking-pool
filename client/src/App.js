import React, { useState, useEffect } from "react";
import StakingContract from "./contracts/Staking.json";
import { createContext } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import Content from "./component/Content/Content";
import Navbar from "./component/Navbar/Navbar";
import Wallet from "./component/Wallet/Wallet";
export const ContractContext = createContext();

const App = () => {
  const [Owner, setOwner] = useState();
  const [dai, setDai] = useState();
  const [ContractVar, setContractVar] = useState({
    storageValue: [],
    web3: null,
    accounts: null,
    contract: null
  });

  useEffect(() => {
    getContractVar();
  }, []);

  const getContractVar = async () => {

    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();
      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();
      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = StakingContract.networks[networkId];
      const instance = new web3.eth.Contract(
        StakingContract.abi,
        deployedNetwork && deployedNetwork.address,
        );
        const Owner = await instance.methods.owner().call();
        setOwner(Owner);
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods
        setContractVar({web3, accounts, contract: instance });

      } catch (error) {
        // Catch any errors for any of the above operations.
        console.log(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }
  };

  
  if(ContractVar.web3){
    return (
      <ContractContext.Provider value={{ ContractVar, setContractVar, Owner}}>
        <div className="body-container">
          <Navbar value={true}/>
          <Content value={true}/>
        </div>
      </ContractContext.Provider>
    );
  }
  else{
    return (
        <div className="body-container">
          <Navbar value={false}/>
          <Wallet data={getContractVar}/>
        </div>
    )
  }
  
}

export default App;