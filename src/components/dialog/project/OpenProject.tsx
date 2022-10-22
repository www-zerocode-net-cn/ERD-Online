import React from 'react';
import {Button} from "antd";
import * as cache from "@/utils/cache";

export type OpenProjectProps = {
  project: any;
  type: number;
};

const OpenProject: React.FC<OpenProjectProps> = (props) => {


  return (<>
    <Button type="primary" ghost onClick={() => {
      cache.setItem("projectId", props.project.id);
      window.location.href = '/design/table/model';
    }}>
      {props.type === 1 ? "打开模型" : "打开模型"}
    </Button>
  </>);
}

export default React.memo(OpenProject)
