import React from 'react';
import ReactDOM from 'react-dom';

import Message from './index';
import Icon from '../icon';

const initMessage = ({title, duration = 1000}) => {
  // 判断是否已经有message存在， 如果有需要往下移
  const messageLength = document.querySelectorAll('.pdman-message').length;
  // console.log(messageLength);
  const message = document.createElement('div');
  document.body.appendChild(message);
  ReactDOM.render(<Message style={{top: (messageLength + 1) * 25}}>
    {title}
  </Message>, message);
  setTimeout(() => {
    // 卸载并且删除message
    const unmountResult = ReactDOM.unmountComponentAtNode(message);
    if (unmountResult) {
      message.parentNode.removeChild(message);
    }
  }, duration);
};

export const success = ({title, duration = 2000}) => {
  initMessage({
    title: <span><Icon type="checkcircle" style={{color: 'green', marginRight: 5}}/>{title}</span>,
    duration,
  });
};

export const error = ({title, duration = 2000}) => {
  initMessage({
    title: <span><Icon type="infocirlce" style={{color: '#FFCE43', marginRight: 5}}/>{title}</span>,
    duration});
};

export const warning = ({title, duration = 2000}) => {
  initMessage({
    title: <span><Icon type="closecircle" style={{color: 'red', marginRight: 5}}/>{title}</span>,
    duration,
  });
};
