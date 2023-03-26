import React from 'react';
import {Button, Popconfirm} from "antd";
import {RotateLeftOutlined} from "@ant-design/icons";
import {EDIT} from "@/services/crud";


export type CancelApprovalProps = {
  id: string;
  actionRef: any;
};

const CancelApproval: React.FC<CancelApprovalProps> = (props) => {
  return (<>
    <Popconfirm placement="right" title={`是否撤销？`}
                onConfirm={() => EDIT('/ncnb/approval/' + props.id, {
                  approveStatus: 2,
                  approveResult: '已撤销',

                }).then(r => {
                  if (r.code === 200) {
                    props.actionRef?.current?.reload(false);
                  }
                })} okText="是"
                cancelText="否">
      <Button key="cancel" size={"small"} type={"link"} icon={<RotateLeftOutlined/>}>撤销</Button>
    </Popconfirm>
  </>);
}

export default React.memo(CancelApproval)
