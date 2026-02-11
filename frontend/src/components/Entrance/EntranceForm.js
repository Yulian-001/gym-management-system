import React, { useState, useEffect} from 'react';
import  './EntranceStyle.css';
import { FingerPrintIcon, UserIcon } from '../../icons/index.js';
import { clientFunctions } from '../functions/clientFunctions.js';


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
    if(partNum.length < 8 || partNum < 11){
      setError('Su cédula debe tener entre 8 y 10 digitos ');
      setShowMessage(true);
      setPassword('');
      return false;
    }

    //? === Verificar si existe en la DB ===
    const allClients = clientFunctions.getAllClients();
    const foundClient = allClients.find(
      client => client.Cédula === partNum
    );

    if(!foundClient){
      setError(`Usuario no encontrado: ${partNum}`);
      setShowMessage(true);
      setPassword('');
      return false;
    }

    setError('');
    return foundClient;;
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

  const handleSubmit = () => {

    const result = confirmPassword(password);
    if(result){
      const nameClient = result.Nombre;
      setSucces(`¡Bienvenido ${nameClient} ahora estas un día más cerca de la meta!`);
      setError('');
      setShowMessage(true);
      setPassword('');

    }else {
      setShowMessage(true);
    }
    
  };
  
  const handlekeyPress = (e) => {
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
                      onKeyPress={handlekeyPress}
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