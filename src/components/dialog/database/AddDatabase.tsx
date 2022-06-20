import React, {useEffect, useState} from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import ProForm, {ModalForm, ProFormCheckbox, ProFormRadio, ProFormText} from '@ant-design/pro-form';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Divider} from '@mui/material';
import _ from "lodash";
import CodeEditor from "@/components/CodeEditor";
import {RadioChangeEvent} from "antd/lib/radio/interface";

export type AddDatabaseProps = {
  moduleDisable: boolean;
};

const AddDatabase: React.FC<AddDatabaseProps> = (props) => {
  const {projectDispatch, database, currentDatabaseIndex} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    database: state.project.projectJSON.dataTypeDomains?.database || [],
    currentDatabaseIndex: state.currentDatabaseIndex
  }), shallow);

  const [selectTab, setSelectTab] = useState('createTableTemplate');
  const [template, setTemplate] = useState({});

  useEffect(() => {
    // @ts-ignore
    setTemplate(database[currentDatabaseIndex]);
  });

  const onChange = (e: any, value: any, tab: any) => {
    console.log(48, value);
    console.log(49, tab);
    setTemplate({
      ...template,
      [tab]: value
    })
    console.log(55, template);
  };


  return (<>
    <ModalForm
      title="新增数据源"
      layout="horizontal"
      trigger={
        <Button icon="add"
                text={"新增数据源"}
                minimal={true}
                small={true}
                fill={true}
                alignText={Alignment.LEFT}
                disabled={props.moduleDisable}></Button>
      }
      onFinish={async (values: any) => {

        console.log(42, values);
        await projectDispatch.addDatabase({
          ...template,
          code: values.code,
          defaultDatabase: values.defaultDatabase,
          fileShow: values.fileShow,
        });
      }}
    >
      <ProFormText
        width="md"
        name="code"
        label="数据源名称"
        placeholder="请输入数据源名称"
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
      <Divider>配置选项</Divider>
      <ProForm.Group>
        <ProFormCheckbox
          name="defaultDatabase"
          label="设为默认数据源"
          tooltip="勾选此项，将会在数据表和关系图中显示默认数据源的数据类型"
        />
        <ProFormCheckbox
          name="fileShow"
          label="生成至文档"
          tooltip="勾选此项，将会在生成的文档中显示该数据源所对应的字段类型"
        />
      </ProForm.Group>
      <Divider>模板配置</Divider>
      <ProForm.Group>
        <ProFormRadio.Group
          name="radio"
          radioType="button"
          initialValue={selectTab}
          fieldProps={{
            onChange: (e: RadioChangeEvent) => setSelectTab(e.target.value)
          }}
          options={[
            {
              label: '创建表',
              value: 'createTableTemplate',
            },
            {
              label: '删除表',
              value: 'deleteTableTemplate',
            },
            {
              label: '重建表',
              value: 'rebuildTableTemplate',
            },
            {
              label: '添加字段',
              value: 'createFieldTemplate',
            },
            {
              label: '修改字段',
              value: 'updateFieldTemplate',
            },
            {
              label: '删除字段',
              value: 'deleteFieldTemplate',
            },
            {
              label: '创建索引',
              value: 'createIndexTemplate',
            },
            {
              label: '删除索引',
              value: 'deleteIndexTemplate',
            },
            {
              label: '创建主键',
              value: 'createPkTemplate',
            },
            {
              label: '删除主键',
              value: 'deletePkTemplate',
            },
            {
              label: '表注释',
              value: 'updateTableComment',
            },
          ]}
        />
      </ProForm.Group>
      <ProFormText
        label="模板配置"
      >
        <CodeEditor
          mode='mysql'
          // @ts-ignore
          value={_.get(template, selectTab, '')}
          onChange={(value: string, event?: any) => onChange(event, value, selectTab)}
        />
      </ProFormText>
    </ModalForm>
  </>);
}

export default React.memo(AddDatabase)
