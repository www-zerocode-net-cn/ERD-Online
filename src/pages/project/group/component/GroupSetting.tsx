import {ProCard} from '@ant-design/pro-components';
import React, {useEffect, useState} from 'react';
import {Space, Tabs, Typography} from "antd";
import GroupUser from "@/pages/project/group/component/GroupUser";
import GroupPermission from "@/pages/project/group/component/GroupPermission";
import {get} from "@/services/crud";
import {CONSTANT} from "@/utils/constant";
import {useSearchParams} from "@@/exports";

const {Text, Title} = Typography;


export type GroupSettingProps = {};
const GroupSetting: React.FC<GroupSettingProps> = (props) => {
  const [tab, setTab] = useState('admin');
  const [items, setItems] = useState([]);
  const [searchParams] = useSearchParams();

  const children = (roleId: string,isAdmin:boolean) => {

    return <>
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            label: <Text strong>用户组成员</Text>,
            key: '1',
            children: <GroupUser roleId={roleId} isAdmin={isAdmin}/>,
          },
          {
            label: <Text strong>权限配置</Text>,
            key: '3',
            children: <GroupPermission values={{"id": 1}}/>,
          },
        ]}
      />
    </>;
  }

  useEffect(() => {
    get('/ncnb/project/roles', {
      projectId: searchParams.get(CONSTANT.PROJECT_ID),
    }).then(resp => {
      const items = resp?.data?.map((d: {
          roleId: string; roleName: string; roleCode: string;
      }) => {
        const isAdmin = d.roleCode.includes('_0');
        if (isAdmin) {
          setTab(d.roleCode);
        }
        return {
          label: d.roleName,
          key: d.roleCode,
          children: children(d.roleId,isAdmin),
        }
      });
      setItems(items);
    });
  }, []);


  return (
    <div>
      <Space size={'large'}>
        <Title level={4}>用户组 </Title>
{/*
        <Title level={3}> <PlusCircleTwoTone/></Title>
*/}
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
