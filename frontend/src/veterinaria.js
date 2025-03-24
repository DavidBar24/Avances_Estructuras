import { motion } from "framer-motion";
import { Mail, PawPrint, Phone } from "lucide-react";
import React from "react";
import "./veterinaria.css"; // Importar la hoja de estilos

const ButtonLink = ({ children, link }) => (
  <a href={link} className="block">
    <button className="btn-link">
      <PawPrint className="inline-block mr-2" size={24} />
      {children}
    </button>
  </a>
);

const VeterinariaAnimales = () => {
  return (
    <div className="container">
      <header className="header">
        🐾 Veterinaria Amigos Peludos
      </header>
      <nav className="nav">
        <a href="#servicios">Servicios</a>
        <a href="#galeria">Galería</a>
        <a href="#contacto">Contacto</a>
      </nav>
      
      <motion.div className="content">
      <section id="servicios" className="my-8">
          <h2 className="text-3xl font-bold mb-6 text-green-600">Nuestros Servicios</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <ButtonLink link="/desparasitacion-vacunacion">Vacunación y desparasitación</ButtonLink>
            <ButtonLink link="/peluqueria-estetica">Peluquería y estética canina y felina</ButtonLink>
            <ButtonLink link="/consulta-informacion">Informacion de tu mascota </ButtonLink>
            <ButtonLink link = "/registrar-mascota">Registrar Macota</ButtonLink>
          </div>
        </section>
        <section id="galeria" className="section">
          <h2>Galería</h2>
          <div className="gallery">
            {["Perrito.jpg", "imagen2.jpg", "imagen4.jpg"].map((image, index) => (
              <div key={index} className="gallery-item">
                <img src={`/images/${image}`} alt="Mascota feliz" />
              </div>
            ))}
          </div>
        </section>
        <section id="contacto" className="section">
          <h2>Contacto</h2>
          <p><Mail className="icon" /> contacto@amigospeludos.com</p>
          <p><Phone className="icon" /> +123 456 789</p>
          <button className="btn"  >Agendar Cita</button>
        </section>
      </motion.div>
      <footer className="footer">Veterinaria Amigos Peludos © 2025</footer>
    </div>
  );
};

export default VeterinariaAnimales;