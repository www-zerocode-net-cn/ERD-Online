import React from 'react';
import ReactDOM from 'react-dom';
import Loading from './app/Loading';

function initComponent() {
  ReactDOM.render(<Loading />, document.getElementById('app'));
}

initComponent();
