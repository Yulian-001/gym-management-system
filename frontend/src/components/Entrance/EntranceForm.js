import React from 'react';
import style from './EntranceStyle.css';

function EntranceForm(){

    return (
        <div className='head-E-entrance'
        style={{ 
            borderRadius: '0em 0em 1em 1em',
             marginTop:'0.5rem',
            }}>
                <div className='head-E-container'>
                    <div className='head-E-'>
                        
                               <h2 className='title-one-entrance' style={{
                                fontSize: '1.4rem',
                                margin: '0em 1em 0em 0em',
                                fontWeight: '600',
                                display:'inline',
                                whiteSpace:'nowrap',
                                color: '#2683ff',
                                paddingRight:'2em',
                              }}>Entra</h2>
                    </div>
                  


                </div>
            
        </div>    
        );
}                          

export default EntranceForm;