import './FormErrors.css';

function FormErrors({formErrors, fieldName}) {
    if (formErrors[fieldName].length > 0) {
        return (
            <div id='w'>
                {formErrors[fieldName]}
            </div>
        );
    }else{
        return ('');
    }
}

export default FormErrors;