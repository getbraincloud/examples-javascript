import ReactDOM from 'react-dom/client';

import './index.css';
import App from './App';

import bc from "@braincloud/client";
import "./braincloud.config.js"; // npx @braincloud/client setup

// Augment the global Window type with properties for the brainCloud wrapper.
declare global {
  interface Window {
    _bc: any;
    _bcInit: () => void;
  }
}

// Agument the global window object with the brainCloud wrapper.
window._bcInit = () => {
  window._bc = new bc.BrainCloudWrapper();

  console.log("Initializing brainCloud");

  window._bc.init();
}

// Initialize the brainCloud wrapper.
window._bcInit();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <App />
);
