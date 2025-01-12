import React, { useEffect } from 'react';
import axios from 'axios';

const SignInButton = ({onClose}) => {
    useEffect(() => {
        // Load the external script
        const script = document.createElement('script');
        script.src = 'https://www.phone.email/sign_in_button_v1.js';
        script.async = true;
        document.querySelector('.pe_signin_button').appendChild(script);

        // Define the listener function
        window.phoneEmailListener = async function (userObj) {
            const userJsonUrl = userObj.user_json_url;
            const phone= userObj.user_phone_number
            try {
                // Send the user_json_url to the API
                const res = await axios.post(
                    'http://localhost:5000/api/auth/verify-phoneUser',
                    { user_json_url: userJsonUrl,user_json_phone:phone },
                    { withCredentials: true } // Send cookies with the request
                );
                console.log('Verification Successful:', res.data);
                onClose()
            } catch (err) {
                console.error('Error during verification:', err.message);
            }
        };
        console.log(window.phoneEmailListener,'----------userObj')
        return () => {
            // Cleanup the listener function when the component unmounts
            window.phoneEmailListener = null;
        };
    }, []);

    return (
        <div>
            <div
                className="pe_signin_button"
                data-client-id="12034696732018244242"
            ></div>
        </div>
    );
};

export default SignInButton;
