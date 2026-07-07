import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import bc from "@braincloud/client";

// Augment the global Window type with properties for the brainCloud wrapper.
declare global {
  interface Window {
    _bc: any;
    _bcInit: () => void;
  }
}

// Agument the global window object with the brainCloud wrapper.
window._bcInit = () => {
  const API_SERVER_HOST = process.env.REACT_APP_BC_API_TARGET_HOST || "";
  const API_SERVER_PORT = process.env.REACT_APP_BC_API_TARGET_PORT || "";
  const API_SERVER_URL = `https://${API_SERVER_HOST}:${API_SERVER_PORT}`;

  const APP_ID = process.env.REACT_APP_BC_APP_ID || "";
  const APP_SECRET = process.env.REACT_APP_BC_APP_SECRET || "";
  const APP_VERSION = process.env.REACT_APP_BC_APP_VERSION || "";

  window._bc = new bc.BrainCloudWrapper();

  console.log("Initializing brainCloud");

  window._bc.initialize(APP_ID, APP_SECRET, APP_VERSION);

  window._bc.brainCloudClient.setServerUrl(API_SERVER_URL);
}

// Initialize the brainCloud wrapper.
window._bcInit();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
