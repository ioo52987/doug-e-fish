import './Message.css';

function Message(props) {
    if (props.formValid === true) {
        return (
            <div className='messageFormat'>
                <p className='success'>{props.message}</p>
            </div>
        );
    }
}

export default Message;
