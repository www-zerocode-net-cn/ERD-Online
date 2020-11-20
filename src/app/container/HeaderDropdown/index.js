import React, {Component} from 'react';
import {Dropdown} from 'antd';

export default class HeaderDropdown extends Component {
    render() {
        const {overlayClassName, ...props} = this.props;
        return (
            <Dropdown {...props} />
        );
    }
}
