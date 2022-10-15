import React from 'react';
import {Button, Popconfirm} from "antd";
import {deleteProject} from "@/services/project";

export type RemoveProjectProps = {
  fetchProjects: any;
  project: any;

};

const RemoveProject: React.FC<RemoveProjectProps> = (props) => {


  return (<>
    <Popconfirm placement="right" title="删除项目"
                onConfirm={() => deleteProject({
                  id: props.project.id
                }).then(() => {
                  props.fetchProjects();
                })}
                okText="是"
                cancelText="否">
      <Button type="link">删除</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RemoveProject)
