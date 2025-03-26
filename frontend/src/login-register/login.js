import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";



const Login = () => {
  const [nombre, setNombre] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5006/api/inicio-sesion", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, contrasena }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Inicio de sesión exitoso");
      localStorage.setItem("token", data.token);
      navigate("/veterinaria");
    } else {
      alert("Error en el inicio de sesión: " + data.error);
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          className="input-field"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="password"
          className="input-field"
          placeholder="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
      <p className="toggle-text">
        ¿No tienes cuenta? <a href="/register">Regístrate</a>
      </p>
    </div>
  );
};

export default Login;
