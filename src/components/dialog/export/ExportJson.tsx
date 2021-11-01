import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";


export type ExportJsonProps = {};

const ExportJson: React.FC<ExportJsonProps> = (props) => {
  return (<>
    <Button
      key="JSON"
      icon={<MyIcon type="icon-JSON"/>}
      text="导出JSON"
      minimal={true}
      small={true}
      fill={true}
      alignText={Alignment.LEFT}
    ></Button>
  </>);
}

export default React.memo(ExportJson)
