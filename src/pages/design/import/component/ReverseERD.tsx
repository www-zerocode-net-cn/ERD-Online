import React from 'react';
import {InboxOutlined} from '@mui/icons-material';
import Dragger from "antd/es/upload/Dragger";
import {message, Modal} from "antd";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import _ from "lodash";


export type ReverseERDProps = {};


export const importModuleAndProfile=(dataSource: any, erdJson:any, resultModules: any, projectDispatch:any)=> {
  console.log(74, dataSource?.dataTypeDomains);
  console.log(74, dataSource?.profile);


  const datatype = _.unionBy(dataSource?.dataTypeDomains?.datatype || {}, erdJson['dataTypeDomains']?.datatype, 'code');
  const database = _.unionBy(dataSource?.dataTypeDomains?.database || {}, erdJson['dataTypeDomains']?.database, 'code');
  _.merge(dataSource?.dataTypeDomains, erdJson['dataTypeDomains']);
  _.set(dataSource?.dataTypeDomains, 'datatype', datatype);
  _.set(dataSource?.dataTypeDomains, 'database', database);

  const defaultFields = _.unionBy(dataSource?.profile?.defaultFields || {}, erdJson['profile']?.defaultFields, 'name');
  const dbs = _.unionBy(dataSource?.profile?.dbs || {}, erdJson['profile']?.dbs, 'name');
  _.merge(dataSource?.profile, erdJson['profile']);
  _.set(dataSource?.profile, 'defaultFields', defaultFields);
  _.set(dataSource?.profile, 'dbs', dbs);


  console.log(74, erdJson['dataTypeDomains']);
  console.log(74, erdJson['profile']);


  console.log(74, dataSource?.dataTypeDomains);
  console.log(74, dataSource?.profile);

  if (resultModules) {
    // @ts-ignore
    resultModules = projectDispatch.fixModules(resultModules, dataSource?.dataTypeDomains?.datatype, dataSource?.dataTypeDomains?.database);
  }

  projectDispatch.setProjectJson({
    modules: (dataSource.modules || []).concat(resultModules),
    dataTypeDomains: dataSource?.dataTypeDomains,
    profile: dataSource?.profile,
  });
  return resultModules;
}

const ReverseERD: React.FC<ReverseERDProps> = (props) => {
  const {projectDispatch, projectJSON} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    projectJSON: state.project.projectJSON || {},
  }), shallow);

  const prop = {
    multiple: false,
    maxCount: 1,
    beforeUpload(file: any) {
      const isJSON = file.type === 'application/json';
      if (!isJSON) {
        message.error('请确认上传文件是ERD导出的标准json文件!');
        return false;
      }

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        let originJson;
        try {
          // @ts-ignore
          originJson = projectDispatch.decrypt('AES', reader.result.toString());
        } catch (e) {
          console.log(39, e);
          message.error(`ERD文件解密失败！`)
          return false;
        }
        let erdJson = JSON.parse(originJson);
        let erdJsonModules = erdJson['modules'];
        if (!erdJsonModules) {
          message.error('您导入的是非法的ERD文件!');
          return false;
        }
        if (!(erdJsonModules instanceof Array)) {
          message.error('您导入的是非法的ERD文件!');
          return false;
        }
        if (erdJsonModules.length <= 0) {
          message.warning('您尚未在ERD新建模块，无需导入，可直接在本系统新建模块!');
          return false;
        }
        console.log(41, 'erdJsonModules', erdJsonModules);
        // @ts-ignore
        const dataSource = projectJSON;
        let resultMsg: any = [];
        let resultModules: any = [];
        erdJsonModules.forEach(module => {
          let hasMulti = (dataSource.modules || []).some((module1: any) => module.name === module1.name);
          if (!hasMulti) {
            resultModules.push(module);
          } else {
            resultMsg.push("[" + module.name + "]已经在本系统中存在，已跳过导入");
          }
        });
        resultModules = importModuleAndProfile(dataSource, erdJson, resultModules, projectDispatch);
        if (resultMsg != '') {
          Modal.warning({
            title: '重要提示',
            content: <>{resultMsg.map((m: any) => {
              return <p>{m}</p>
            })}</>,
            okText: null,
            cancelText: null,
          });
        } else {
          message.success('ERD文件导入成功！');
        }
        return true;
      };
      return true;
    },
  };


  return (<>
    {/*    <ModalForm
      title={<span>解析已有ERD文件</span>}
      trigger={
        <Button
          key="erd"
          icon={<MyIcon type="icon-other_win"/>}
          text="解析ERD文件"
          minimal={true}
          small={true}
          fill={true}
          alignText={Alignment.LEFT}></Button>
      }

    >*/}

    <Dragger {...prop}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined/>
      </p>
      <p className="ant-upload-text">点击或者拖拽ERD导出的json文件到此区域以上传</p>
      <p className="ant-upload-hint">
        上传完毕后，系统会自动开始解析；每次仅支持解析一个ERD文件。
      </p>
    </Dragger>

    {/* </ModalForm>*/}
  </>);
};

export default React.memo(ReverseERD)
