import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./estilosService.css";

const RegistrarM = () => {
  const [especie, setEspecie] = useState("");
  const [raza, setRaza] = useState("");
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [mensaje, setMensaje] = useState(""); // Estado para el mensaje de éxito
  const navigate = useNavigate();

  const hRegistrar = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); // Obtener token del localStorage
    
    const response = await fetch("http://localhost:5006/api/registrar-mascota", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // Añadir token en headers
      },
      body: JSON.stringify({ especie, raza, nombre, edad }),
    });

    const data = await response.json();

    if (response.ok) {
      setMensaje("🐾 ¡Registro exitoso! 🎉");
      setTimeout(() => {
        setMensaje("");
        navigate("/veterinaria"); 
      }, 3000);
    } else {
      setMensaje(` Error: ${data.error}`);
      setTimeout(() => setMensaje(""), 3000);
    }
  };

  return (
    <div className="registrar-mascota-container">
      <div className="registrar-mascota-box">
        <h2 className="registrar-mascota-title">🐶 Registrar Nueva Mascota 🐱</h2>

        {mensaje && <div className="success-message">{mensaje}</div>} {}

        <form onSubmit={hRegistrar} className="registrar-mascota-form">
          <div className="registrar-mascota-group">
            <label>Tipo de Mascota:</label>
            <input
              type="text"
              value={especie}
              onChange={(e) => setEspecie(e.target.value)}
              required
              className="registrar-mascota-input"
            />
          </div>
          <div className="registrar-mascota-group">
            <label>Raza:</label>
            <input
              type="text"
              value={raza}
              onChange={(e) => setRaza(e.target.value)}
              required
              className="registrar-mascota-input"
            />
          </div>
          <div className="registrar-mascota-group">
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              className="registrar-mascota-input"
            />
          </div>
          <div className="registrar-mascota-group">
            <label>Edad:</label>
            <input
              type="text"
              value={edad}
              onChange={(e) => setEdad(e.target.value)}
              required
              className="registrar-mascota-input"
            />
          </div>
          <button type="submit" className="registrar-mascota-button">
            Registrar Mascota
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrarM;
