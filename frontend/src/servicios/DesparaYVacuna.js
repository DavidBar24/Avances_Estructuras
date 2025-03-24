import { useState, useEffect } from "react";
import "./estiloDeVa.css";

const DesparaYVacuna = () => {
  const [busqueda, setBusqueda] = useState("");
  const [mascotas, setMascotas] = useState([]);
  const [mostrarFormVacuna, setMostrarFormVacuna] = useState(false);
  const [mostrarFormDespara, setMostrarFormDespara] = useState(false);
  const [vacunasAnteriores, setVacunasAnteriores] = useState("");
  const [desparasitadoAnterior, setDesparasitadoAnterior] = useState("");
  const [vacunasExistentes, setVacunasExistentes] = useState("");
  const [vacunasFaltantes, setVacunasFaltantes] = useState("");
  const [fechaVacuna, setFechaVacuna] = useState("");
  const [fechaDesparasitacion, setFechaDesparasitacion] = useState("");
  const [fechaDesparasitacionAnterior, setFechaDesparasitacionAnterior] = useState("");
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    const obtenerMascotas = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("http://localhost:5006/api/mis-mascotas", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        setMascotas(data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    obtenerMascotas();
  }, []);

  const mascotasFiltradas = mascotas.filter(m =>
    m.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agendarCita = async (tipo) => {
    const fecha = tipo === "VACUNACION" ? fechaVacuna : fechaDesparasitacion;
    if (!fecha) {
      setMensaje("⚠️ Selecciona una fecha");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:5006/api/agendar-cita", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          tipo,
          fecha,
          ...(tipo === "VACUNACION" && { vacunasExistentes, vacunasFaltantes }),
          ...(tipo === "DESPARASITACION" && { fechaDesparasitacionAnterior })
        })
      });

      const data = await response.json();
      setMensaje(response.ok ? "✅ Cita agendada" : `❌ ${data.error}`);
      setTimeout(() => setMensaje(""), 3000);
    } catch (error) {
      setMensaje("❌ Error de conexión");
    }
  };

  const FormularioVacunacion = () => (
    <div className="formulario-cita">
      <h3>📋 Formulario de Vacunación</h3>
      <div className="grupo">
        <label>¿Tiene vacunas anteriores?</label>
        <select value={vacunasAnteriores} onChange={(e) => setVacunasAnteriores(e.target.value)}>
          <option value="">Seleccionar</option>
          <option value="si">Sí</option>
          <option value="no">No</option>
        </select>
      </div>

      {vacunasAnteriores === "si" && (
        <>
          <div className="grupo">
            <label>Vacunas existentes:</label>
            <input
              type="text"
              placeholder="Ej: Rabia, Moquillo"
              value={vacunasExistentes}
              onChange={(e) => setVacunasExistentes(e.target.value)}
            />
          </div>
          <div className="grupo">
            <label>Vacunas faltantes:</label>
            <input
              type="text"
              placeholder="Ej: Parvovirus"
              value={vacunasFaltantes}
              onChange={(e) => setVacunasFaltantes(e.target.value)}
            />
          </div>
        </>
      )}

      <div className="grupo">
        <label>Fecha de vacunación:</label>
        <input
          type="date"
          value={fechaVacuna}
          onChange={(e) => setFechaVacuna(e.target.value)}
          required
        />
      </div>
      <button className="btn-enviar" onClick={() => agendarCita("VACUNACION")}>
        Agendar Vacunación
      </button>
    </div>
  );

  const FormularioDesparasitacion = () => (
    <div className="formulario-cita">
      <h3>📋 Formulario de Desparasitación</h3>
      <div className="grupo">
        <label>¿Se ha desparasitado antes?</label>
        <select value={desparasitadoAnterior} onChange={(e) => setDesparasitadoAnterior(e.target.value)}>
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
        Agendar Desparasitación
      </button>
    </div>
  );

  return (
    <div className="contenedor-principal">
      <div className="seccion-izquierda">
        <h2>Buscar Mi Mascota</h2>
        <input
          type="text"
          placeholder="Nombre de mascota..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <div className="botones-cita">
          <button onClick={() => { setMostrarFormVacuna(!mostrarFormVacuna); setMostrarFormDespara(false); }}>
            🩺 Citar Vacunación
          </button>
          <button onClick={() => { setMostrarFormDespara(!mostrarFormDespara); setMostrarFormVacuna(false); }}>
            💊 Citar Desparasitación
          </button>
        </div>

        {mostrarFormVacuna && <FormularioVacunacion />}
        {mostrarFormDespara && <FormularioDesparasitacion />}
      </div>

      <div className="seccion-derecha">
        <h3>Todas mis mascotas ({mascotas.length})</h3>
        {mascotasFiltradas.map((m) => (
          <div key={m.id} className="tarjeta-mascota">
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