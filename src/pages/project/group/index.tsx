import {ProList} from '@ant-design/pro-components';
import {message, Space, Tag} from 'antd';
import {useEffect, useState} from "react";
import {pageProject} from "@/utils/save";
import {TeamOutlined, UserOutlined} from "@ant-design/icons";
import AddProject from "@/components/dialog/project/AddProject";
import RenameProject from "@/components/dialog/project/RenameProject";
import RemoveProject from "@/components/dialog/project/RemoveProject";
import OpenProject from "@/components/dialog/project/OpenProject";
import {searchProjects} from "@/pages/project/recent";
import ConfigProject from "@/components/dialog/project/ConfigProject";
import {ProjectListProps} from "@/pages/project/person";


type ProjectItem = {
  id: string;
  projectName: string;
  description: number;
  type: string;
  tags: string;
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
    type: 2,
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
    size={'large'}
    toolbar={{
      menu: {
        items: [
          {
            key: 'group',
            label: <span>团队项目</span>,
          },
        ],
      },
      search: {
        placeholder: '项目名',
        onSearch: (value: string) => {
          searchProjects(fetchProjects, state, value);
        },
      },
      actions: [
        <AddProject fetchProjects={() => fetchProjects(null)} trigger="ant" type={2}/>
      ],
    }}
    rowKey="projectName"
    dataSource={state.projects}
    pagination={{
      pageSize: state.limit,
      total: state.total,
      onChange: (page: number, pageSize: number) => {
        setState({
          ...state,
          page,
          limit: pageSize
        })
      }
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
        render: (_, row) => {

          return (
            <Space size={0}>
              <Tag color={'blue'} key={row.projectName}>
                {row.type === '1' ? <UserOutlined/> : <TeamOutlined/>}
              </Tag>
              {row.tags?.split(",").map((m: string, i: number) => {
                return <Tag color={i % 2 == 0 ? "#5BD8A6" : "blue"} key={m + i}>{m}</Tag>
              })}
            </Space>

          );
        },
        dataIndex: 'type',
        search: false,
      },
      content: {
        dataIndex: 'updateTime',
        render: (text) => (
          <div key="updateTime" style={{color: '#00000073'}}>{text}</div>
        ),
      },
      actions: {
        render: (text, row) => [
          <ConfigProject project={row} type={2} key={'ConfigProject' + row.id}/>,
          <OpenProject project={row} key={'OpenProject' + row.id}/>
        ],
        search: false,
      },
    }}
  />
};
