import {Button, Result} from 'antd';
import React from 'react';
import {history} from 'umi';
import 'antd/dist/reset.css';


const NoFoundPage: React.FC = () => (
  <Result
    status="404"
    title="404"
    icon={<img src="/no-found.svg"/>}
    subTitle="抱歉，你访问的页面不存在"
    extra={
      <Button type="primary" onClick={() => history.push('/')}>
        返回首页
      </Button>
    }
  />
);

export default NoFoundPage;
