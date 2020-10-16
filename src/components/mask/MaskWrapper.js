import React from 'react';
import ReactDOM from 'react-dom';
import Mask from './index';

const openMask = (component) => {
  const maskDiv = document.createElement('div');
  document.body.appendChild(maskDiv);
  const _close = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(maskDiv);
    if (unmountResult) {
      maskDiv.parentNode.removeChild(maskDiv);
    }
  };
  class MaskWrapper extends React.Component {
    render() {
      return (
        <Mask
          visible
        >
          {React.cloneElement(component, {
            onCancel: _close,
          })}
        </Mask>
      );
    }
  }

  ReactDOM.render(
    <MaskWrapper/>,
    maskDiv,
  );
  return {
    close: _close,
  };
};

export default openMask;
