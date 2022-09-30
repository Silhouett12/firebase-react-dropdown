import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  addDoc,
  collection,
  getDocs,
  query,
  startAfter,
  limit,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dropdown.css";
// import { dataBase } from "../../json/data";
import { Button, Modal } from "react-bootstrap";




const DropDown = () => {
  // STATES
  const [state, setState] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [nombre, setNombre] = useState("");
  const [razón, setRazón] = useState("");
  const [teléfono, setTeléfono] = useState("");
  const [nit, setNit] = useState("");
  const [código, setCódigo] = useState("");
  
  
  const getCompanies = async () => {
    const companyCollection = query(
          collection(db, "companies"))
    const getData = await getDocs(companyCollection);
    setState( ...state, getData.docs.map((el) => el.data()))       
  }


  
  //SCROLL
  // const [lastVisible, setLastVisible] = useState(null);
  // const closenotif = () => document.getElementById("notif").remove(); 
  // const observer = useRef(null);
  // const getCompanies = async () => {
    //   const companyCollection = query(
    //     collection(db, "companies"),
    //     orderBy("razón_social"),
    //     startAfter(lastVisible || 0),
    //     limit(20)
    //   );
    //   const getData = await getDocs(companyCollection);
    //   if (state.length < 1) {
    //     setState(
    //       ...state,
    //       getData.docs.map((el) => el.data())
    //     );
    //     setLastVisible(getData.docs[getData.docs.length - 1]);
    //   } else {
    //     setState((prevState) => [
    //       ...prevState.concat(getData.docs.map((el) => el.data())),
    //     ]);
    //     setLastVisible(getData.docs[getData.docs.length - 1]);
    //   }
    //   if (getData.empty) {
    //     closenotif();
    //   }
    // };  

  // const lastName = useCallback(
  //   (node) => {
  //     if (observer.current) observer.current.disconnect();
  //     observer.current = new IntersectionObserver((entries) => {
  //       if (entries[0].isIntersecting && state.length > 1) {
  //         setPageNumber((e) => e + 1);
  //       }
  //     }
  //     );
  //     if (node) observer.current.observe(node);
  //     else observer.current.disconnect(true);
      
  //   },
  //   [state]
  // );

  //FORM HANDLERS / METODO POST A FIREBASE

  const postCollection = collection(db, "companies");

  const store = async (e) => {
    e.preventDefault();
    await addDoc(postCollection, {
      nombre,
      razón_social: razón,
      nit,
      teléfono,
      código,
    });
    setPageNumber(e => e + 1)
    setOpenModal(!openModal);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
    setNombre(search)
  };


  //SEARCH
  function searchingTerm(term) {
    return function (x) {
      return x.nombre.toLowerCase().includes(term) || !term;
    };
  }
 
 
  //USE EFFECT


  useEffect(() => {
    getCompanies();
    
  }, [pageNumber]); //eslint-disable-line

  //RENDERIZADO
  return (
    <div className="mainContainer">
      <h1>Searchbar dropdown</h1>
      <div className="search-container">
        <input
          type="text"
          className="form-control"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className={search? "scroll-list" : "scroll-list-hidden"}>
          <ul className="list-group">
            <li
              type="button"
              className="list-group-item list-group-item-action"
              id="item-create"
              onClick={() => handleModal()}
            >
              Create
            </li>
            {state?.filter(searchingTerm(search)).map((el) => {
              return (
                <li
                  type="button"
                  className="list-group-item list-group-item-action"
                  key={el.código}
                >
                  {el.nombre}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <Modal show={openModal} onHide={() => handleModal()} className="modal">
        <Modal.Header closeButton="modal-header">
          <h1>Empresa</h1>
        </Modal.Header>
        <form onSubmit={store}>
          <div className="md-form mb-5">
            <input
              type="text"
              id="form29"
              className="form-control validate"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <label>Nombre</label>
          </div>

          <div className="md-form mb-5">
            <input
              type="text"
              id="form29"
              className="form-control validate"
              value={razón}
              onChange={(e) => setRazón(e.target.value)}
            />
            <label>Razón social</label>
          </div>

          <div className="md-form mb-5">
            <input
              type="number"
              id="form29"
              className="form-control validate"
              value={nit}
              onChange={(e) => setNit(e.target.value)}
              placeholder="##-###-####"
            />
            <label>Número de NIT</label>
          </div>

          <div className="md-form mb-5">
            <input
              type="number"
              id="form29"
              className="form-control validate"
              value={teléfono}
              onChange={(e) => setTeléfono(e.target.value)}
              placeholder="###-###-####"
            />
            <label>Telefono</label>
          </div>
          <div className="md-form mb-5">
            <input
              type="number"
              id="form29"
              className="form-control validate"
              value={código}
              onChange={(e) => setCódigo(e.target.value)}
            />
            <label>Código</label>
          </div>
          <Modal.Footer>
            <Button type="submit">Create</Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default DropDown;
