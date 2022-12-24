import {ProFormInstance, ProFormSelect, StepsForm} from '@ant-design/pro-components';
import React, {useRef} from 'react';
import {Button as AntButton, Spin} from 'antd';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import ReverseTable from "@/components/TableTransfer/ReverseTable";


export type DatabaseReverseProps = {};

const ReverseDatabase: React.FC<DatabaseReverseProps> = (props) => {
  const {projectDispatch, dbs, profileSliceState} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    profileSliceState: state.profileSliceState || {},
    dbs: state.project.projectJSON?.profile?.dbs || [],
  }), shallow);


  console.log(27, 'dbs', dbs);
  console.log(28, 'projectDispatch.getCurrentDBName()', projectDispatch.getCurrentDBName());

  const formRef = useRef<ProFormInstance>();

  const {flag, status, loading} = profileSliceState;


  return (<>
    {/*    <ModalForm
      title={<span>解析已有数据源<span style={{color: "red"}}>（暂时不支持索引解析生成）</span></span>}
      trigger={
        <Button
          key="reverse"
          icon={<MyIcon type="icon-line-height"/>}
          text="数据源逆向解析"
          minimal={true}
          small={true}
          fill={true}
          alignText={Alignment.LEFT}></Button>
      }
      onFinish={async () => {
        return projectDispatch.getSelectedEntity();
      }}
    >*/}
    <span>解析已有数据源<span style={{color: "red"}}>（暂时不支持索引解析生成）</span></span>
    <StepsForm
      formRef={formRef}
      formProps={{
        validateMessages: {
          required: '此项为必填项',
        },
      }}
      submitter={{
        render: (props) => {
          if (props.step === 0) {
            return (
              <AntButton type="primary" onClick={() => props.onSubmit?.()}>
                下一步 {'>'}
              </AntButton>
            );
          }

          if (props.step === 1) {
            return [
              <AntButton type="primary" key="gotoTwo" onClick={() => props.onPre?.()}>
                {'<'} 上一步
              </AntButton>,
              <AntButton type="primary" key="goToTree" onClick={() => projectDispatch.getSelectedEntity()}>
                提交
              </AntButton>,
            ];
          }

          return [
            <AntButton type="primary" key="gotoTwo" onClick={() => props.onPre?.()}>
              {'<'} 上一步
            </AntButton>,
            <AntButton type="primary" key="goToTree" onClick={() => projectDispatch.getSelectedEntity()}>
              提交
            </AntButton>,
          ];
        },
      }}
    >
      <StepsForm.StepForm
        name="database"
        title="选择数据源"
        onFinish={async () => {
          const fieldsValue = formRef.current?.getFieldsValue();
          console.log(82, fieldsValue);
          const db = dbs.filter((d: any) => d.name === fieldsValue?.currentDB)[0];
          projectDispatch.dbReverseParse(db, fieldsValue?.dataFormat);
          return true;
        }}
      >
        <ProFormSelect
          name="currentDB"
          label="请选择需要解析的数据源："
          width="md"
          rules={[{required: true}]}
          initialValue={projectDispatch.getCurrentDBName()}
          request={async () => dbs.map((db: any) => {
            return {label: db.name, value: db.name}
          })}
        />
        <ProFormSelect
          name="dataFormat"
          label="逻辑名格式："
          width="md"
          rules={[{required: true}]}
          initialValue={"DEFAULT"}
          request={async () => [
            {label: '不处理', value: 'DEFAULT'},
            {label: '全大写', value: 'UPPERCASE'},
            {label: '全小写', value: 'LOWCASE'},
          ]}
        />
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="parse"
        title="解析数据源"
        onFinish={async () => {
          console.log(formRef.current?.getFieldsValue());
          return true;
        }}

      >
        <Spin tip="正在解析数据源，请稍后。。。(请勿关闭当前弹窗！)" spinning={loading}>

            {
              !flag && (status === 'SUCCESS' ?
                <ReverseTable/>
                : '解析失败')
            }

        </Spin>
      </StepsForm.StepForm>

    </StepsForm>
    {/*
    </ModalForm>
*/}
  </>);
}

export default React.memo(ReverseDatabase)
