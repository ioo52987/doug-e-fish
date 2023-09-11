import { useRef, useState } from 'react';
import "./AboutThisSite.css";
import emailjs from '@emailjs/browser';
import Message from '../../reusable_components/Message/Message.js';

function AboutThisSite() {

    const form = useRef();
    let YOUR_SERVICE_ID = 'doug.e.fishNN@gmail.com';
    let YOUR_TEMPLATE_ID = 'template_j26qvab';
    let YOUR_PUBLIC_KEY = 'hnaI_MVKgRLHhx_NK';
    let [formState, setFormState] = useState(false);

    const sendEmail = (e) => {
        e.preventDefault();
        setFormState(true);
        const delay = 5000 // in milliseconds
        setTimeout(() => {
            window.location.reload(true);
        }, delay)

        emailjs.sendForm(YOUR_SERVICE_ID, YOUR_TEMPLATE_ID, form.current, YOUR_PUBLIC_KEY)
            .then((result) => {
                console.log(result.text);
            }, (error) => {
                console.log(error.text);
            });
    };

    return (
        <div>
            <div className='form-content'>
                <p id='pageTitle'>Welcome!</p>
                This web app is created for people who like to fish in the Greater Hampton Roads Area.
                Our hope is that it is used and enjoyed by everyone who loves all things fishing! <i>Enjoy!</i>
                <br></br>
                <br></br>
                This application's build aim is to serve the community. By design, I intentionally, left out user logins.
                A tool is only as good as its users. I am the utmost believer in community work and would be tickled
                to see it operate swiftly as such. The tool should be easy, efficient, friendly, fun, and intuitive.
                There should not be frivoulous crap or ads ever on this application. It should and will be always
                free for everyone to use! &nbsp;&nbsp;&nbsp;--<i>Property is theft!</i>
                <br></br>
                <br></br>
                <i className="fas fa-envelope"></i>&nbsp;&nbsp;&nbsp;If you have an suggestions for making this a more effective
                or fun tool please shoot us a message via the contact form below. (*powered by emailJS)
                <br></br>
                <br></br>
                <form ref={form} onSubmit={sendEmail} id='emailForm'>
                    <div className="row">
                        <div className="col-xs-3 col-md-3 field">
                            <input
                                type="text"
                                name="user_name"
                                className="form-control"
                                placeholder="Name"
                                required />
                        </div>
                        <div className="col-xs-3 col-md-3 field">
                            <input
                                type="email"
                                name="user_email"
                                className="form-control"
                                placeholder="Email"
                                required />
                        </div>
                    </div> {/* close row */}
                    <div className="row">
                        <div className="col-xs-6 col-md-6 field">
                            <textarea
                                rows="3"
                                type="text"
                                name="message"
                                className="form-control"
                                placeholder="Message"
                                required />
                        </div>
                        <div className="col-xs-2 col-md-2 field">
                            <input className="btn submit-btn" type="submit" value="Send" />
                        </div>
                    </div> {/* close row */}
                    <div className="row">
                        <div className="col-xs-6 col-md-6 field">
                            <Message
                                formValid={formState}
                                message="Success! Thanks for the message!"
                            />
                        </div>
                    </div> {/* close row */}
                </form>
                <br></br>
                <div id='welcome'>Programmers!</div>
                <i className="fab fa-github-alt"></i>&nbsp;&nbsp;&nbsp;Please take a look at the public gitHub repository&nbsp; 
                <a href="https://github.com/ioo52987/doug-e-fish" target="_blank" rel="noopener noreferrer" >here</a>.
                <br></br>
                <i className="fas fa-code-branch"></i>&nbsp;&nbsp;&nbsp;Want to contribute? Checkout a branch and make a pull request!
            </div>
        </div >
    );
}

export default AboutThisSite;