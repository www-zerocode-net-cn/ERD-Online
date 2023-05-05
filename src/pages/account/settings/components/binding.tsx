import {WechatOutlined} from '@ant-design/icons';
import {List, Popover} from 'antd';
import React, {Fragment} from 'react';
import {useRequest} from "@umijs/hooks";
import {GET} from "@/services/crud";
import {BASE_URL} from "@/utils/request";

const BindingView: React.FC = () => {
  const {data: r, loading} = useRequest(() => {
    return GET('/syst/user/settings/basic', {});
  });

  console.log(50, r);

  const getData = () => [
    {
      title: '绑定微信',
      description: r?.data?.wechat_openid ? '已绑定' : '当前未绑定微信账号',
      actions: [<Popover
        content={
          <iframe src={`${BASE_URL}/auth/oauth2/authorization/wechat`}
                  style={{"border": "none"}}
                  scrolling="no" height="400px"
                  sandbox="allow-scripts  allow-top-navigation"/>
        }
        trigger="click"
        placement="left"
      >
        {r?.data?.wechat_openid?'':<a key="Bind">绑定</a>}
      </Popover>],
      avatar: <WechatOutlined className="taobao"/>,
    },

  ];

  return (
    <Fragment>
      <List
        itemLayout="horizontal"
        dataSource={getData()}
        renderItem={(item) => (
          <List.Item actions={item.actions}>
            <List.Item.Meta
              avatar={item.avatar}
              title={item.title}
              description={item.description}
            />
          </List.Item>
        )}
      />
    </Fragment>
  );
};

export default BindingView;
