import React from 'react';

import openModal from './ModalWrapper';
import Button from '../button/Button';
import Icon from '../icon';

export const error = ({title, message, width, footer}) => {
  let modal = null;
  const onOk = () => {
    modal && modal.close();
  };
  modal = openModal(<div style={{textAlign: 'center', paddingBottom: 10}}>{message}</div>,
    {
      title: <span><Icon type="closecircle" style={{color: 'red', marginRight: 5}}/>{title}</span>,
      customerIcon: true,
      footer: footer || [<Button key="ok" onClick={onOk} type="primary">确定</Button>],
      width,
      zIndex: 999,
      autoFocus: true,
    });
  return modal;
};

export const success = ({title, message, width, footer}) => {
  let modal = null;
  const onOk = () => {
    modal && modal.close();
  };
  modal = openModal(<div style={{textAlign: 'center', paddingBottom: 10}}>{message}</div>,
    {
      title: <span><Icon type="checkcircle" style={{color: 'green', marginRight: 5}}/>{title}</span>,
      customerIcon: true,
      footer: footer || [<Button key="ok" onClick={onOk} type="primary">关闭</Button>],
      width,
      zIndex: 999,
      autoFocus: true,
    });
  return modal;
};

export const confirm = ({title, message, width, onOk, onCancel, footer}) => {
  let modal = null;
  const onOKClick = () => {
    onOk(modal);
  };
  const onCancelClick = () => {
    modal && modal.close();
    onCancel && onCancel();
  };
  modal = openModal(<div style={{textAlign: 'center', paddingBottom: 10}}>{message}</div>,
    {
      title: <span><Icon type="infocirlce" style={{color: '#FFCE43', marginRight: 5}}/>{title}</span>,
      customerIcon: true,
      footer: footer || [
        <Button key="ok" onClick={onOKClick} type="primary" style={{marginRight: 10}}>确定</Button>,
        <Button key="cancel" onClick={onCancelClick}>取消</Button>,
      ],
      width,
      zIndex: 999,
    });
  return modal;
};
