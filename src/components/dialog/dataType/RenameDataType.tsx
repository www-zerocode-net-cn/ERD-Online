import React, {Ref, useEffect, useImperativeHandle, useRef, useState} from 'react';
import ProForm, {ModalForm, ProFormInstance, ProFormText} from '@ant-design/pro-form';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {Divider} from "@mui/material";
import _ from 'lodash';

export type RenameDataTypeProps = {
  onRef: Ref<any>;
};

const RenameDataType: React.FC<RenameDataTypeProps> = (props) => {
  const {
    projectDispatch, database, datatype, currentDataTypeIndex
  }
    = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    database: state.project.projectJSON.dataTypeDomains?.database || [],
    datatype: state.project.projectJSON.dataTypeDomains?.datatype || [],
    currentDataTypeIndex: state.currentDataTypeIndex,
  }), shallow);

  const [apply, setApply] = useState({});
  const [modalVisit, setModalVisit] = useState(false);

  console.log('currentDataTypeIndex', 26, currentDataTypeIndex);

  const allCode = {};

  const getInitValue = (params: any) => {
    let initValue = {};
    // @ts-ignore
    initValue = _.assign(initValue, datatype[params.currentDataTypeIndex]);
    database.forEach((d: any) => {
      // @ts-ignore
      const type = _.get(datatype[params.currentDataTypeIndex], `apply.${d.code}.type`, '');
      _.assign(allCode, {[d.code]: {"type": type}});

      initValue = _.assign(initValue, {[`apply.${d.code}.type`]: type});

    });
    console.log('initValue', 37, initValue);
    return initValue;
  }


  useImperativeHandle(props.onRef, () => ({
    // changeVal 就是暴露给父组件的方法
    setModalVisit: (newVal: boolean) => {
      setModalVisit(newVal);
    }
  }));

  const onChange = (e: any, value: any, db: any) => {
    setApply({
      ...apply,
      [db]: {
        type: e.target.value,
      },
    })
  };

  // Ant Form 有个臭毛病，form只会加载一次，state变化不会重新加载，用此解决
  const formRef = useRef<ProFormInstance<any>>();
  useEffect(() => {
    formRef && formRef.current?.resetFields?.();
  }, [currentDataTypeIndex]);

  return (<>
    <ModalForm
      formRef={formRef}
      title="字段类型"
      visible={modalVisit}
      onFinish={async (values: any) => {
        console.log(39, values);
        await projectDispatch.updateDatatype({
          name: values.name,
          code: values.code,
          apply
        });
        return true;
      }}
      params={{'currentDataTypeIndex': currentDataTypeIndex}}
      request={async (params) => {
        return getInitValue(params);
      }}
      modalProps={{
        onCancel: () => {
          setModalVisit(false);
        }
      }}
      onVisibleChange={setModalVisit}
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

export default RenameDataType
