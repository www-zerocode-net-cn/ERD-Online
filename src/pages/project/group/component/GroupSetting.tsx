import {ProCard} from '@ant-design/pro-components';
import React, {useState} from 'react';
import {Space, Tabs, Typography} from "antd";
import {PlusCircleTwoTone} from "@ant-design/icons";
import GroupUser from "@/pages/project/group/component/GroupUser";
import GroupPermission from "@/pages/project/group/component/GroupPermission";

const {Text, Title} = Typography;


export type GroupSettingProps = {};
const GroupSetting: React.FC<GroupSettingProps> = (props) => {
  const [tab, setTab] = useState('admin');
  const tabs = <>
    <Tabs
      defaultActiveKey="1"
      items={[
        {
          label: <Text strong>用户组成员</Text>,
          key: '1',
          children: <GroupUser/>,
        },
        {
          label: <Text strong>权限配置</Text>,
          key: '3',
          children: <GroupPermission values={{"id":1}}/>,
        },
      ]}
    />
  </>;

  return (
    <div>
      <Space size={'large'}>
        <Title level={4}>用户组 </Title>
        <Title level={3}> <PlusCircleTwoTone/></Title>
      </Space>
      <br/>
      <ProCard
        tabs={{
          tabPosition: 'left',
          activeKey: tab,
          items: [
            {
              label: `团队所有者`,
              key: 'admin',
              children: tabs,
            },
            {
              label: `团队管理员`,
              key: 'manager',
              children: tabs,
            },
            {
              label: `团队普通成员`,
              key: 'common',
              children: tabs,
            },
          ],
          onChange: (key) => {
            setTab(key);
          },
        }}
      />
    </div>
  );
};

export default React.memo(GroupSetting)
