import {ProList} from '@ant-design/pro-components';
import {Button, message, Tag} from 'antd';
import {useEffect, useState} from "react";
import {pageProject} from "@/utils/save";
import {ProjectListProps} from "@/pages/project/home/component/ProjectList";
import {TeamOutlined, UserOutlined} from "@ant-design/icons";

type ProjectItem = {
  id: number;
  projectName: string;
  description: number;
  type: string;
  updater: string;
  updateTime: string;
  creator: string;
  createTime: string;
};

export default () => {

  const [state, setState] = useState<ProjectListProps>({
    page: 1,
    limit: 6,
    total: 0,
    projects: [],
    order: "createTime"
  });

  const fetchProjects = (params: any) => {
    pageProject(params || state).then(res => {
      if (res) {
        if (res.data) {
          console.log(44, 'projects', res);
          setState({
              ...state,
              total: res.data.total,
              projects: res.data.records?.map((m: any) => {
                  return {
                    ...m,
                    avatar: '/logo.svg'
                  }
                }
              )
            }
          );
        } else {
          message.error('获取项目信息失败');
        }
      }
    });

  }

  useEffect(() => {
    fetchProjects(state);
  }, [state.page, state.order]);

  return <ProList<ProjectItem>
    toolbar={{
      menu: {
        items: [
          {
            key: 'tab1',
            label: <span>最近项目</span>,
          },
        ],
      },
      search: {
        onSearch: (value: string) => {
          fetchProjects(state);
        },
      },
      actions: [
        <Button type="primary" key="primary">
          新建实验
        </Button>,
      ],
    }}
    rowKey="name"
    dataSource={state.projects}
    pagination={{
      pageSize: 8,
    }}
    metas={{
      title: {
        dataIndex: 'projectName',
        title: '项目名称',
      },
      avatar: {
        dataIndex: 'avatar',
        search: false,

      },
      description: {
        dataIndex: 'description',
        search: false,

      },
      subTitle: {
        dataIndex: 'type',
        render: (_, row) => {
          return (
            <Tag key={row.projectName}>
              {row.type === '1' ? <UserOutlined/> : <TeamOutlined/>}
            </Tag>
          );
        },
        search: false,
      },
      actions: {
        render: (text, row) => [
          <a href={row.url} target="_blank" rel="noopener noreferrer" key="view">
            打开
          </a>,
          <a href={row.url} target="_blank" rel="noopener noreferrer" key="link">
            修改
          </a>,
          <a href={row.url} target="_blank" rel="noopener noreferrer" key="warning">
            删除
          </a>,
        ],
        search: false,
      },
    }}
  />
};
