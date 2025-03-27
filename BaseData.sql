-- Tabla para los clientes (modificada)
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    edad INT,
    password VARCHAR(255) NOT NULL,
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla para las mascotas (sin cambios)
CREATE TABLE mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    especie VARCHAR(50),
    raza VARCHAR(50),
    edad INT,
    id_cliente INT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE
);

-- Tabla para las citas (sin cambios)
CREATE TABLE citas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_hora DATETIME NOT NULL,
    motivo VARCHAR(255),
    id_cliente INT,
    id_mascota INT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id) ON DELETE CASCADE
);

-- Tabla para los tratamientos (sin cambios)
CREATE TABLE tratamientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    costo DECIMAL(10, 2)
);

-- Tabla para registrar los tratamientos realizados a las mascotas (sin cambios)
CREATE TABLE tratamientos_mascotas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_tratamiento INT,
    id_mascota INT,
    fecha_tratamiento DATE,
    FOREIGN KEY (id_tratamiento) REFERENCES tratamientos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id) ON DELETE CASCADE
);

-- Nueva tabla para Vacunación de mascotas
CREATE TABLE vacunacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mascota INT NOT NULL,
    fecha_ultima_vacunacion DATE,
    fecha_proxima_vacunacion DATE,
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id) ON DELETE CASCADE
);

-- Nueva tabla para Desparasitación de mascotas
CREATE TABLE desparasitacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_mascota INT NOT NULL,
    fecha_ultima_desparasitacion DATE,
    fecha_proxima_desparasitacion DATE,
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id) ON DELETE CASCADE
);

ALTER TABLE vacunacion ADD UNIQUE (id_mascota);
ALTER TABLE desparasitacion ADD UNIQUE (id_mascota);

INSERT INTO tratamientos (nombre, descripcion, costo) VALUES
('Rabia', 'Vacuna contra la rabia', 25.00),
('Moquillo canino (DHPP)', 'Vacuna polivalente para perros', 30.00),
('Parvovirus', 'Vacuna contra parvovirus canino', 28.00),
('Leptospirosis', 'Vacuna contra leptospirosis', 27.00),
('Bordetella (Tos de las perreras)', 'Vacuna contra la tos canina', 22.00),
('Influenza canina', 'Vacuna contra influenza canina', 26.00),
('Leishmaniasis', 'Vacuna contra leishmaniasis', 35.00),
('Triple felina', 'Vacuna para panleucopenia, calicivirus y rinotraqueitis', 32.00),
('Leucemia felina (FeLV)', 'Vacuna contra leucemia felina', 34.00),
('Peritonitis Infecciosa Felina (PIF)', 'Vacuna contra PIF', 40.00),
('Giardia', 'Vacuna contra giardiasis', 29.00),
('Coronavirus canino', 'Vacuna contra coronavirus canino', 26.00);