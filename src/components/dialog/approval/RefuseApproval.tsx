import React from 'react';
import {Button, Popconfirm} from "antd";
import {CloseCircleOutlined} from "@ant-design/icons";
import {EDIT} from "@/services/crud";


export type RefuseApprovalProps = {
  id: string;
  actionRef: any;
};

const RefuseApproval: React.FC<RefuseApprovalProps> = (props) => {
  return (<>
    <Popconfirm placement="right" title={`是否拒绝？`}
                onConfirm={() => EDIT('/ncnb/approval/' + props.id, {
                  approveStatus: 3,
                  approveResult: '请检查后重新发起审批'
                }).then(r => {
                  if (r.code === 200) {
                    props.actionRef?.current?.reload(false);
                  }
                })} okText="是"
                cancelText="否">
      <Button danger key="cancel" size={"small"} type={"link"} icon={<CloseCircleOutlined/>}>拒绝</Button>
    </Popconfirm>
  </>);
}

export default React.memo(RefuseApproval)
