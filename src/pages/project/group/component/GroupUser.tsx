import React, {useRef} from "react";
import {ProList} from '@ant-design/pro-components';
import {message, Popconfirm} from 'antd';
import {del, get} from "@/services/crud";
import {useSearchParams} from "@@/exports";
import {CONSTANT} from "@/utils/constant";
import AddUser from "@/pages/project/group/component/AddUser";
import {ActionType} from "@ant-design/pro-table";


type ProjectUser = {
  id: string;
  username: string;
  title: string;
  avatar: string;
  email: string;

};
export type GroupUserProps = {
  roleId: string;
  isAdmin: boolean;
};
const GroupUser: React.FC<GroupUserProps> = (props) => {

  const [searchParams] = useSearchParams();

  const actionRef = useRef<ActionType>();

  return (<>
    <ProList<ProjectUser>
      actionRef={actionRef}
      toolBarRender={() => {
        return props.isAdmin ? [] : [
          <AddUser roleId={props.roleId} actionRef={actionRef}/>,
        ];
      }}
      search={{
        filterType: 'light',
      }}
      rowKey="id"
      request={
        async (params = {}) => {
          const result = await get('/ncnb/project/role/users', {
            ...params,
            projectId: searchParams.get(CONSTANT.PROJECT_ID),
            roleId: props.roleId,
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
        title: {
          dataIndex: 'username',
          title: '用户名',
          search: !props.isAdmin
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
          title: '邮箱',
          search: !props.isAdmin

        },
        actions: {
          render: (text, row) => props.isAdmin ? [] : [
            <Popconfirm placement="right" title={"是否将『" + row.username + "』移除"}
                        onConfirm={() => del("/ncnb/project/role/users", {
                          roleId: props.roleId,
                          userIds: [row.id],
                        }).then((r) => {
                          if (r.code === 200) {
                            message.success("移除成功");
                            actionRef.current?.reload();
                          }
                        })
                        }
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
