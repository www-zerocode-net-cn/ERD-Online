import React, {useRef} from "react";
import {ActionType, ProList} from '@ant-design/pro-components';
import {message, Popconfirm} from 'antd';
import {del, get} from "@/services/crud";
import {useSearchParams} from "@@/exports";
import {CONSTANT} from "@/utils/constant";
import AddUser from "@/pages/project/group/component/AddUser";
import {Access, useAccess} from "@@/plugin-access";


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
  const access = useAccess();
  const [searchParams] = useSearchParams();

  const actionRef = useRef<ActionType>();
  const projectId = searchParams.get(CONSTANT.PROJECT_ID) || '';

  return (<>
    <ProList<ProjectUser>
      actionRef={actionRef}
      toolBarRender={() => {
        return access.canErdProjectUsersAdd && props.isAdmin ? [] : [
          <AddUser projectId={projectId} roleId={props.roleId} actionRef={actionRef}/>,
        ];
      }}
      search={{
        filterType: 'light',
      }}
      rowKey="id"
      request={
        async (params = {}) => {
          const result = await get('/ncnb/project/group/role/users', {
            ...params,
            projectId: projectId,
            roleId: props.roleId,
          });
          return {
            data: result?.data?.records?.map((m: any) => {
                return {
                  ...m,
                  avatar: m.avatar ? m.avatar : '/logo.svg'
                }
              }
            ),
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
          search: access.canErdProjectRolesSearch && !props.isAdmin
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
          search: access.canErdProjectRolesSearch && !props.isAdmin
        },
        actions: {
          render: (text, row) => props.isAdmin ? [] : [
            <Access
              accessible={access.canErdProjectRoleUsersDel}
              fallback={<></>}
            >
              <Popconfirm placement="right" title={"是否将『" + row.username + "』移除"}
                          onConfirm={() => del("/ncnb/project/group/role/users", {
                            projectId: projectId,
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
            </Access>
          ],
          search: false,
        },
      }}
    />
  </>);
};

export default React.memo(GroupUser)
