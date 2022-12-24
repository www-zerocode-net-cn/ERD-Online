import React from 'react';
import {ModalForm, ProFormText} from '@ant-design/pro-components';
import shallow from "zustand/shallow";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import useQueryStore from "@/store/query/useQueryStore";
import * as cache from "@/utils/cache";
import {CONSTANT} from "@/utils/constant";
import {useSearchParams} from "@@/exports";

export type AddQueryProps = {
  model: any;
};

const AddQuery: React.FC<AddQueryProps> = (props) => {
  const {queryDispatch} = useQueryStore(state => ({
    queryDispatch: state.dispatch,
  }), shallow);

  const [searchParams] = useSearchParams();
  let projectId = searchParams.get("projectId") || '';
  if (!projectId || projectId === '') {
    projectId = cache.getItem(CONSTANT.PROJECT_ID) || '';
  }


  return (<>
    <ModalForm
      title="新建查询"
      trigger={
        <Button icon={<PlusOutlined/>}
                type="text"
                size={"small"}
        >新建查询</Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        await queryDispatch.addQuery({
          title: values.title,
          isLeaf: true,
          projectId,
          parentId: props.model.isLeaf ? props.model.parentId : props.model.id
        });
        return true;
      }}
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

export default React.memo(AddQuery)
