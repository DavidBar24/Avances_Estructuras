import { useState, useEffect } from "react";
import "./estiloDeVa.css";

const vacunasPredefinidas = [
  "Rabia",
  "Moquillo canino (DHPP)",
  "Parvovirus",
  "Leptospirosis",
  "Bordetella (Tos de las perreras)",
  "Influenza canina",
  "Leishmaniasis",
  "Triple felina (Panleucopenia, Calicivirus, Rinotraqueitis)",
  "Leucemia felina (FeLV)",
  "Peritonitis Infecciosa Felina (PIF)",
  "Giardia",
  "Coronavirus canino"
];

const DesparaYVacuna = () => {
  const [mascotas, setMascotas] = useState([]);
  const [selectedMascota, setSelectedMascota] = useState(null);
  const [mostrarFormVacuna, setMostrarFormVacuna] = useState(false);
  const [mostrarFormDespara, setMostrarFormDespara] = useState(false);
  const [vacunasAnteriores, setVacunasAnteriores] = useState("");
  const [desparasitadoAnterior, setDesparasitadoAnterior] = useState("");
  const [vacunasExistentes, setVacunasExistentes] = useState([]);
  const [vacunasFaltantes, setVacunasFaltantes] = useState([]);
  const [fechaVacuna, setFechaVacuna] = useState("");
  const [fechaDesparasitacion, setFechaDesparasitacion] = useState("");
  const [fechaDesparasitacionAnterior, setFechaDesparasitacionAnterior] = useState("");
  const [fechaUltimaVacuna, setFechaUltimaVacuna] = useState("");
  const [idMascota, setIdMascota] = useState(null);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    setIdMascota(selectedMascota);
  }, [selectedMascota]);

  useEffect(() => {
    const obtenerMascotas = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5006/api/mis-mascotas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setMascotas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error:", error);
        setMascotas([]);
      }
    };
    obtenerMascotas();
  }, []);

  const agendarCita = async (tipo) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setMensaje("⚠️ Sesión expirada, por favor vuelve a iniciar sesión");
      setTimeout(() => (window.location.href = "/login"), 2000);
      return;
    }
    
    if (!idMascota) {
      setMensaje("⚠️ Selecciona una mascota");
      return;
    }

    const fecha = tipo === "VACUNACION" ? fechaVacuna : fechaDesparasitacion;
    if (!fecha) {
      setMensaje("⚠️ Selecciona una fecha");
      return;
    }
    
    if (tipo === "VACUNACION" && new Date(fecha) < new Date()) {
      setMensaje("⚠️ La fecha de vacunación debe ser futura");
      return;
    }

    try {
      const bodyData = {
        tipo,
        fecha,
        id_mascota: idMascota,
      };

      if (tipo === "VACUNACION") {
        bodyData.vacunasExistentes = vacunasExistentes;
        bodyData.vacunasFaltantes = vacunasFaltantes;
        bodyData.fechaUltimaVacuna = vacunasAnteriores === "si" ? fechaUltimaVacuna : null;
      }

      if (tipo === "DESPARASITACION") {
        bodyData.fechaDesparasitacionAnterior = desparasitadoAnterior === "si" 
          ? fechaDesparasitacionAnterior 
          : null;
      }

      const response = await fetch("http://localhost:5006/api/agendar-cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();
      setMensaje(response.ok ? "✅ Cita agendada" : `❌ ${data.error || 'Error desconocido'}`);
      setTimeout(() => setMensaje(""), 3000);
      
      if (response.ok) {
        setVacunasAnteriores("");
        setDesparasitadoAnterior("");
        setFechaVacuna("");
        setFechaDesparasitacion("");
        setVacunasExistentes([]);
        setVacunasFaltantes([]);
      }
    } catch (error) {
      setMensaje("❌ Error de conexión");
    }
  };

  const FormularioVacunacion = () => (
    <div className="formulario-cita">
      <h3>📋 Formulario de Vacunación</h3>
      {selectedMascota ? (
        <div className="grupo">
          <label>Mascota:</label>
          <span>{mascotas.find((m) => m.id === selectedMascota)?.nombre}</span>
        </div>
      ) : (
        <p>Selecciona una mascota</p>
      )}
      
      <div className="grupo">
        <label>¿Vacunas anteriores?</label>
        <select
          value={vacunasAnteriores}
          onChange={(e) => {
            setVacunasAnteriores(e.target.value);
            setVacunasExistentes([]);
          }}
        >
          <option value="">Seleccionar</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      </div>

      {vacunasAnteriores === "si" && (
        <div className="grupo">
          <label>Fecha última vacunación:</label>
          <input
            type="date"
            value={fechaUltimaVacuna}
            onChange={(e) => setFechaUltimaVacuna(e.target.value)}
            required
          />
        </div>
      )}

      <div className="grupo">
        <label>Vacunas pendientes:</label>
        <div className="checkbox-group">
          {vacunasPredefinidas.map((vacuna) => (
            <label key={vacuna}>
              <input
                type="checkbox"
                checked={vacunasFaltantes.includes(vacuna)}
                onChange={(e) => {
                  const updated = e.target.checked
                    ? [...vacunasFaltantes, vacuna]
                    : vacunasFaltantes.filter((v) => v !== vacuna);
                  setVacunasFaltantes(updated);
                }}
              />
              {vacuna}
            </label>
          ))}
        </div>
      </div>

      <div className="grupo">
        <label>Fecha próxima vacunación:</label>
        <input
          type="date"
          value={fechaVacuna}
          onChange={(e) => setFechaVacuna(e.target.value)}
          required
        />
      </div>
      <button className="btn-enviar" onClick={() => agendarCita("VACUNACION")}>
        Confirmar Vacunación
      </button>
    </div>
  );

  // Se asume que FormularioDesparasitacion se mantiene igual
  const FormularioDesparasitacion = () => (
    <div className="formulario-cita">
      <h3>📋 Formulario de Desparasitación</h3>
      {selectedMascota ? (
        <div className="grupo">
          <label>Mascota:</label>
          <span>{mascotas.find((m) => m.id === selectedMascota)?.nombre}</span>
        </div>
      ) : (
        <p>Selecciona una mascota</p>
      )}
      <div className="grupo">
        <label>¿Se ha desparasitado antes?</label>
        <select
          value={desparasitadoAnterior}
          onChange={(e) => setDesparasitadoAnterior(e.target.value)}
        >
          <option value="">Seleccionar</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      </div>
      {desparasitadoAnterior === "si" && (
        <div className="grupo">
          <label>Fecha anterior de desparasitación:</label>
          <input
            type="date"
            value={fechaDesparasitacionAnterior}
            onChange={(e) => setFechaDesparasitacionAnterior(e.target.value)}
          />
        </div>
      )}
      <div className="grupo">
        <label>Fecha de desparasitación:</label>
        <input
          type="date"
          value={fechaDesparasitacion}
          onChange={(e) => setFechaDesparasitacion(e.target.value)}
          required
        />
      </div>
      <button className="btn-enviar" onClick={() => agendarCita("DESPARASITACION")}>
        Confirmar Desparasitación
      </button>
    </div>
  );

  return (
    <div className="contenedor-principal">
      <div className="seccion-izquierda">
        <h2>Agendar Citas</h2>
        <div className="botones-cita">
          <button
            onClick={() => {
              setMostrarFormVacuna(!mostrarFormVacuna);
              setMostrarFormDespara(false);
            }}
          >
            🩺 Citar Vacunación
          </button>
          <button
            onClick={() => {
              setMostrarFormDespara(!mostrarFormDespara);
              setMostrarFormVacuna(false);
            }}
          >
            💊 Citar Desparasitación
          </button>
        </div>
        {mostrarFormVacuna && <FormularioVacunacion />}
        {mostrarFormDespara && <FormularioDesparasitacion />}
      </div>
      <div className="seccion-derecha">
        <h3>Todas mis mascotas ({mascotas.length})</h3>
        {mascotas.map((m) => (
          <div
            key={m.id}
            className={`tarjeta-mascota ${selectedMascota === m.id ? "selected" : ""}`}
            onClick={() => setSelectedMascota(m.id)}
          >
            <h4>{m.nombre}</h4>
            <p>Última desparasitación: {m.ultimo_dia_desparasitacion || "N/A"}</p>
            <p>Próxima desparasitación: {m.nuevo_dia_desparasitar || "N/A"}</p>
            <p>Última vacunación: {m.ultimo_dia_vacunacion || "N/A"}</p>
            <p>Próxima vacunación: {m.nuevo_dia_vacunacion || "N/A"}</p>
          </div>
        ))}
      </div>
      {mensaje && <div className="mensaje-flotante">{mensaje}</div>}
    </div>
  );
};

export default DesparaYVacuna;
