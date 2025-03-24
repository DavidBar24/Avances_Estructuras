import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Login from "./login-register/login";
import Register from "./login-register/register";
import { default as RegistrarM, default as Service } from "./servicios/service";
import Veterinaria from "./veterinaria";
import DesparaYVacuna from "./servicios/DesparaYVacuna";

function App() {


  
  return (
    <Router>
      
      
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/veterinaria" element={<Veterinaria />} />
        <Route path="/servicios/service.js" element={<Service />} />
        <Route path = "/Registrar-Mascota" element={<RegistrarM/>}/>
        <Route path="/desparasitacion-vacunacion" element={<DesparaYVacuna/>}/>
      </Routes>
    </Router>

    
  );
  
}

export default App;
