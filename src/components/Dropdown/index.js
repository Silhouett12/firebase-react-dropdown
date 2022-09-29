import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dropdown.css";

const DropDown = () => {
  const [state, setState] = useState([]);
  // ref a la base de datos
  const companyCollection = collection(db, "companies");

  // GET

  const getCompanies = async () => {
    const getData = await getDocs(companyCollection);
    setState(getData.docs.map((el) => el.data()));
    console.log(state);
  };
  // Functions

  // useEffect
  useEffect(() => {
    getCompanies();
  }, []); //eslint-disable-line

  return (
    <div className="mainContainer">
      <h1>Searchbar dropdown</h1>
      <input type="text" className="form-control" placeholder="Search" />
      <ul className="list-group">
        {state.map((el) => (
          <li type="button" className="list-group-item list-group-item-action">
            {el.nombre}
          </li>
        )).slice(0,20)}
      </ul>
    </div>
  );
};

export default DropDown;
