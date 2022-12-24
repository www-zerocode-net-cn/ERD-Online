import {Button, Result,Image} from 'antd';
import React from 'react';
import {history} from 'umi';
import 'antd/dist/reset.css';


const NoAccessPage: React.FC = () => (
    <Result
      status="403"
      title="403"
      icon={<Image src="/no-access.svg"/>}
      subTitle="抱歉，你无权访问该页面"
      extra={
        <Button type="primary" onClick={() => history.push('/')}>
          返回首页
        </Button>
      }
    />
);

export default NoAccessPage;
