import React, { useState, useEffect } from "react";
import StakingContract from "./contracts/Staking.json";
import { createContext } from "react";
import getWeb3 from "./getWeb3";
import "./App.css";
import Content from "./component/Content/Content";
import Navbar from "./component/Navbar/Navbar";
import Wallet from "./component/Wallet/Wallet";
import Footer from "./component/Footer/Footer";
export const ContractContext = createContext();

const App = () => {
  const [Owner, setOwner] = useState();
  const [dai, setDai] = useState();
  const [token, setToken] = useState("");
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
        //const Owner = await instance.methods.owner().call();
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
      <ContractContext.Provider value={{ ContractVar, setContractVar, Owner, token}}>
        <div className="body-container">
          <Navbar value={true}/>
          <div id="tokens">
              <p className={token == "0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa" ? 'active': ''} onClick={() => {setToken("0x4F96Fe3b7A6Cf9725f59d353F723c1bDb64CA6Aa")}}>DAI</p>
              <p className={token == "0xF00503d6771d820C94066a42EdbCc9428652C518" ? 'active': ''} onClick={()=> {setToken("0xF00503d6771d820C94066a42EdbCc9428652C518")}}>BNB</p>
              <p className={token == "0xe19b09e0a62aDaEc3E1DC59CbE66bDA0Ec8A1FAa" ? 'active': ''} onClick={()=>{setToken("0xe19b09e0a62aDaEc3E1DC59CbE66bDA0Ec8A1FAa")}}>LINK</p>
          </div>
          {token != "" ? <Content token={token} value={true}/> : <div id="message">
            Choose a pool and earn interest...
          </div>}
        </div>
          <Footer />
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