import React from 'react';
import {Button, Popconfirm} from "antd";
import {CheckCircleOutlined} from "@ant-design/icons";
import {EDIT} from "@/services/crud";


export type RepeatApprovalProps = {
  id: string;
  actionRef: any;
};

const RepeatApproval: React.FC<RepeatApprovalProps> = (props) => {
  return (<>
    <Popconfirm placement="right" title={`是否复批？`}
                onConfirm={() => EDIT('/ncnb/approval/' + props.id, {
                  approveStatus: 4,
                  approveResult: '正在复批',
                }).then(r => {
                  if (r.code === 200) {
                    props.actionRef?.current?.reload(false);
                  }
                })} okText="是"
                cancelText="否">
      <Button key="cancel" size={"small"} type={"link"} icon={<CheckCircleOutlined/>}>复批</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RepeatApproval)
