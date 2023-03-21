import React from "react";
import { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const URL = "http://25.65.134.189:3000";
  let [datosPreguntas, setdatosPreguntas] = useState("");
  let [formData, setFormData] = useState({
    nombre: '',
    email: ''
  });
  let [datosArray, setdatosArray] = useState([]);
  let [id, setId] = useState(0);
  let [VerOverlay, setVerOverlay] = useState(true)

  function getPreguntas() {
    axios.get(`${URL}/preguntas/1`).then((res) => {
      setdatosPreguntas(res.data.pregunta);
      setdatosArray(res.data.respuestas);
      setId(res.data.id);
      console.log(res);
    });
  }

  function Register() {
    console.log(formData)
    axios.post(`${URL}/registro`, formData).then((res) => {
      if (res.data.Status === 'Success'){
        localStorage.setItem('id', res.data.id)
        setVerOverlay(false)
        getPreguntas()
      }
      console.log(res);
    });
  }

  function putRespuestas(resPut) {
    const respuesta = {
      id_pregunta: id,
      respuesta: resPut.respuesta,
      iduser: localStorage.getItem('id'),
    };
    if (resPut.siguiente_pregunta === null) {
      setdatosPreguntas("¡Gracias por sus respuestas!");
      setdatosArray([]);
    } else {
      axios
        .put(`${URL}/respuestas`, respuesta, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          console.log(res);
          setdatosPreguntas(res.data.pregunta);
          setdatosArray(res.data.respuestas);
          setId(res.data.id);
        });
    }
  }

  return (
    <>
      { VerOverlay === true &&
        <div className="overlay">
          <div className="boxRegister">
            <h1 style={{ textAlign: "center" }}>Registrarse</h1>
            <input type="text" placeholder="Nombre*" className="form-control" onChange={ ({ target }) => {
                setFormData((data)=> ({
                  ...data,
                  nombre: target.value
                }))
              }} />
            <input
              type="email"
              placeholder="Email*"
              className="form-control"
              onChange={ ({ target }) => {
                setFormData((data)=> ({
                  ...data,
                  email: target.value
                }))
              }}
            />
            <button className="btn btn-success" onClick={()=> Register()}>Confirmar</button>
          </div>
        </div>
      }
      <div
        className="content"
        style={{
          height: "100vh",
          background:
            "linear-gradient(90deg, rgba(25,25,25,1) 0%, rgba(29,29,29,1) 35%, rgba(42,42,42,1) 100%)",
        }}
      >
        <div
          className="container"
          style={{
            maxWidth: "800px",
            height: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="chatBox" style={{ height: "100%" }}>
            {/* chat */}
            {}
            <div className="contentChat1">
              <div className="chat" id="chat1">
                <p style={{ color: "rgba(25,25,25,1)" }}> {datosPreguntas} </p>
                <span className="contentButon">
                  {datosArray.map((el) => (
                    <button
                      className="btn btn-primary"
                      key={el.respuesta}
                      onClick={() => putRespuestas(el)}
                    >
                      {el.respuesta}
                    </button>
                  ))}
                </span>
              </div>
            </div>
            {false && (
              <div className="contentChat2">
                <div className="chat" id="chat2">
                  <p style={{ color: "rgba(25,25,25,1)" }}></p>
                </div>
              </div>
            )}
          </div>
          <div
            className="options"
            style={{ display: "flex", gap: "20px", marginBottom: "20px" }}
          >
            <input
              type="text"
              className="form-control"
              id="text"
              style={{ borderRadius: "30px" }}
            />
            <button
              className="btn btn-secondary"
              style={{
                borderRadius: "30px",
                padding: "7px 15px",
                background:
                  "linear-gradient(90deg, rgba(124,230,255,1) 0%, rgba(109,228,255,1) 35%, rgba(98,226,255,1) 100%)",
                color: "#2b2b2bb2",
                fontWeight: "700",
                border: "0",
              }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
