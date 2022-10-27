import React, {useRef} from "react";
import {ActionType, ProList} from '@ant-design/pro-components';
import {Button, Popconfirm} from 'antd';
import {get} from "@/services/crud";

type ProjectUser = {
  id: string;
  username: string;
  title: string;
  avatar: string;
  email: string;

};
export type GroupUserProps = {};
const GroupUser: React.FC<GroupUserProps> = (props) => {

  return (<>
    <ProList<ProjectUser>
      toolBarRender={() => {
        return [
          <Button key="3" type="primary">
            添加成员
          </Button>,
        ];
      }}
      search={{
        filterType: 'light',
      }}
      rowKey="id"
      request={async (params = {}) => {
        const result = await get('/ncnb/project/role/users', {
          ...params,
          projectId: '6cd44fa2b90cf6aa94f4f6d83d316774',
          roleId: '1b850e5d9ffc9c4e5b6bb363e835a204',
        });
        return {
          data: result?.data?.records,
          total: result?.data?.total,
          success: result.code === 200
        }
      }

      }
      pagination={{
        pageSize: 6,
      }}
      metas={{
        id: {
          dataIndex: 'id',
          hideInTable: true
        },
        title: {
          dataIndex: 'username',
          title: '用户名',
        },
        avatar: {
          dataIndex: 'avatar',
          search: false,
        },
        description: {
          dataIndex: 'title',
          search: false,
        },
        content: {
          dataIndex: 'email',
          title: '邮箱'
        },
        actions: {
          render: (text, row) => [
            <Popconfirm placement="right" title={"是否将『" + row.username + "』移除"}
                        onConfirm={() => alert(1)}
                        okText="是"
                        cancelText="否">
              <a key="link">
                移除
              </a>
            </Popconfirm>
          ],
          search: false,
        },
      }}
    />
  </>);
};

export default React.memo(GroupUser)
