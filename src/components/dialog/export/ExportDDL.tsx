import React, {useRef} from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import {
  ModalForm,
  ProFormCheckbox,
  ProFormInstance,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  StepsForm
} from "@ant-design/pro-form";
import CodeEditor from "@/components/CodeEditor";
import {Button as MuiButton} from "@mui/material";
import {message} from "antd";
import _ from 'lodash';


export type ExportDDLProps = {};

const ExportDDL: React.FC<ExportDDLProps> = (props) => {

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  const formRef = useRef<ProFormInstance>();
  return (<>


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
      stepsFormRender={(dom, submitter) => {
        return (
          <ModalForm
            title={<span>SQL导出配置</span>}
            trigger={
              <Button
                key="DDL"
                icon={<MyIcon type="icon-DDL"/>}
                text="导出DDL"
                minimal={true}
                small={true}
                fill={true}
                alignText={Alignment.LEFT}></Button>
            }
            // 完全自定义整个区域
            submitter={{
              // 完全自定义整个区域
              render: (props, doms) => {
                console.log(props);
                console.log('submitter', submitter);
                // @ts-ignore
                return _.concat(submitter, [
                  <MuiButton variant="outlined" color="warning" key="rest"
                             onClick={() => props.form?.resetFields()}>重置</MuiButton>,
                  <MuiButton variant="contained" key="submit" onClick={() => props.form?.submit?.()}> 确定 </MuiButton>,
                ]);
              },
            }}
          >
            {dom}
          </ModalForm>
        );
      }}
    >
      <StepsForm.StepForm
        name="database"
        title="选择数据库"
        onFinish={async () => {
          console.log(formRef.current?.getFieldsValue());
          await waitTime(2000);
          return true;
        }}
      >
        <ProFormSelect
          name="db"
          label="数据库："
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
        <ProFormText
          width="md"
          name="name"
          label="导出数据表"
          placeholder="请输入导出数据表"
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
      </StepsForm.StepForm>
      <StepsForm.StepForm
        name="db1"
        title="导出配置"
        onFinish={async () => {
          console.log(formRef.current?.getFieldsValue());
          return true;
        }}
      >
        <ProFormRadio.Group
          name="export"
          label="导出内容"
          options={[
            {
              label: '自定义',
              value: 'customer',
            },
            {
              label: '全部',
              value: 'all',
            },
          ]}
        />
        <ProFormCheckbox.Group
          name="checkbox-group"
          label="自定义导出内容"
          options={['deleteTable', 'createTable', 'createIndex', 'updateComment']}
        />
        <ProFormText
          label="预览"
        >
          <CodeEditor
            mode='mysql'
            // @ts-ignore
            value=""
          />
        </ProFormText>
      </StepsForm.StepForm>

    </StepsForm>
  </>);
}

export default React.memo(ExportDDL)
