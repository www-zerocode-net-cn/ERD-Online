import React from 'react';
import {Button} from "antd";
import * as cache from "@/utils/cache";

export type ConfigProjectProps = {
  project: any;
  type: number;
};

const ConfigProject: React.FC<ConfigProjectProps> = (props) => {


  return (<>
    <Button type="primary" ghost onClick={() => {
      cache.setItem("projectId", props.project.id);
      window.location.href = '/design/table/model';
    }}>
      权限配置
    </Button>
  </>);
}

export default React.memo(ConfigProject)
