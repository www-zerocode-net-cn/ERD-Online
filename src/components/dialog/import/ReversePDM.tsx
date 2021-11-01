import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import {message} from "antd";


export type ReversePDMProps = {};

const ReversePDM: React.FC<ReversePDMProps> = (props) => {

  const readPDMfile = () => {
    message.warn('此功能正在玩命开发中，敬请期待...');
  };
  return (<>

    <Button
      key="pdm"
      icon={<MyIcon type="icon-PDM"/>}
      text="解析PDM文件"
      minimal={true}
      small={true}
      fill={true}
      alignText={Alignment.LEFT}
      onClick={readPDMfile}
    ></Button>

  </>);
}

export default React.memo(ReversePDM)
