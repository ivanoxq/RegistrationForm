import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import IntakeForm from './App'; // Assuming your form component is the default export from App.js
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3';

const embedTargetId = 'my-embeddable-form'; // The ID used in the HTML snippet
const embedTarget = document.getElementById(embedTargetId);

if (embedTarget) {
  // Mount your React component into the embed target
  const root = ReactDOM.createRoot(embedTarget);
  root.render(
    <React.StrictMode>
      <GoogleReCaptchaProvider reCaptchaKey="6Lfco5orAAAAAEap5ZFVw-6uu0-oX3gp_bSvDFoz">
        <IntakeForm />
      </GoogleReCaptchaProvider>
    </React.StrictMode>
  );
} else {
  // Fallback if not embedded (e.g., for local development)
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(
    <React.StrictMode>
      <GoogleReCaptchaProvider reCaptchaKey="6Lfco5orAAAAAEap5ZFVw-6uu0-oX3gp_bSvDFoz">
        <IntakeForm />
      </GoogleReCaptchaProvider>
    </React.StrictMode>
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
