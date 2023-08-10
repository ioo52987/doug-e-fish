import React from 'react';
import './FormErrors.css';

function FormErrors({formErrors, fieldName}) {
    if (formErrors[fieldName].length > 0) {
        return (
            <div id='w'>
                <p>{formErrors[fieldName]}</p>
            </div>
        );
    }else{
        return ('');
    }
}

export default FormErrors;