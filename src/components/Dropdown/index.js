import React from "react";
import { useState, useEffect } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";

const DropDown = () => {
  const [state, setState] = useState([]);

  // ref a la base de datos
  const companyCollection = collection(db, "companies");

  // GET

  const getCompanies = async () => {
    const getData = await getDocs(companyCollection);
    setState(getData.docs.map(el => {el.data()}))
    console.log(state)
  };
  // Functions



  // useEffect
  useEffect(() => {
    getCompanies();
  }, []); //eslint-disable-line

  return (
    <div>
      hola
    </div>
  );
};

export default DropDown;
