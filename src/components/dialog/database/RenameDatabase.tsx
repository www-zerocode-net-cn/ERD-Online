import React, {Ref, useEffect, useImperativeHandle, useRef, useState} from 'react';
import ProForm, {ModalForm, ProFormCheckbox, ProFormInstance, ProFormRadio, ProFormText} from '@ant-design/pro-form';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Button, Divider} from "@mui/material";
import _ from 'lodash';
import {RadioChangeEvent} from "antd/lib/radio/interface";
import CodeEditor from "@/components/CodeEditor";
import PreviewDatabase from "@/components/dialog/database/PreviewDatabase";

export type RenameDatabaseProps = {
  onRef: Ref<any>;
};

const RenameDatabase: React.FC<RenameDatabaseProps> = (props) => {
  const {
    projectDispatch, database, currentDatabaseIndex
  }
    = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    database: state.project.projectJSON.dataTypeDomains?.database || [],
    currentDatabaseIndex: state.currentDatabaseIndex,
  }), shallow);

  const [selectTab, setSelectTab] = useState('createTableTemplate');
  const [template, setTemplate] = useState({});
  const [modalVisit, setModalVisit] = useState(false);
  const [refreshCheckBox, setRefreshCheckBox] = useState(false);

  console.log('currentDatabaseIndex', 28, currentDatabaseIndex);


  const getInitValue = (params: any) => {
    let initValue = {};
    // @ts-ignore
    initValue = _.assign(initValue, database[params.currentDatabaseIndex]);
    setTemplate(initValue);
    console.log('initValue', 36, initValue);
    return initValue;
  }


  useImperativeHandle(props.onRef, () => ({
    // changeVal 就是暴露给父组件的方法
    setModalVisit: (newVal: boolean) => {
      setModalVisit(newVal);
    }
  }));

  const previewRef = useRef();

  const onTemplateEditorChange = (e: any, value: any, tab: any) => {
    console.log(48, value);
    console.log(49, tab);
    setTemplate({
      ...template,
      [tab]: value
    });
    // @ts-ignore
    previewRef.current.reSetResult();
    console.log(55, template);
  };


  // Ant Form 有个臭毛病，form只会加载一次，state变化不会重新加载，用此解决
  const formRef = useRef<ProFormInstance<any>>();
  useEffect(() => {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formRef && formRef.current?.resetFields();
  }, [currentDatabaseIndex]);

  return (<>
    <ModalForm
      formRef={formRef}
      title="数据源"
      layout="horizontal"
      visible={modalVisit}
      onFinish={async (values: any) => {
        console.log(72, values);
        await projectDispatch.updateDatabase({
          ...template,
          code: values.code,
          defaultDatabase: values.defaultDatabase,
          fileShow: values.fileShow,
        });
        setRefreshCheckBox(!refreshCheckBox);
        return true;
      }}
      params={{'currentDatabaseIndex': currentDatabaseIndex, refreshCheckBox}}
      request={async (params) => {
        return getInitValue(params);
      }}
      onVisibleChange={setModalVisit}
      // 完全自定义整个区域
      submitter={{
        // 完全自定义整个区域
        render: (props, doms) => {
          console.log(props);
          return [
            <PreviewDatabase
              onRef={previewRef}
              selectTab={selectTab}
              template={template}
              setSelectTab={setSelectTab}
              onTemplateEditorChange={onTemplateEditorChange}
            />,
            <Button variant="outlined" color="warning" key="rest"
                    onClick={() => props.form?.resetFields()}>重置</Button>,
            <Button variant="contained" key="submit" onClick={() => props.form?.submit?.()}> 确定 </Button>,
          ];
        },
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
          onChange={(value: string, event?: any) => onTemplateEditorChange(event, value, selectTab)}
        />
      </ProFormText>
    </ModalForm>
  </>);
}

export default RenameDatabase
