import React from 'react';
import style from './EntranceStyle.css';
import { FingerPrintIcon, UserIcon } from '../../icons/index.js';



function EntranceForm(){

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
                    <input className='entrance-input-pw' type='password' placeholder='Inicie con un *'></input>
                  </div>
                  
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