import React, {useState} from 'react';
import ProForm, {ModalForm} from "@ant-design/pro-form";
import {MenuItem} from "@blueprintjs/core";
import {Divider, Grid} from "@mui/material";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import {ProFormSelect} from "@ant-design/pro-form/es";
import {compareStringVersion} from '@/utils/string';
import useVersionStore from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import CodeEditor from "@/components/CodeEditor";
import {Button, message} from "antd";
import {checkVersionData} from "@/utils/dbversionutils";
import moment from "moment";
import * as File from '@/utils/file';

export type CompareVersionProps = {};

const CompareVersion: React.FC<CompareVersionProps> = (props) => {
  const {currentVersion, dbVersion, messages, data, versions, versionDispatch} = useVersionStore(state => ({
    messages: state.messages,
    data: state.data,
    versions: state.versions,
    currentVersion: state.currentVersion,
    dbVersion: state.dbVersion,
    versionDispatch: state.dispatch,
  }), shallow);

  console.log(25, 'versions', versions);

  const height = document.body.clientHeight;
  const tempHeight = height - 25;

  const [state, setState] = useState({
    initVersion: versions[1] && versions[1].version || '',
    incrementVersion: versions[0] && versions[0].version || '',
    incrementVersionData: {},
    again: false,
    synchronous: false,
    preSynchronous: false,
    flagSynchronous: false,
  });

  const versionSelect = versions.map((v: any) => {
    return {label: v.version, value: v.version}
  })

  const onVersionChange = (value: any, version: string) => {
    setState({
      ...state,
      [version]: value,
    });
  };

  const onCheck = () => {
    if (!state.initVersion || !state.incrementVersion) {
      message.warn('请选择你要比较的两个版本');
    }
    if (compareStringVersion(state.incrementVersion, state.initVersion) <= 0) {
      message.warn('增量脚本的版本号不能小于或等于初始版本的版本号');
    } else {
      // 读取两个版本下的数据信息
      let incrementVersionData = {};
      let initVersionData = {};
      versions.forEach((v: any) => {
        if (v.version === state.initVersion) {
          initVersionData = {modules: v.projectJSON.modules};
        }
        if (v.version === state.incrementVersion) {
          incrementVersionData = {modules: v.projectJSON.modules};
        }
      });
      const changes = checkVersionData(incrementVersionData, initVersionData);
      versionDispatch.setChanges(changes);
      setState({
        ...state,
        incrementVersionData
      });
    }
  };

  const onSave = () => {
    File.save(data, `${moment().format('YYYY-MM-D-h-mm-ss')}.sql`);
  };

  const execSQL = (updateDBVersion: any, type: string) => {
    const flag = versionDispatch.checkVersionCount(currentVersion);
    if (!flag) {
      const tempType = type;
      setState({
        ...state,
        [tempType]: true,
      });
      versionDispatch.execSQL( data, currentVersion, updateDBVersion, () => {
        setState({
          ...state,
          [tempType]: false,
        });
      }, type === 'flagSynchronous');
    } else {
      message.error('当前操作的版本之前还有版本尚未同步，请不要跨版本操作!');
    }
  };

  return (<>
    <ModalForm
      title="任意版本比较"
      layout="horizontal"
      trigger={
        <MenuItem key="compare" shouldDismissPopover={false} text="任意版本比较" icon={<CompareArrowsIcon/>}></MenuItem>
      }
      submitter={{
        // 完全自定义整个区域
        render: (props, doms) => {
          console.log(props);
          return [
            <Button color="primary" key="check"
                    onClick={() => onCheck()}>比较</Button>,
            <Button  key="save" onClick={onSave}>导出到文件</Button>,

            <Button
              loading={state.synchronous}
              title='会更新数据库中的版本号'
              style={{
                display: (currentVersion.version && compareStringVersion(currentVersion.version, dbVersion) > 0) ? '' : 'none',
              }}
              onClick={() => execSQL(true, 'synchronous')}
            >
              {state.synchronous ? '正在同步' : '同步'}
            </Button>,
            <Button
              loading={state.flagSynchronous}
              title='更新数据库的版本号，不会执行差异化的SQL'
              style={{
                display: (currentVersion.version && compareStringVersion(currentVersion.version, dbVersion) > 0) ? '' : 'none',
              }}
              onClick={() => execSQL(true, 'flagSynchronous')}
            >
              {state.flagSynchronous ? '正在标记为同步' : '标记为同步'}
            </Button>,
            <Button
              loading={state.again}
              title='不会更新数据库中的版本号'
              style={{
                display: (currentVersion.version && compareStringVersion(currentVersion.version, dbVersion) <= 0) ? '' : 'none',
                marginLeft: 10,
              }}
              onClick={() => execSQL(false, 'again')}
            >
              {state.again ? '正在执行' : '再次执行'}</Button>
          ];
        },
      }}
    >
      <ProForm.Group>
        <ProFormSelect
          fieldProps={{
            onChange: (value: any) => {
              console.log(52, 'value', value)
              onVersionChange(value, 'initVersion')
            }
          }}
          request={async () => versionSelect || []}
          name="initVersion"
          initialValue={state.initVersion}
          label="初始版本"
        />
        <ProFormSelect
          fieldProps={{
            onChange: (value: any) => {
              console.log(71, 'value', value)
              onVersionChange(value, 'incrementVersion')
            }
          }}
          request={async () => versionSelect || []}
          name="incrementVersion"
          initialValue={state.incrementVersion}
          label="增量版本"
        />
      </ProForm.Group>
      <Divider></Divider>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          变化信息
        </Grid>
        <Grid item xs={6}>
          {
            currentVersion ? `变化脚本(${compareStringVersion(currentVersion.version, dbVersion) <= 0 ?
              '已同步' : '未同步'})` : '变化脚本'
          }
        </Grid>
        <Grid item xs={6}>
          {
            messages.length > 0 ?
              messages.map((m: any, index: number) => (<div key={m.message}>{`${index + 1}:${m.message}`}</div>)) :
              `${data ? '当前脚本为全量脚本' : '当前版本无变化'}`
          }
        </Grid>
        <Grid item xs={6}>
          <CodeEditor
            mode='mysql'
            height={`${tempHeight * 0.5}px`}
            value={data}
          />
        </Grid>
      </Grid>
    </ModalForm>
  </>);
}

export default React.memo(CompareVersion)
