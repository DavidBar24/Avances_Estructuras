const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


app.use(cors({
    origin: "http://localhost:3000",
    methods: "POST",
    allowedHeaders: ["Content-Type"]
}));

app.use(express.json());

const rutas = require('./rutas'); // Importamos las rutas
app.use('/api', rutas); // Prefijo para las rutas

const PORT = 5006;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
