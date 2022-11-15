import React from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {message} from "antd";
import JExcel from "@/pages/JExcel";


export type DefaultFieldProps = {};

// Empty validator
export const emptyValidator = (value: any, callback: any) => {
  if (!value || value.length === 0) {
    console.log('false');
    message.error("当前编辑项不允许为空");
    callback(false);
  } else {
    console.log('true');
    callback(true);
  }
};

export const column1 = [
  {
    title: '中文名*',
    name: 'chnname',
    type: 'text',
    width: '100',
  }, {
    title: '英文名*',
    name: 'name',
    type: 'text',
    width: '100'
  },];

export const column2 = [
  {
    title: '类型(code)',
    name: 'type',
    type: 'text',
    width: '100',
    readOnly: true
  }, {
    title: '数据源类型',
    name: 'dataType',
    type: 'text',
    width: '130',
    readOnly: true
  }, {
    title: '说明',
    name: 'remark',
    type: 'text',
    width: '100',
  }, {
    title: '主键',
    name: 'pk',
    type: 'checkbox',
    width: '50',
  }, {
    title: '非空',
    name: 'notNull',
    type: 'checkbox',
    width: '50',
  }, {
    title: '自增',
    name: 'autoIncrement',
    type: 'checkbox',
    width: '50',
  }, {
    title: '关系图',
    name: 'relationNoShow',
    type: 'checkbox',
    width: '50',
  }, {
    title: '默认值',
    name: 'defaultValue',
    type: 'text',
    width: '100',
  }, {
    title: 'UI建议',
    name: 'uiHint',
    type: 'dropdown',
    width: '100',
    source: ['Text', 'Number', 'Money', 'Select', 'Radio', 'CheckBox', 'Email', 'URL', 'DatePicker', 'TextArea', 'AddressPicker'],
  }];

const DefaultField: React.FC<DefaultFieldProps> = (props) => {
  const {datatype, projectDispatch} = useProjectStore(state => ({
    datatype: state.project?.projectJSON?.dataTypeDomains?.datatype,
    database: state.project?.projectJSON?.dataTypeDomains?.database,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('datatype', 115, datatype)

  const allDataTypeName = datatype?.map((t: any) => {
    return t.name;
  })

  const defaultJson = JSON.stringify(projectDispatch.getDefaultFields().filter((f: any) => f != null) || []);

  console.log(29, 'defaultJson', defaultJson);
  const data = JSON.parse(defaultJson);


  const afterChange = (payload: any) => {
    console.log(32, 'updateDefaultFields', payload);
    projectDispatch.updateDefaultFields(payload);
  }

  const columns = [
    ...column1, {
      title: '类型*',
      name: 'typeName',
      type: 'dropdown',
      source: allDataTypeName,
      width: '100',
    },
    ...column2
  ];

  return (
    <JExcel data={data} columns={columns} saveData={afterChange} notEmptyColumn={['chnname', 'name', 'typeName']}/>

  )
}

export default React.memo(DefaultField)
