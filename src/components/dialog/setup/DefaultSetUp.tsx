import React, {useState} from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {ModalForm, ProFormFieldSet, ProFormSwitch, ProFormText, ProFormUploadButton} from "@ant-design/pro-form";
import ProCard from "@ant-design/pro-card";
import "./index.less";
import DefaultField from "@/components/dialog/setup/DefaultField";
import * as cache from "@/utils/cache";
import {Button as AntButton, message} from "antd";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {GLOBAL_REQUEST_URL} from "@/utils/request";


export type DefaultSetUpProps = {};

const DefaultSetUp: React.FC<DefaultSetUpProps> = (props) => {
  const [tab, setTab] = useState('tab1');
  const projectId = cache.getItem('projectId');

  const {projectDispatch, profile} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    profile: state.project?.projectJSON?.profile
  }), shallow);


  return (<>
    <ModalForm
      title={<span>默认项设置</span>}
      trigger={
        <Button
          key="default"
          icon="code-block"
          text="默认项设置"
          minimal={true}
          small={true}
          fill={true}
          alignText={Alignment.LEFT}></Button>
      }
      initialValues={profile}
      onFinish={async (values: any) => {

        console.log(35, values);
        await projectDispatch.updateProfile(values);
        return true;
      }}
    >
      <ProCard
        tabs={{
          tabPosition: "top",
          activeKey: tab,
          onChange: (key) => {
            setTab(key);
          },
        }}
      >
        <ProCard.TabPane key="tab1" tab="默认字段">
          <DefaultField/>
        </ProCard.TabPane>
        <ProCard.TabPane key="tab2" tab="默认配置">
          <ProFormText.Password
            width="md"
            label="ERD秘钥"
            extra='仅用于ERD导入导出加密解密'
            name="erdPassword"
            placeholder="默认为ERDOnline"
          />
          <ProFormText
            width="md"
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
                    debugger
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
              action={`${GLOBAL_REQUEST_URL}/ncnb/doc/uploadWordTemplate/${projectId}`}
            />
            <AntButton title='下载模板' onClick={() => projectDispatch.downloadWordTemplate()}>下载模板</AntButton>
          </ProFormFieldSet>
          <ProFormSwitch
            name="operationMode"
            label="新手模式"
            extra="开启新手模式，所有菜单均需要一次单击才能打开或关闭"
          />
        </ProCard.TabPane>
      </ProCard>
    </ModalForm>
  </>);
}

export default React.memo(DefaultSetUp)
