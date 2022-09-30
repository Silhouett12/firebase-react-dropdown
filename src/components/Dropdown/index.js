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
  // DATABASE INFO
  const [state, setState] = useState([]);
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [nombre, setNombre] = useState("");
  const [razón, setRazón] = useState("");
  const [teléfono, setTeléfono] = useState("");
  const [nit, setNit] = useState("");
  const [código, setCódigo] = useState("");
  const [lastVisible, setLastVisible] = useState(null);

  const observer = useRef();

  const getCompanies = async () => {
  
    const companyCollection = query(
      collection(db, "companies"),
      orderBy("razón_social"),
      startAfter(lastVisible || 0),
      limit(20)
    );
    const getData = await getDocs(companyCollection);
      if (state.length < 1) {setState(
      ...state, getData.docs.map((el) => el.data()));
     
      }
      if (state.length < 60){setState((prevState) => ([...prevState.concat(getData.docs.map((el) => el.data()))

     ]))}
      else {return state}
  };

  //SEARCH/PAGINATION

  const lastName = useCallback(
    (node) => {
      if(observer.current) observer.current.disconnect()
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && state.length > 1) {
         setPageNumber(e => e + 1)
        }
      });
      if (node) observer.current.observe(node);
    },
    [state]
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPageNumber(1);
    setNombre(e.target.value);
  };

  const results = !search
    ? state
    : state.filter((dato) =>
        dato.nombre.toLowerCase().includes(search.toLocaleLowerCase())
      );
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
    setOpenModal(!openModal);
    console.log(e);
  };

  const handleModal = () => {
    setOpenModal(!openModal);
  };

  

  useEffect(() => {
    getCompanies();
    console.log("hubo un cambio");
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
          onChange={handleSearch}
        />
        <div className={"scroll-list"}>
          <ul className="list-group">
            <li
              type="button"
              className="list-group-item list-group-item-action"
              id="item-create"
              onClick={() => handleModal()}
            >
              Create
            </li>
            {results.map((el, index) => {
              if (results.length === index + 1) {
                return (
                  <li
                    type="button"
                    ref={lastName}
                    className="list-group-item list-group-item-action"
                    key={el.código}
                  >
                    {el.nombre}
                  </li>
                );
              } else {
                return (
                  <li
                    type="button"
                    className="list-group-item list-group-item-action"
                    key={el.código}
                  >
                    {el.nombre}
                  </li>
                );
              }
            })}
            {/* <button onClick={() => moreClicks()}>click</button> */}
          </ul>
        </div>
      </div>
      <Modal show={openModal} onHide={() => handleModal()} className="modal">
        <Modal.Header closeButton="modal-header">
          <h1>Company</h1>
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
