import React, {useState, useEffect, useContext} from 'react'
import "./DisplayStats.css";
import Interests from "./Interests/Interests";
import LpInterests from "./LpInterests/LpInterests";
export default function DisplayStats() {
  return (
    <div id='displayStats'>
        <Interests />
        <LpInterests />
    </div>
  )
}
