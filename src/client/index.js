import React from 'react';
import ReactDOM from 'react-dom';
import App from '../components/App';

ReactDOM.hydrate(<App {...window.__STATE__} />, document.getElementById('root'));
