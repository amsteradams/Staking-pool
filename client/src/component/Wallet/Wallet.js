import React from 'react'
import "./Wallet.css";
export default function Wallet(props) {
  return (
    <div id="ctn"><button onClick={props.data} class='connect'>Connect Metamask<img src='wallet.png'/></button></div>
  )
}
