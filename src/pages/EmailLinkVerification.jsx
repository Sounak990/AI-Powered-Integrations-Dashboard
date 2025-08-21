// In your EmailVerification.jsx

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiVerifyEmail } from '../services/api'; // Adjust the path as needed
import { useLocation } from 'react-router-dom/dist';

const EmailLinkVerification = () => {
  // const { token } = useParams();
  // console.log("EmailLinkVerification component loaded with token:", token);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  console.log("Current location via EmailLinkVerification.jsx:", location.pathname);
  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await apiVerifyEmail(token);
        console.log(response.data);
        // Navigate to the confirm mail page or show a success message
        navigate('/pages-confirm-mail');
      } catch (error) {
        console.error(error);
        // Handle errors, show messages, etc.
      }
    };

    if (token) {
      verifyEmail();
    }
  }, [token, navigate]);

  // Render component UI
  // ...
};

export default EmailLinkVerification;
