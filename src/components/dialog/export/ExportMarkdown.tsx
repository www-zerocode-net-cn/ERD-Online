import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";


export type ExportFileProps = {};

const ExportHTML: React.FC<ExportFileProps> = (props) => {
  const {projectDispatch} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
  }), shallow);
  return (<>
    <Button
      key="markdown"
      icon={<MyIcon type="icon-markdown"/>}
      text="导出Markdown"
      minimal={true}
      small={true}
      fill={true}
      onClick={()=>projectDispatch.exportFile('Markdown')}
      alignText={Alignment.LEFT}></Button>
  </>);
}

export default React.memo(ExportHTML)
