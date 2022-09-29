import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebase";
import "bootstrap/dist/css/bootstrap.min.css";
import "./dropdown.css";
// import { dataBase } from "../../json/data";
import { Button, Modal } from "react-bootstrap";

const DropDown = () => {

  // DATABASE INFO
  const [state, setState] = useState([]);

  const getCompanies = async () => {
    let latestDoc = null;
    try {
      const companyCollection = collection(db, "companies")
        .orderBy("nombre", "asc")
        .startAfter(latestDoc || 0)
        .limit(20);
      const getData = await getDocs(companyCollection).then((el) => {
        setState(
          ...state,
          getData.docs.map((el) => el.data())
        ).setHasMore(el.docs.length > 0);
      });
      setHasMore();
      latestDoc = getData.docs[getData.docs.length - 1];
    } catch (error) {
      return alert("An error occured while gettingCompanies");
    }
  };

  //SEARCH/PAGINATION
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [hasMore, setHasMore] = useState();
  const [pageNumber, setPageNumber] = useState(1);

  const observer = useRef();
  const lastName = useCallback(
    (node) => {
      if (observer.current) return observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
      console.log(node);
    },
    [hasMore]
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

  const [nombre, setNombre] = useState("");
  const [razón, setRazón] = useState("");
  const [teléfono, setTeléfono] = useState("");
  const [nit, setNit] = useState("");
  const [código, setCódigo] = useState("");

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

  // useEffect

  useEffect(() => {
    getCompanies();
    console.log("hubo un cambio");
  }, [pageNumber]); //eslint-disable-line


  //RENDERIZADO
  return (
    <div className="mainContainer">
      <h1>Searchbar dropdown</h1>
      <input
        type="text"
        className="form-control"
        placeholder="Search"
        value={search}
        onChange={handleSearch}
      />
      <div className="scroll-list">
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
                  ref={lastName}
                  type="button"
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
        </ul>
      </div>
      <Modal show={openModal} onHide={() => handleModal()} className="modal">
        <Modal.Header closeButton="modal-header">Company</Modal.Header>
        <form onSubmit={store}>
          <div className="md-form mb-5">
            <input
              type="text"
              id="form29"
              className="form-control validate"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
            <label data-error="wrong" data-success="right" for="form29">
              Nombre
            </label>
          </div>

          <div className="md-form mb-5">
            <input
              type="text"
              id="form29"
              className="form-control validate"
              value={razón}
              onChange={(e) => setRazón(e.target.value)}
            />
            <label data-error="wrong" data-success="right" for="form29">
              Razón social
            </label>
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
            <label data-error="wrong" data-success="right" for="form29">
              Número de NIT
            </label>
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
            <label data-error="wrong" data-success="right" for="form29">
              Telefono
            </label>
          </div>

          <div className="md-form mb-5">
            <input
              type="number"
              id="form29"
              className="form-control validate"
              value={código}
              onChange={(e) => setCódigo(e.target.value)}
            />
            <label data-error="wrong" data-success="right" for="form29">
              Código
            </label>
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
