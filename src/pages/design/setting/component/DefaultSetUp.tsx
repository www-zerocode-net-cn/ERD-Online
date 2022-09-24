import React from 'react';
import {ProForm, ProFormFieldSet, ProFormText, ProFormUploadButton} from "@ant-design/pro-form";
import * as cache from "@/utils/cache";
import {Button, message} from "antd";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";


export type DefaultSetUpProps = {};

const DefaultSetUp: React.FC<DefaultSetUpProps> = (props) => {
  const projectId = cache.getItem('projectId');

  const {projectDispatch, profile} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    profile: state.project?.projectJSON?.profile
  }), shallow);


  return (<>
    <ProForm
      initialValues={profile}
      onFinish={async (values: any) => {
        console.log(35, values);
        await projectDispatch.updateProfile(values);
        return true;
      }}
    >
      <ProFormText.Password
        width="lg"
        label="ERD秘钥"
        extra='仅用于ERD导入导出加密解密'
        name="erdPassword"
        placeholder="默认为ERDOnline"
      />
      <ProFormText
        width="lg"
        name="sqlConfig"
        label="SQL分隔符"
        extra='分隔每条往数据库执行的SQL'
        placeholder="默认为/*SQL@Run*/"
        formItemProps={{
          rules: [
            {
              max: 100,
              message: '不能大于 100 个字符',
            },
          ],
        }}
      />
      <ProFormFieldSet
        label="WORD模板配置"
        extra="默认为系统自带的模板，如需修改，请先下载，再重新上传模板文件"
      >
        <ProFormUploadButton
          max={1}
          name="wordTemplateConfig"
          fieldProps={{
            name: 'file',
            headers: {
              Authorization: 'Bearer 1'
            },
            onChange: (e) => {
              if (e.file.status == 'done') { //上传完成时
                console.log(83, 'e.file', e);
                if (e.file.response.code == 200) {
                  projectDispatch.updateWordTemplateConfig(e.file.response.data);
                } else {
                  message.error(e.file.response.msg ?? '上传失败')
                }
              } else if (e.file.status == 'error') { //上传错误时
                message.error('上传失败')
              }
              //status状态：'error' | 'success' | 'done' | 'uploading' | 'removed';
            },
          }}
          action={`${API_URL}/ncnb/doc/uploadWordTemplate/${projectId}`}
        />
        <Button title='下载模板' onClick={() => projectDispatch.downloadWordTemplate()}>下载模板</Button>
      </ProFormFieldSet>
    </ProForm>
  </>);
}

export default React.memo(DefaultSetUp)
