import React from 'react';
import ReactDOM from 'react-dom';
import ErdRouter from './app/ErdRouter';
import './App.css';

function initComponent() {
    ReactDOM.render(<ErdRouter/>, document.getElementById('app'));
}

initComponent();
