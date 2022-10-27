import {ProCard} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Space, Tabs, Typography} from "antd";
import {PlusCircleTwoTone} from "@ant-design/icons";
import GroupUser from "@/pages/project/group/component/GroupUser";
import GroupPermission from "@/pages/project/group/component/GroupPermission";
import {get} from "@/services/crud";

const {Text, Title} = Typography;


export type GroupSettingProps = {};
const GroupSetting: React.FC<GroupSettingProps> = (props) => {
  const [tab, setTab] = useState('admin');
  const [items, setItems] = useState([]);

  const children = <>
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
          children: <GroupPermission values={{"id": 1}}/>,
        },
      ]}
    />
  </>;

  useEffect(() => {
    get('/ncnb/project/roles', {
      projectId: '6cd44fa2b90cf6aa94f4f6d83d316774',
    }).then(resp => {
      const items = resp?.data?.map((d: { roleName: string; roleCode: string; }) => {
        if (d.roleCode.includes('ADMIN')) {
          setTab(d.roleCode);
        }
        return {
          label: d.roleName,
          key: d.roleCode,
          children: children,
        }
      });
      setItems(items);
    });
  }, []);


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
          items: items,
          onChange: (key) => {
            setTab(key);
          },
        }}
      />
    </div>
  );
};

export default React.memo(GroupSetting)
