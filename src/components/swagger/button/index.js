import React from 'react';
import {Button, Dropdown} from "antd";
import DownOutlined from "@ant-design/icons/es/icons/DownOutlined";

export default class SwaggerButton extends React.Component {
    render() {
        const {type,title, overlay, text} = this.props;
        return (
            <Button type={type} style={{fontSize: "20px", color: "#333333"}} title={title}>
                <Dropdown overlay={overlay} trigger={['click']}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        {text} <DownOutlined/>
                    </a>
                </Dropdown>
            </Button>
        );
    }
}
