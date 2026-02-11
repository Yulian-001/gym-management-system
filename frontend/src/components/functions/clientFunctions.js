// src/components/functions/clientFunctions.js

// Simulación de base de datos en memoria
let clientsDB = [
  {
    id: 1,
    Cédula: '112212132',
    Nombre: 'Agustin Rojas',
    Telefono: '3202552456',
    Eps: 'Capital Salud',
    Rh: 'O-',
    Plan: 'Mensualidad',
    Inicio: '2024/05/01',
    vence: '2024/06/03',
    Estado: 'Cancelado',
    Dias: '18'
  },
  {
    id: 2,
    Cédula: '112212133',
    Nombre: 'María González',
    Telefono: '3202552457',
    Eps: 'Sura',
    Rh: 'A+',
    Plan: 'Trimestral',
    Inicio: '2024/05/15',
    vence: '2024/08/15',
    Estado: 'Activo',
    Dias: '15'
  },
  {
   id: 3,
    Cédula: '125405588',
    Nombre: 'Jorge González',
    Telefono: '3502458586',
    Eps: 'saneitas',
    Rh: 'A+',
    Plan: 'tiketera',
    Inicio: '2024/05/15',
    vence: '2024/08/15',
    Estado: 'vencido',
    Dias: '15'
  },
  {
    id: 4,
    Cédula: '112212132',
    Nombre: 'Agustin Rojas',
    Telefono: '3202552456',
    Eps: 'Capital Salud',
    Rh: 'O-',
    Plan: 'Mensualidad',
    Inicio: '2024/05/01',
    vence: '2024/06/03',
    Estado: 'Cancelado',
    Dias: '18'
  },
  {
    id: 5,
    Cédula: '112212133',
    Nombre: 'María González',
    Telefono: '3202552457',
    Eps: 'Sura',
    Rh: 'A+',
    Plan: 'Trimestral',
    Inicio: '2024/05/15',
    vence: '2024/08/15',
    Estado: 'Activo',
    Dias: '15'
  },
  {
   id: 6,
    Cédula: '125405588',
    Nombre: 'Jorge González',
    Telefono: '3502458586',
    Eps: 'saneitas',
    Rh: 'A+',
    Plan: 'tiketera',
    Inicio: '2024/05/15',
    vence: '2024/08/15',
    Estado: 'vencido',
    Dias: '15'
  },
  {
    id: 7,
    Cédula: '112212132',
    Nombre: 'Agustin Rojas',
    Telefono: '3202552456',
    Eps: 'Capital Salud',
    Rh: 'O-',
    Plan: 'Mensualidad',
    Inicio: '2024/05/01',
    vence: '2024/06/03',
    Estado: 'Cancelado',
    Dias: '18'
  },
  {
    id: 8,
    Cédula: '112212133',
    Nombre: 'María González',
    Telefono: '3202552457',
    Eps: 'Sura',
    Rh: 'A+',
    Plan: 'Trimestral',
    Inicio: '2024/05/15',
    vence: '2024/08/15',
    Estado: 'Activo',
    Dias: '15'
  },
  {
   id: 9,
    Cédula: '125405588',
    Nombre: 'Jorge González',
    Telefono: '3502458586',
    Eps: 'saneitas',
    Rh: 'A+',
    Plan: 'tiketera',
    Inicio: '2024/05/15',
    vence: '2024/08/15',
    Estado: 'vencido',
    Dias: '15'
  },
  {
   id:10,
   Cédula: '1122121261',
    Nombre: 'Yulian Soracá',
    Telefono: '3144533850',
    Eps: 'Capital Salud',
    Rh: 'O+',
    Plan: 'Mensualidad',
    Inicio: '2026/05/15',
    vence: '2026/06/15',
    Estado: 'activo',
    Dias: '4'
  }
];


const getNextId = () => {
  if (clientsDB.length === 0) return 1;
  const maxId = Math.max(...clientsDB.map(client => client.id));
  return maxId + 1;
};

//? funcion para ajustar ids despues de eliminar 
const reindexIds = () => {
  clientsDB = clientsDB.map((client, index) => ({
    ...client,
    id: index + 1
  }));
  return clientsDB;
}
// Funciones CRUD para clientes
export const clientFunctions = {
  // Obtener todos los clientes
  getAllClients: () => {
    return [...clientsDB];
  },

  // Obtener cliente por ID
  getClientById: (id) => {
    return clientsDB.find(client => client.id === id);
  },

  // Crear nuevo cliente
  createClient: (clientData) => {
    const newClient = {
      id: getNextId(), // ID único basado en timestamp, autoincrement
      ...clientData,
      Dias: clientData.Dias || '0',
      Estado: clientData.Estado || 'Pendiente',
      Inicio: clientData.Inicio || new Date().toISOString().split('T')[0]
    };
    
    clientsDB.push(newClient);
    return newClient;
  },

  // Actualizar cliente existente
  updateClient: (id, updatedData) => {
    const index = clientsDB.findIndex(client => client.id === id);
    if (index !== -1) {
      clientsDB[index] = { ...clientsDB[index], ...updatedData };
      return clientsDB[index];
    }
    return null;
  },

  //? Eliminar cliente  y reindexar ids
  deleteClient: (id) => {
    const initialLength = clientsDB.length;
    clientsDB = clientsDB.filter(client => client.id !== id);
    
    if (clientsDB.length < initialLength){
      reindexIds();
      return true;
    }
    return false;
  },

  // Buscar clientes
  searchClients: (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === '') return clientsDB;
    const term = searchTerm.toLowerCase().trim();
    
    return clientsDB.filter(client => 
      client.Nombre.toLowerCase().includes(term) ||
      client.Cédula.includes(term) ||
      client.Telefono.includes(term) ||
      client.Eps.toLowerCase().includes(term)
    );
  },

  // Obtener estadísticas
  getStats: () => {
    const total = clientsDB.length;
    const activos = clientsDB.filter(c => c.Estado === 'Activo').length;
    const pendientes = clientsDB.filter(c => c.Estado === 'Pendiente').length;
    const vencidos = clientsDB.filter(c => c.Estado === 'Vencido').length;
    const cancelados = clientsDB.filter(c => c.Estado === 'Cancelado').length;
    
    return { total, activos, pendientes, vencidos, cancelados };
  },

  // Validar datos del cliente
  validateClient: (clientData) => {
    const errors = [];
    
    if (!clientData.Cédula || clientData.Cédula.length < 6) {
      errors.push('La cédula debe tener al menos 6 dígitos');
    }
    
    if (!clientData.Nombre || clientData.Nombre.trim().length < 3) {
      errors.push('El nombre debe tener al menos 3 caracteres');
    }
    
    if (!clientData.Telefono || !/^\d{10}$/.test(clientData.Telefono)) {
      errors.push('El teléfono debe tener 10 dígitos');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};