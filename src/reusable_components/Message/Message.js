import React from 'react';
import './Message.css';

function Message(props) {
    if (props.formState === true) {
        return (
            <div className='messageFormat'>
                {props.message}
            </div>
        );
    }
}

export default Message;
