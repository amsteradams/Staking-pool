import React from 'react'
import "./Navbar.css";
import Title from "./Title/Title.js";
import UserDisplay from './UserDisplay/UserDisplay';
export default function 
(props) {
  if(props.value == false){
    return(
    <div id="navBar">
      <Title />
    </div>
    )
  }
  return (
    <div id="navBar">
      <Title />
      <UserDisplay />
    </div>
  )
}
