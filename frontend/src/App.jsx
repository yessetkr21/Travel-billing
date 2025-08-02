// frontend/src/App.js - TODO EN UN ARCHIVO
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [viajes, setViajes] = useState([]);
  const [facturas, setFacturas] = useState([]);
  const [vistaActual, setVistaActual] = useState('crear'); // 'crear' o 'ver'
  
  // Datos del formulario
  const [viajeSeleccionado, setViajeSeleccionado] = useState('');
  const [nombreCliente, setNombreCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [numeroViajeros, setNumeroViajeros] = useState(1);

  // Cargar viajes cuando se inicia la app
  useEffect(() => {
    cargarViajes();
    cargarFacturas();
  }, []);

  // Función para cargar viajes desde el backend
  const cargarViajes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/viajes');
      const data = await response.json();
      setViajes(data);
    } catch (error) {
      console.log('Error cargando viajes:', error);
      // Si no hay backend, usar datos de ejemplo
      setViajes([
        {
          _id: '1',
          nombre: 'Cartagena Mágica',
          destino: 'Cartagena, Colombia',
          precio: 850000,
          duracion: '4 días, 3 noches',
          descripcion: 'Ciudad amurallada, playas y historia colonial'
        },
        {
          _id: '2',
          nombre: 'Eje Cafetero',
          destino: 'Armenia, Pereira',
          precio: 1200000,
          duracion: '5 días, 4 noches',
          descripcion: 'Plantaciones de café y paisajes naturales'
        },
        {
  _id: '3',
  nombre: 'Aventura en Japón',
  destino: 'Tokio, Kioto, Osaka',
  precio: 9800000,
  duracion: '10 días, 9 noches',
  descripcion: 'Templos antiguos, tecnología moderna y cultura japonesa fascinante'
},
{
  _id: '4',
  nombre: 'Tour por Egipto',
  destino: 'El Cairo, Luxor',
  precio: 5600000,
  duracion: '8 días, 7 noches',
  descripcion: 'Pirámides, templos faraónicos y crucero por el río Nilo'
}

      ]);
    }
  };

  // Función para cargar facturas
  const cargarFacturas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/facturas');
      const data = await response.json();
      setFacturas(data);
    } catch (error) {
      console.log('Error cargando facturas:', error);
      setFacturas([]);
    }
  };

  // Función para crear factura
  const crearFactura = async (e) => {
    e.preventDefault();
    
    const viajeElegido = viajes.find(v => v._id === viajeSeleccionado);
    if (!viajeElegido) {
      alert('Selecciona un viaje');
      return;
    }

    const nuevaFactura = {
      viajeId: viajeSeleccionado,
      nombreCliente,
      emailCliente,
      telefonoCliente,
      numeroViajeros
    };

    try {
      const response = await fetch('http://localhost:5000/api/facturas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaFactura)
      });
      
      if (response.ok) {
        alert('¡Factura creada exitosamente!');
        limpiarFormulario();
        cargarFacturas();
        setVistaActual('ver');
      } else {
        alert('Error al crear factura');
      }
    } catch (error) {
      // Si no hay backend, simular creación
      const facturaSimulada = {
        _id: Date.now(),
        numeroFactura: `FAC-${Date.now()}`,
        nombreCliente,
        emailCliente,
        telefonoCliente,
        viaje: viajeElegido,
        numeroViajeros,
        montoTotal: viajeElegido.precio * numeroViajeros,
        fecha: new Date(),
        estado: 'pendiente'
      };
      
      setFacturas([...facturas, facturaSimulada]);
      alert('¡Factura creada exitosamente!');
      limpiarFormulario();
      setVistaActual('ver');
    }
  };

  // Limpiar formulario
  const limpiarFormulario = () => {
    setViajeSeleccionado('');
    setNombreCliente('');
    setEmailCliente('');
    setTelefonoCliente('');
    setNumeroViajeros(1);
  };

  // Formatear precio en pesos colombianos
  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString('es-CO');
  };

  // Obtener viaje seleccionado
  const viajeElegido = viajes.find(v => v._id === viajeSeleccionado);

  return (
    <div className="app">
      {/* ENCABEZADO */}
      <header className="header">
        <h1>Sistema de Facturación de Viajes</h1>
        <p>Gestiona tus reservas de manera fácil</p>
      </header>

      {/* NAVEGACIÓN */}
      <nav className="nav">
        <button 
          className={vistaActual === 'crear' ? 'active' : ''}
          onClick={() => setVistaActual('crear')}
        >
          📝 Crear Factura
        </button>
        <button 
          className={vistaActual === 'ver' ? 'active' : ''}
          onClick={() => setVistaActual('ver')}
        >
          📋 Ver Facturas ({facturas.length})
        </button>
      </nav>

      <div className="container">
        {/* VISTA CREAR FACTURA */}
        {vistaActual === 'crear' && (
          <div className="create-view">
            <div className="form-section">
              <h2>Nueva Factura</h2>
              
              <form onSubmit={crearFactura}>
                <div className="form-group">
                  <label>👤 Nombre del Cliente:</label>
                  <input
                    type="text"
                    required
                    value={nombreCliente}
                    onChange={(e) => setNombreCliente(e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label>📧 Email:</label>
                  <input
                    type="email"
                    required
                    value={emailCliente}
                    onChange={(e) => setEmailCliente(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>

                <div className="form-group">
                  <label>📱 Teléfono:</label>
                  <input
                    type="tel"
                    required
                    value={telefonoCliente}
                    onChange={(e) => setTelefonoCliente(e.target.value)}
                    placeholder="300 123 4567"
                  />
                </div>

                <div className="form-group">
                  <label>✈️ Seleccionar Viaje:</label>
                  <select
                    required
                    value={viajeSeleccionado}
                    onChange={(e) => setViajeSeleccionado(e.target.value)}
                  >
                    <option value="">-- Selecciona un destino --</option>
                    {viajes.map(viaje => (
                      <option key={viaje._id} value={viaje._id}>
                        {viaje.nombre} - {formatearPrecio(viaje.precio)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>👥 Número de Viajeros:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={numeroViajeros}
                    onChange={(e) => setNumeroViajeros(parseInt(e.target.value))}
                  />
                </div>

                {/* RESUMEN */}
                {viajeElegido && (
                  <div className="summary">
                    <h3>📊 Resumen:</h3>
                    <p><strong>Viaje:</strong> {viajeElegido.nombre}</p>
                    <p><strong>Destino:</strong> {viajeElegido.destino}</p>
                    <p><strong>Precio por persona:</strong> {formatearPrecio(viajeElegido.precio)}</p>
                    <p><strong>Viajeros:</strong> {numeroViajeros}</p>
                    <div className="total">
                      <strong>💰 TOTAL: {formatearPrecio(viajeElegido.precio * numeroViajeros)}</strong>
                    </div>
                  </div>
                )}

                <button type="submit" className="submit-btn">
                  🧾 Generar Factura
                </button>
              </form>
            </div>

            {/* LISTA DE VIAJES DISPONIBLES */}
            <div className="travels-section">
              <h2>Destinos Disponibles</h2>
              <div className="travels-list">
                {viajes.map(viaje => (
                  <div 
                    key={viaje._id} 
                    className={`travel-card ${viajeSeleccionado === viaje._id ? 'selected' : ''}`}
                    onClick={() => setViajeSeleccionado(viaje._id)}
                  >
                    <h3>{viaje.nombre}</h3>
                    <p>📍 {viaje.destino}</p>
                    <p>📅 {viaje.duracion}</p>
                    <p className="description">{viaje.descripcion}</p>
                    <div className="price">{formatearPrecio(viaje.precio)}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VISTA VER FACTURAS */}
        {vistaActual === 'ver' && (
          <div className="invoices-view">
            <h2>Facturas Generadas</h2>
            
            {facturas.length === 0 ? (
              <div className="empty-state">
                <p>📄 No hay facturas creadas aún</p>
                <button onClick={() => setVistaActual('crear')}>
                  Crear primera factura
                </button>
              </div>
            ) : (
              <div className="invoices-list">
                {facturas.map(factura => (
                  <div key={factura._id} className="invoice-card">
                    <div className="invoice-header">
                      <h3>{factura.numeroFactura}</h3>
                      <span className={`status ${factura.estado}`}>
                        {factura.estado}
                      </span>
                    </div>
                    
                    <div className="invoice-details">
                      <p><strong>Cliente:</strong> {factura.nombreCliente}</p>
                      <p><strong>Email:</strong> {factura.emailCliente}</p>
                      <p><strong>Teléfono:</strong> {factura.telefonoCliente}</p>
                      <p><strong>Viaje:</strong> {factura.viaje?.nombre || 'N/A'}</p>
                      <p><strong>Destino:</strong> {factura.viaje?.destino || 'N/A'}</p>
                      <p><strong>Viajeros:</strong> {factura.numeroViajeros}</p>
                      <p><strong>Fecha:</strong> {formatearFecha(factura.fecha)}</p>
                    </div>
                    
                    <div className="invoice-total">
                      <strong>Total: {formatearPrecio(factura.montoTotal)}</strong>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
