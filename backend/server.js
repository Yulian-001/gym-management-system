 //* Servidor

 const express = require('express');
 const cors = require('cors');
 require('dotenv').config();


 const app = express();
 const PORT = process.env.PORT || 5000


 //? puente

 app.use(cors());
 app.use(express.json());

 //? Rutas de prueba

 app.get('/',(req, res) => {
    res.json({
        message: ' Api del Gym funcionando',
        version: '1.0.0',
        timestamp: new Date().toISOString()

    });
 });

 //? Ruta de verificacion de estado

 app.get('/Api/health', (req,res)=> {
    res.json({
        status: 'Todo bien',
        database: 'PostgreSQL',
        environment: process.env.NODE_ENV
    })
 });

 
 //? Manejo de errores

 app.use((err, req, res, next)=>{
    console.error(err.stack);
    res.status(500).json({error: 'Algo salio mal en el servidor'});
 });

 //? Ruta 404

 app.use('*',(req,res)=>{
    res.status(404).json({ error: 'Ruta no encontrada'});
 });

 app.listen(PORT, ()=>{
    console.log(`Servidor backend corriendo en: http://localhost:${PORT}`);
    console.log(`Environnment: ${process.env.NODE_ENV}`);
 });