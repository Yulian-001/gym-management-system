import React from 'react';
import './EntranceStyle.css';

function EntranceForm(){

//! CAMBIAR LOS NOMBRES DE LAS CLASSNAME PORQUE AFECTA A LOS DEMAS CSS
//! ASI QUE AHORA DEBEN SER MÁS DESCRIPTIVOS Y CONSISOS, MANTENIENDO LA NOMENCLATURA
    return (
        <div className='head-container'
        style={{ 
            borderRadius: '0em 0em 1em 1em',
             marginTop:'0.5rem',
            }}>
                <div className='header-button'>
                    <div className='head-border'>
                        
                               <h2 className='TableTitle' style={{
                                fontSize: '1.4rem',
                                margin: '0em 1em 0em 0em',
                                fontWeight: '600',
                                display:'inline',
                                whiteSpace:'nowrap',
                                color: '#2683ff',
                                paddingRight:'2em',
                              }}>Entrada</h2>
                    </div>
                </div>
            
        </div>    
        );
}

export default EntranceForm;