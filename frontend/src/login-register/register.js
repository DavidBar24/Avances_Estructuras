import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");
  const [contrasena, setContrasena] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5006/api/registro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, edad, contrasena }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Registro exitoso");
      localStorage.setItem("token", data.token);
      navigate("/veterinaria");
    } else {
      alert("Error en el registro: " + data.error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Edad"
        value={edad}
        onChange={(e) => setEdad(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={contrasena}
        onChange={(e) => setContrasena(e.target.value)}
        required
      />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;

