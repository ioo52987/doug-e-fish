import './Message.css';

function Message(props) {
    if (props.formValid === true) {
        return (
            <div className='messageFormat'>
                {props.message}
            </div>
        );
    }
}

export default Message;
