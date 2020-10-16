import React from 'react';

import Icon from '../icon';

class Button extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      selectBorder: '1px solid #0784DE',
      selectColor: '#E3F1FA',
      defaultBorder: '1px solid #ADADAD',
      defaultColor: '#E3E3E3',
      loading: props.loading,
    };
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.loading !== this.props.loading) {
      this.setState({
        loading: nextProps.loading,
      });
    }
  }
  _setLoading = (flag) => {
    this.setState({
      loading: flag,
    });
  };
  _onClick = () => {
    const { onClick } = this.props;
    onClick && onClick({
      setLoading: this._setLoading,
    });
  };

  _mouseOver = () => {
    this.setState({
      defaultBorder: this.state.selectBorder,
      defaultColor: this.state.selectColor,
    });
  };

  _mouseOut = () => {
    this.setState({
      defaultBorder: '1px solid #ADADAD',
      defaultColor: '#E3E3E3',
    });
  };

  render() {
    const { loading } = this.state;
    const { type, children, style, icon, title } = this.props;
    return (<button
      disabled={loading}
      title={title}
      onClick={this._onClick}
      onMouseOver={this._mouseOver}
      onMouseOut={this._mouseOut}
      style={{
        ...style,
        userSelect: 'none',
        cursor: 'pointer',
        paddingLeft: 20,
        paddingRight: 20,
        border: type === 'primary' ? this.state.selectBorder : this.state.defaultBorder,
        backgroundColor: type === 'primary' ? this.state.selectColor : this.state.defaultColor,
        outline: 'none',
      }}
    >
      {loading && <Icon className='anticon-spin' type='loading1' style={{marginRight: 5}}/>}
      {icon && <Icon type={icon} style={{marginRight: 5}}/>}
      {children}
    </button>);
  }
}

export default Button;
