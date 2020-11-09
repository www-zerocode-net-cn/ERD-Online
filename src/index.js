import React from 'react';
import ReactDOM from 'react-dom';
import Loading from './app/Loading';
import ErdLayout from './app/ErdLayout';
import './App.css';

function initComponent() {
    ReactDOM.render(<ErdLayout/>, document.getElementById('app'));
}

initComponent();
