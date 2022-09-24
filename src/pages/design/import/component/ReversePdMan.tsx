import React from 'react';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import {ModalForm} from '@ant-design/pro-form';
import {InboxOutlined} from '@mui/icons-material';
import {message, Modal, Upload} from "antd";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import _ from "lodash";
const { Dragger } = Upload;

export type ReversePdManProps = {};

const ReversePdMan: React.FC<ReversePdManProps> = (props) => {
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
        message.error('请确认上传文件是PDMan导出的标准json文件!');
        return false;
      }

      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = () => {
        // @ts-ignore
        let pdmanJson = JSON.parse(reader.result.toString());
        let pdmanJsonModules = pdmanJson['modules'];
        if (!pdmanJsonModules) {
          message.error('您导入的是非法的PDMan文件!');
          return false;
        }
        if (!(pdmanJsonModules instanceof Array)) {
          message.error('您导入的是非法的PDMan文件!');
          return false;
        }
        if (pdmanJsonModules.length <= 0) {
          message.warn('您尚未在PDMan新建模块，无需导入，可直接在本系统新建模块!');
          return false;
        }
        console.log(41, 'pdmanJsonModules', pdmanJsonModules);
        // @ts-ignore
        const dataSource = projectJSON;
        let resultMsg: any = [];
        let resultModules: any = [];
        pdmanJsonModules.forEach(module => {
          let hasMulti = (dataSource.modules || []).some((module1: any) => module.name === module1.name);
          if (!hasMulti) {
            resultModules.push(module);
          } else {
            resultMsg.push("[" + module.name + "]已经在本系统中存在，已跳过导入");
          }
        });

        projectDispatch.setProjectJson({
          modules: (dataSource.modules || []).concat(resultModules),
          dataTypeDomains: _.merge(dataSource.dataTypeDomains, pdmanJson['dataTypeDomains']),
          profile: _.merge(dataSource.profile, pdmanJson['profile']),
        });
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
          message.success('PdMan文件导入成功！');
        }
        return true;
      };
      return true;
    },
  };


  return (<>
{/*    <ModalForm
      title={<span>解析已有PdMan文件</span>}
      trigger={
        <Button
          key="pdman"
          icon={<MyIcon type="icon-other_win"/>}
          text="解析PdMan文件"
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
        <p className="ant-upload-text">点击或者拖拽PdMand导出的json文件到此区域以上传</p>
        <p className="ant-upload-hint">
          上传完毕后，系统会自动开始解析；每次仅支持解析一个PdMan文件。
        </p>
      </Dragger>

    {/*</ModalForm>*/}
  </>);
};

export default React.memo(ReversePdMan)
