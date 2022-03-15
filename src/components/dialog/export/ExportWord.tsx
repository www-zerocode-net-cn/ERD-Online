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
      key="word"
      icon={<MyIcon type="icon-file-word"/>}
      text="导出Word"
      minimal={true}
      small={true}
      fill={true}
      onClick={() => projectDispatch.exportFile('Word')}
      alignText={Alignment.LEFT}></Button>
  </>);
}

export default React.memo(ExportHTML)
