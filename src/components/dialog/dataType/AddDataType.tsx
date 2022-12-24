import React, {useState} from 'react';
import {ProForm, ModalForm, ProFormText} from '@ant-design/pro-components';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Divider} from '@mui/material';
import _ from "lodash";
import {PlusOutlined} from "@ant-design/icons";
import {Button} from "antd";

export type AddDataTypeProps = {
  moduleDisable: boolean;
};

const AddDataType: React.FC<AddDataTypeProps> = (props) => {
  const {projectDispatch, database} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    database: state.project.projectJSON.dataTypeDomains?.database || [],

  }), shallow);


  const allCode = {};
  database.forEach((d: any) => {
    _.assign(allCode, {[d.code]: {"type": ""}});
  });


  const emptyDataType = {
    "name": "",
    "code": "",
    "apply": allCode || {}
  }

  const [apply, setApply] = useState(allCode);


  const onChange = (e: any, value: any, db: any) => {
    setApply({
      ...apply,
      [db]: {
        type: e.target.value,
      },
    })
  };

  return (<>
    <ModalForm
      title="新增字段类型"
      trigger={
        <Button icon={<PlusOutlined />}
                type="text"
                size={"small"}
                disabled={props.moduleDisable}>新增字段类型</Button>
      }
      onFinish={async (values: any) => {

        console.log(47, values);
        console.log(59, apply);
        await projectDispatch.addDatatype({
          ...emptyDataType,
          name: values.name,
          code: values.code,
          apply
        });
        return true;
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name="name"
          label="名称"
          placeholder="请输入名称"
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
        <ProFormText
          width="md"
          name="code"
          label="代码"
          placeholder="请输入代码"
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
      </ProForm.Group>
      <Divider>数据源类型</Divider>
      <ProForm.Group>
        {database.map((d: any) => {
          return <ProFormText
            key={d.code}
            fieldProps={{
              onChange: e => {
                onChange(e, null, d.code)
              },
            }}
            width="md"
            name={`apply.${d.code}.type`}
            label={d.code}
            placeholder="请输入类型"
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
        })}
      </ProForm.Group>
    </ModalForm>
  </>);
}

export default React.memo(AddDataType)
