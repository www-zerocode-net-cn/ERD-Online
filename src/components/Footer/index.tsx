import React from 'react';
import './index.less'

export type FooterProps = {};

const Footer: React.FC<FooterProps> = (props) => {
  return (<><a className="copyright" href="https://erd.zerocode.net.cn/">2021@ERD Online</a></>)
};

export default React.memo(Footer);
