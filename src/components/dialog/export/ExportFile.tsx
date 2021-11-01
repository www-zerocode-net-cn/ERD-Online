import React from 'react';
import {ModalForm} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import {Intent} from '@blueprintjs/core';
import {Grid} from "@mui/material";


export type ExportFileProps = {};

const ExportFile: React.FC<ExportFileProps> = (props) => {
  return (<>
    <ModalForm
      title={<span>解析已有PdMan文件</span>}
      trigger={
        <Button
          key="export"
          icon={<MyIcon type="icon-f-export"/>}
          text="导出文档"
          minimal={true}
          small={true}
          fill={true}
          alignText={Alignment.LEFT}></Button>
      }
      submitter={false}
    >
      <Grid container spacing={1}>
        <Grid item xs={4}>
          <Button rightIcon={<MyIcon type="icon-HTML"/>} intent={Intent.PRIMARY} text="导出HTML"/>
        </Grid>
        <Grid item xs={4}>
          <Button rightIcon={<MyIcon type="icon-file-word"/>} intent={Intent.PRIMARY} text="导出WORD"/>
        </Grid>
        <Grid item xs={4}>
          <Button rightIcon={<MyIcon type="icon-markdown"/>} intent={Intent.PRIMARY} text="导出MARKDOWN"/>
        </Grid>
      </Grid>
    </ModalForm>

  </>);
}

export default React.memo(ExportFile)
