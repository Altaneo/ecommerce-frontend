import React, { useEffect } from 'react';
import axios from 'axios';

const SignInButton = ({onClose}) => {
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
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
                    `${apiBaseUrl}/api/auth/verify-phoneUser`,
                    { user_json_url: userJsonUrl,user_json_phone:phone },
                    { withCredentials: true } // Send cookies with the request
                );
                onClose()
            } catch (err) {
                console.error('Error during verification:', err.message);
            }
        };
        return () => {
            // Cleanup the listener function when the component unmounts
            window.phoneEmailListener = null;
        };
    }, []);

    return (
        <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '75px', // Adjust height as needed to center vertically
          margin: '2px auto', // Adds space around the button and centers horizontally
        }}
      >
        <div
          className="pe_signin_button"
          style={{
            maxWidth: '300px', // Prevents button from being too wide
          }}
          data-client-id="12034696732018244242"
        ></div>
      </div>
    );
};

export default SignInButton;
