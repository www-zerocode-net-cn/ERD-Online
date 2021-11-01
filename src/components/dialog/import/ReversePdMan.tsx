import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import {ModalForm} from '@ant-design/pro-form';
import {InboxOutlined} from '@mui/icons-material';
import Dragger from "antd/es/upload/Dragger";


export type ReversePdManProps = {};

const ReversePdMan: React.FC<ReversePdManProps> = (props) => {
  const prop = {
    multiple: false,
    maxCount: 1,
  };


  return (<>
    <ModalForm
      title={<span>解析已有PdMan文件</span>}
      trigger={
        <Button
          key="pdman"
          icon={<MyIcon type="icon-other_win"/>}
          text="解析PdMan文件"
          minimal={true}
          small={true}
          fill={true}
          alignText={Alignment.LEFT}></Button>
      }

    >
      <Dragger {...prop}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined/>
        </p>
        <p className="ant-upload-text">点击或者拖拽PdMand导出的json文件到此区域以上传</p>
        <p className="ant-upload-hint">
          上传完毕后，系统会自动开始解析；每次仅支持解析一个PdMan文件。
        </p>
      </Dragger>

    </ModalForm>
  </>);
}

export default React.memo(ReversePdMan)
