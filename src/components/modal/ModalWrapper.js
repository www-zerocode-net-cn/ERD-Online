import React from 'react';
import ReactDOM from 'react-dom';
import Modal from './Modal';

const openModal = (component, params = {}) => {
  const maskDiv = document.createElement('div');
  document.body.appendChild(maskDiv);
  let comInstance = null;
  const _close = (btn) => {
    const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv);
    if (unmountResult) {
      maskDiv.parentNode.removeChild(maskDiv);
      const { onCancel } = params;
      onCancel && onCancel(btn);
    }
  };
  const _onOk = (btn) => {
    const { onOk } = params;
    onOk && onOk({close: _close}, comInstance, btn);
  };

  class ModalWrapper extends React.Component {
    render() {
      return (
        <Modal
          {...params}
          visible
          onCancel={_close}
          onOk={_onOk}
        >
          {React.cloneElement(component, {
            ref: instance => comInstance = instance,
            onCancel: _close,
          })}
        </Modal>
      );
    }
  }

  ReactDOM.render(
    React.createElement(ModalWrapper),
    maskDiv,
  );
  return {
    close: _close,
    com: comInstance,
  };
};

export default openModal;
