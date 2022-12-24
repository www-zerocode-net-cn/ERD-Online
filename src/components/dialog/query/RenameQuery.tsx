import React from 'react';
import {ModalForm, ProFormText} from '@ant-design/pro-components';
import shallow from "zustand/shallow";
import {Button} from "antd";
import {EditOutlined} from "@ant-design/icons";
import useQueryStore from "@/store/query/useQueryStore";

export type RenameQueryProps = {
  model: any;
};

const RenameQuery: React.FC<RenameQueryProps> = (props) => {
  const {queryDispatch} = useQueryStore(state => ({
    queryDispatch: state.dispatch,
  }), shallow);


  return (<>
    <ModalForm
      title={props.model.isLeaf ? "重命名查询" : "重命名目录"}
      trigger={
        <Button icon={<EditOutlined/>}
                type="text"
                size={"small"}
        >{props.model.isLeaf ? "重命名查询" : "重命名目录"}</Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        await queryDispatch.renameQuery({
          id:props.model.id,
          title: values.title,
        });
        return true;
      }}
      initialValues={props.model}
    >
      <ProFormText width="md"
                   name="title"
                   label="查询名称"
                   placeholder="请输入查询名称"
                   formItemProps={{
                     rules: [
                       {
                         required: true,
                         message: '不能为空',
                       },
                       {
                         max: 100,
                         message: '不能大于 100 个字符',
                       },
                     ],
                   }}
      />
    </ModalForm>
  </>);
}

export default React.memo(RenameQuery)
