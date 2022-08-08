import { Layout } from 'antd';
import React from 'react';
import './index.less';


const { Header, Footer, Sider, Content } = Layout;

export interface CommonLayoutLayoutProps {
  children: any;
}

const CommonLayout: React.FC<CommonLayoutLayoutProps> = props => {
  const {children} = props;

  return (
    <Layout>
      <Header>Header</Header>
      <Layout hasSider>
        <Sider collapsible collapsedWidth={0}>Sider</Sider>
        <Layout>
          <Layout>
            <Content>{children}</Content>
            <Footer>Footer</Footer>
          </Layout>
          <Sider collapsible collapsedWidth={0} reverseArrow>Sider</Sider>
        </Layout>
      </Layout>
    </Layout>
  )
}
export default React.memo(CommonLayout)
