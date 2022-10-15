import React from 'react';
import {Button} from "antd";
import * as cache from "@/utils/cache";

export type OpenProjectProps = {
  project: any;

};

const OpenProject: React.FC<OpenProjectProps> = (props) => {


  return (<>
    <Button onClick={() => {
      cache.setItem("projectId", props.project.id);
      window.location.href = '/design/table/model';
    }}>
      打开模型
    </Button>
  </>);
}

export default React.memo(OpenProject)
