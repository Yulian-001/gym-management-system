import {React, useState} from "react";
import './PlanStyle.css';
import { saveIcon } from '../../icons/index.js';


function PlanUsers(){

    const [ plan, setPlan ] = useState('');
    const handleChange = (e) =>{
        setPlan(e.target.value)
        
    };

    return (
        <div className="plan-container-f" style={{
             backgroundColor:'whitesmoke',
             marginTop:'1rem',
             display:'flex',
             padding:'1rem 2rem',}}>

            <div className="container-plan">
                <h2 className="plan-title">Planes</h2>
                
                <main>
                    <div>
                        <select
                        value={plan}
                        onChange={handleChange}
                        >
                            <option value="Ninguno" disabled hidden>Tipo plan</option>
                            <option value="Mensualidad">Mensualidad</option>
                            <option value="Ticketera">Ticketera</option>
                            <option value= "Día">Día</option>
                        </select>
                        <div>
                            <div>
                                <saveIcon size={40} />
                            </div>
                        </div>

                        
                    </div>
                </main>
            </div>

            
        </div>
    );
}

export default PlanUsers;