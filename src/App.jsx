import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const URL = "http://25.65.134.189:3000";
  let [datosMessages, setdatosMessages] = useState([]);
  let [formData, setFormData] = useState({
    nombre: "",
    email: "",
  });
  let [VerOverlay, setVerOverlay] = useState(true);
  let [mensajeError, setMensajeError] = useState('');
  let [chat, setChat] = useState({
    id: 0,
    pregunta: '',
    autor: 'YO',
    respuestas: []
  });

  //Primera pregunta
  function getPreguntas() {
    axios.get(`${URL}/preguntas/1`).then((res) => {
      setdatosMessages([...datosMessages, res.data]);
      console.log(datosMessages);
      console.log(res)
    });
  }

  //registroChat
  function Register() {
    console.log(formData);
    axios.post(`${URL}/registro`, formData).then((res) => {
      if (res.data.Status === "Success") {
        localStorage.setItem("id", res.data.id);
        setVerOverlay(false);
        getPreguntas();
      }else {
        document.getElementById('Error').style.display = 'block'
        setMensajeError(res.data.message)
      } 
      console.log(res);
    });
  }

  //Responder
  const putRespuestas = (resPut, idPregunta) => {
    const respuesta = {
      id_pregunta: idPregunta,
      respuesta: resPut.respuesta,
      iduser: localStorage.getItem("id"),
    };
    console.log(datosMessages)
    if (resPut.siguiente_pregunta === null) {
      setdatosMessages([
        ...datosMessages,
        { id: 0,
          pregunta: resPut.respuesta,
          autor: 'YO',
          respuestas: []
        },
      ]);
    } else {
      axios
        .put(`${URL}/respuestas`, respuesta, {
          headers: { "Content-Type": "application/json" },
        })
        .then((res) => {
          console.log(res);
          const datos = {
            id: 0,
            pregunta: resPut.respuesta,
            autor: 'YO',
            respuestas: []
          }
          setdatosMessages([...datosMessages, datos,res.data]);
          console.log(datosMessages);
        });
    }
  }

  const addChat = () => {
    if (chat.pregunta !== ''){
      setdatosMessages([...datosMessages, chat])
      setChat((data) => ({
        ...data,
        pregunta: '',
      }));
      const limpiar = document.getElementById('text')
      limpiar.value = ""
    }
  }

  return (
    <>
      {VerOverlay === true && (
        <div className="overlay">
          <div className="boxRegister">
            <h1 style={{ textAlign: "center" }}>Registrarse</h1>
            <input
              type="text"
              placeholder="Nombre*"
              className="form-control"
              onChange={({ target }) => {
                setFormData((data) => ({
                  ...data,
                  nombre: target.value,
                }));
              }}
            />
            <input
              type="email"
              placeholder="Email*"
              className="form-control"
              onChange={({ target }) => {
                setFormData((data) => ({
                  ...data,
                  email: target.value,
                }));
              }}
            />
            <button className="btn btn-success" onClick={() => Register()}>
              Confirmar
            </button>
            <p style={{margin: '5px', color: 'red', display: 'none', textAlign: 'center'}} id='Error'>{ mensajeError }</p>
          </div>
        </div>
      )}
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
            {datosMessages.map((element) => (
              <div
                className={`${
                  element.autor === "BOT" ? "contentChat1" : "contentChat2"
                }`}
              >
                <div className="chat" id={`${
                  element.autor === "BOT" ? "chat1" : "chat2"
                }`}>
                  <p
                    style={{ color: "rgba(25,25,25,1)" }}
                    key={element.pregunta}
                  >
                    {element.pregunta}
                  </p>
                  <span className="contentButon">
                    {element.respuestas.map((el) => (
                      <button
                        className="btn btn-primary"
                        key={el.respuesta}
                        onClick={() => putRespuestas(el, element.id)}
                      >
                        {el.respuesta}
                      </button>
                    ))}
                  </span>
                </div>
              </div>
            ))}
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
              onChange={({ target }) => {
                setChat((data) => ({
                  ...data,
                  pregunta: target.value,
                }));
              }}
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
              onClick={()=> addChat()}
              autoFocus
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
