import React, { useState, useEffect} from 'react';
import  './EntranceStyle.css';
import { FingerPrintIcon, UserIcon } from '../../icons/index.js';

// Simulación de base de datos de entradas en memoria
let entranceHistoryDB = [];

function EntranceForm(){

  const [ password, setPassword] = useState('');
  //? === mensaje error ===
  const [ error, setError ] = useState(''); 
  const [succes, setSucces ] = useState('');
  const[ showMessage, setShowMessage ] = useState(false);

  useEffect(() => {
    if(showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
        setError('');
        setSucces('');

      },5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage]);
  //? === verificar contraseña ===
  const confirmPassword = (inputPasswrod) => {
    if(!inputPasswrod) {
      setError('Ingrese contraseña');
      setShowMessage(true);
      return false;
    }
    //* === verificar si inicia con * ===
    if(inputPasswrod.charAt(0) !== '*'){
      setError('La contraseña debe iniciar con *');
      setShowMessage(true);
      setPassword('');
      return false;
    }
    //* === verificar cedula despues de * ===
    const partNum = inputPasswrod.substring(1);

    if(partNum.length === 0){
      setError('Debe ingresar su cédula después del *');
      setShowMessage(true);
      return false;
    }
    if(!/^\d+$/.test(partNum)){
      setError('Su cédula solo debe ser un número no mayor a 10 digitos');
      setShowMessage(true);
      setPassword('');
      return false;
    }
    //* === Verificar Rango de cedula 10 digitos ===
    if(partNum.length < 8 || partNum.length > 10){
      setError('Su cédula debe tener entre 8 y 10 digitos ');
      setShowMessage(true);
      setPassword('');
      return false;
    }

    //? === Verificar si existe en la API ===
    // Nota: En un futuro, conectar con: 
    // const response = await fetch('http://localhost:3000/Api/clients');
    // Por ahora usamos datos de ejemplo para mantener consistencia
    const foundClient = {
      id: parseInt(partNum),
      cedula: partNum,
      nombre: `Cliente ${partNum}`
    };

    // Validación de prueba: si cédula empieza con 0 no existe
    if(partNum.charAt(0) === '0'){
      setError(`Usuario no encontrado: ${partNum}`);
      setShowMessage(true);
      setPassword('');
      return false;
    }

    setError('');
    return foundClient;
  };

  const handlePasswordChange = (e) => {
    const valor = e.target.value;
    setPassword(valor);

    if(showMessage){
      setShowMessage(false);
      setError('');
      setSucces('');
    }

  };

  const handleSubmit = async () => {

    const result = confirmPassword(password);
    if (!result) {
      setShowMessage(true);
      return;
    }

    // Intentar obtener el cliente real desde el backend por cédula
    let found = null;
    try {
      const clientsResp = await fetch('http://localhost:3001/Api/clients');
      if (clientsResp.ok) {
        const clientsListRaw = await clientsResp.json();
        const clientsList = Array.isArray(clientsListRaw)
          ? clientsListRaw
          : clientsListRaw && clientsListRaw.data ? clientsListRaw.data : [];
        found = clientsList.find(c => String(c.cedula) === String(result.cedula || result.Cédula));
      }
    } catch (e) {
      console.error('Error buscando cliente en backend:', e);
    }

    if (!found) {
      // Mostrar error con la cédula si no existe el usuario
      setError(`Usuario no encontrado: ${result.cedula || result.Cédula}`);
      setShowMessage(true);
      setPassword('');
      return;
    }

    const nameClient = found.nombre || found.Nombre || (result.nombre || result.Nombre) || found.cedula;

    // Guardar registro de entrada
    const entryRecord = {
      id: entranceHistoryDB.length + 1,
      clientId: found.id,
      clientName: nameClient,
      clientCedula: found.cedula || result.cedula || result.Cédula,
      entryTime: new Date(),
      entryType: 'entrada'
    };
    entranceHistoryDB.push(entryRecord);

    setSucces(`¡Bienvenido ${nameClient} ahora estas un día más cerca de la meta!`);
    setError('');
    setShowMessage(true);
    setPassword('');

    // Registrar asistencia permanente en backend
    try {
      const fecha = new Date().toISOString().split('T')[0];
      const hora = new Date().toTimeString().split(' ')[0];
      await fetch('http://localhost:3001/Api/asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: found.id, fecha_asistencia: fecha, hora_entrada: hora })
      });
    } catch (e) {
      console.error('No se pudo registrar asistencia en backend:', e);
    }

  };
  
  const handleKeyDown = (e) => {
    if(e.key === 'Enter') {
      handleSubmit();
    }
  }

    return (
        <div className='head-C-entrance' >
             <div className='head-E-'>
                        
                               <h2 className='title-one-entrance' style={{
                                fontSize: '1.4rem',
                                margin: '0em 1em 0em 0em',
                                fontWeight: '600',
                                display:'inline',
                                whiteSpace:'nowrap',
                                color: '#2683ff',
                                paddingRight:'2em',
                              }}>Entrada</h2>
                    </div>
                <div className='head-E-container'>
                   
                  <div className='entrance-password'>
                    <label className='entrance-label-pw'> Contraseña</label>
              
                    <input className='entrance-input-pw'
                     type='password'
                      placeholder='Inicie con un *'
                      value={password}
                      onChange={handlePasswordChange}
                      id='passwordInput'
                      onKeyDown={handleKeyDown}
                      autoComplete='off'
                     />

                     
                  </div>
                   {showMessage &&  error &&(
                        
                        <div className='entrance-input-error'> 
                          ⚠️ {error}
                        </div>
                      )}


                      {showMessage &&  succes &&(
                        <div className='entrance-input-valid'>
                             ✅ 
                              {succes}
                        </div>
                      )}
                  
                  <div className='entrance-biometry'> 
                    <div className='container-biometry'>
                     <h4 className='biometry-fingerInp'>Foto usuario</h4>
                        <UserIcon className='biometry-E-icon' size={130} style={{ color:'grey'}} />
                     </div>

                     <div className='container-biometry-pf'>
                     <h4 className='biometry-photo'>Huella</h4>
                        <FingerPrintIcon className='biometry-E-icon' size={130} style={{ color:'grey'}} />
                        </div>
                     
                  </div>


                </div>
            
        </div>    
        );
}                          

export default EntranceForm;