import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import {message} from "antd";


export type ReverseERWinProps = {};

const ReverseERWin: React.FC<ReverseERWinProps> = (props) => {

  const readPDMfile = () => {
    message.warn('此功能正在玩命开发中，敬请期待...');
  };
  return (<>

    <Button
      key="other_win"
      icon={<MyIcon type="icon-other_win"/>}
      text="解析ERWin文件"
      minimal={true}
      small={true}
      fill={true}
      alignText={Alignment.LEFT}
      onClick={readPDMfile}
    ></Button>
  </>);
}

export default React.memo(ReverseERWin)
