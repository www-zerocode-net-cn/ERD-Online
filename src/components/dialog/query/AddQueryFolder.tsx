import React from 'react';
import {ModalForm, ProFormText} from '@ant-design/pro-components';
import shallow from "zustand/shallow";
import {Button} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import useQueryStore from "@/store/query/useQueryStore";
import {useSearchParams} from "@@/exports";
import * as cache from "@/utils/cache";
import {CONSTANT} from "@/utils/constant";

export type AddQueryFolderProps = {
  isRightContext: boolean;
};

const AddQueryFolder: React.FC<AddQueryFolderProps> = (props) => {
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
      title="新建目录"
      trigger={
        <Button icon={<PlusOutlined/>}
                type={props.isRightContext ? "text" : "primary"}
                size={props.isRightContext ? "small" : "middle"}
        >新建目录</Button>
      }
      onFinish={async (values: any) => {
        console.log(39, values);
        await queryDispatch.addQuery({
          title: values.title,
          projectId,
          isLeaf: false
        });
        return true;
      }}
    >
      <ProFormText width="md"
                   name="title"
                   label="目录名称"
                   placeholder="请输入目录名称"
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

export default React.memo(AddQueryFolder)
