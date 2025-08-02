// backend/server.js - TODO EN UN ARCHIVO
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// Configuración básica
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/viajes_facturacion')
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.log('❌ Error MongoDB:', err));

// MODELOS (esquemas de la base de datos)
const Viaje = mongoose.model('Viaje', {
  nombre: String,
  destino: String,
  precio: Number,
  duracion: String,
  descripcion: String
});

const Factura = mongoose.model('Factura', {
  numeroFactura: String,
  nombreCliente: String,
  emailCliente: String,
  telefonoCliente: String,
  viaje: { type: mongoose.Schema.Types.ObjectId, ref: 'Viaje' },
  numeroViajeros: Number,
  montoTotal: Number,
  fecha: { type: Date, default: Date.now },
  estado: { type: String, default: 'pendiente' }
});

// DATOS INICIALES (se crean automáticamente)
const crearViajesIniciales = async () => {
  const count = await Viaje.countDocuments();
  if (count === 0) {
    await Viaje.insertMany([
      {
        nombre: 'Cartagena Mágica',
        destino: 'Cartagena, Colombia',
        precio: 850000,
        duracion: '4 días, 3 noches',
        descripcion: 'Ciudad amurallada, playas y historia colonial'
      },
      {
        nombre: 'Eje Cafetero',
        destino: 'Armenia, Pereira',
        precio: 1200000,
        duracion: '5 días, 4 noches',
        descripcion: 'Plantaciones de café y paisajes naturales'
      },
      {
        nombre: 'San Andrés',
        destino: 'San Andrés Islas',
        precio: 1500000,
        duracion: '6 días, 5 noches',
        descripcion: 'Mar de 7 colores y playas paradisíacas'
      }
    ]);
    console.log('✅ Viajes iniciales creados');
  }
};

// RUTAS DE LA API

// 1. Obtener todos los viajes
app.get('/api/viajes', async (req, res) => {
  try {
    const viajes = await Viaje.find();
    res.json(viajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener viajes' });
  }
});

// 2. Crear nueva factura
app.post('/api/facturas', async (req, res) => {
  try {
    const { viajeId, nombreCliente, emailCliente, telefonoCliente, numeroViajeros } = req.body;
    
    // Buscar el viaje
    const viaje = await Viaje.findById(viajeId);
    if (!viaje) {
      return res.status(404).json({ error: 'Viaje no encontrado' });
    }

    // Calcular total
    const montoTotal = viaje.precio * numeroViajeros;

    // Generar número de factura
    const fecha = new Date();
    const numeroFactura = `FAC-${fecha.getFullYear()}${String(fecha.getMonth() + 1).padStart(2, '0')}${String(fecha.getDate()).padStart(2, '0')}-${Math.floor(Math.random() * 1000)}`;

    // Crear factura
    const factura = new Factura({
      numeroFactura,
      nombreCliente,
      emailCliente,
      telefonoCliente,
      viaje: viajeId,
      numeroViajeros,
      montoTotal
    });

    await factura.save();
    await factura.populate('viaje');
    
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear factura' });
  }
});

// 3. Obtener todas las facturas
app.get('/api/facturas', async (req, res) => {
  try {
    const facturas = await Factura.find().populate('viaje');
    res.json(facturas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener facturas' });
  }
});

// 4. Obtener factura por ID
app.get('/api/facturas/:id', async (req, res) => {
  try {
    const factura = await Factura.findById(req.params.id).populate('viaje');
    if (!factura) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json(factura);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener factura' });
  }
});

// INICIAR SERVIDOR
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  crearViajesIniciales();
});