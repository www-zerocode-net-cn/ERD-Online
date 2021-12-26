import ProForm, {
  ModalForm,
  ProFormCheckbox,
  ProFormDatePicker,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  StepsForm
} from '@ant-design/pro-form';
import React, {useRef} from 'react';
import {message} from 'antd';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";


export type DatabaseReverseProps = {};

const ReverseDatabase: React.FC<DatabaseReverseProps> = (props) => {
  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  const formRef = useRef<ProFormInstance>();

  return (<>
    <ModalForm
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

    >
      <StepsForm
        formRef={formRef}
        onFinish={async () => {
          await waitTime(1000);
          message.success('提交成功');
        }}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
      >
        <StepsForm.StepForm
          name="database"
          title="选择数据源"
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            await waitTime(2000);
            return true;
          }}
        >
          <ProFormSelect
            name="db"
            label="请选择需要解析的数据源："
            width="md"
            rules={[{required: true}]}
            fieldProps={{
              labelInValue: true,
            }}
            request={async () => [
              {label: '全大写', value: 'UPPERCASE'},
              {label: '全小写', value: 'LOWCASE'},
              {label: '不处理', value: 'DEFAULT'},
            ]}
          />
          <ProFormSelect
            name="useMode"
            label="逻辑名格式："
            width="md"
            rules={[{required: true}]}
            fieldProps={{
              labelInValue: true,
            }}
            request={async () => [
              {label: '全大写', value: 'UPPERCASE'},
              {label: '全小写', value: 'LOWCASE'},
              {label: '不处理', value: 'DEFAULT'},
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="db1"
          title="获取数据源信息"
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            return true;
          }}
        >
          <ProFormCheckbox.Group
            name="checkbox"
            label="迁移类型"
            width="lg"
            options={['结构迁移', '全量迁移', '增量迁移', '全量校验']}
          />
          <ProForm.Group>
            <ProFormText name="dbname" label="业务 DB 用户名"/>
            <ProFormDatePicker name="datetime" label="记录保存时间" width="sm"/>
            <ProFormCheckbox.Group
              name="checkbox"
              label="迁移类型"
              options={['完整 LOB', '不同步 LOB', '受限制 LOB']}
            />
          </ProForm.Group>
        </StepsForm.StepForm>

      </StepsForm>
    </ModalForm>
  </>);
}

export default React.memo(ReverseDatabase)
