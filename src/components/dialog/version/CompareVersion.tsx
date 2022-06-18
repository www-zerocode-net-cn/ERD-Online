import React, {useEffect, useState} from 'react';
import ProForm, {ModalForm} from "@ant-design/pro-form";
import {MenuItem} from "@blueprintjs/core";
import {Divider, Grid} from "@mui/material";
import DetailsIcon from '@mui/icons-material/Details';
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import {ProFormSelect} from "@ant-design/pro-form/es";
import {compareStringVersion} from '@/utils/string';
import useVersionStore, {SHOW_CHANGE_TYPE} from "@/store/version/useVersionStore";
import shallow from "zustand/shallow";
import CodeEditor from "@/components/CodeEditor";
import {Button, message} from "antd";
import moment from "moment";
import * as File from '@/utils/file';
import _ from 'lodash';

export const CompareVersionType = {DETAIL: "detail", COMPARE: "compare"}

export type CompareVersionProps = {
  type: string;
};

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
  console.log(34, 'data', data);

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

  useEffect(() => {
    versionDispatch.compare(state);
  }, [state.initVersion, state.incrementVersion]);


  const versionSelect = versions.map((v: any) => {
    return {label: v.version, value: v.version}
  })


  const onVersionChange = (value: any, version: string) => {
    setState({
      ...state,
      [version]: value,
    });
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
      try {
        versionDispatch.execSQL(data, currentVersion, updateDBVersion, null, type === 'flagSynchronous');
      } finally {
        setState({
          ...state,
          [tempType]: false,
        });
      }
    } else {
      message.error('当前操作的版本之前还有版本尚未同步，请不要跨版本操作!');
    }
  };


  const isDetail = props.type === CompareVersionType.DETAIL;
  const isCompare = props.type === CompareVersionType.COMPARE;
  return (<>
    <ModalForm
      title={isDetail ? "版本变更详情" : "任意版本比较"}
      layout="horizontal"
      trigger={
        <MenuItem key="compare" shouldDismissPopover={false}
                  text={isDetail ? "版本变更详情" : "任意版本比较"} icon={isDetail ? <DetailsIcon/> : <CompareArrowsIcon/>}
                  onClick={() => isDetail ?
                    versionDispatch.showChanges(SHOW_CHANGE_TYPE.CURRENT, null, null, null)
                    : versionDispatch.compare(state)
                  }></MenuItem>
      }
      submitter={{
        // 完全自定义整个区域
        render: (props, doms) => {
          console.log(props);
          return [
            <Button key="save" onClick={onSave}>导出到文件</Button>,

            <Button
              loading={state.synchronous}
              title='会更新数据源中的版本号'
              style={{
                display: (isDetail && currentVersion.version && compareStringVersion(currentVersion.version, dbVersion) > 0) ? '' : 'none',
              }}
              onClick={() => execSQL(true, 'synchronous')}
            >
              {state.synchronous ? '正在同步' : '同步到数据源'}
            </Button>,
            <Button
              loading={state.flagSynchronous}
              title='更新数据源的版本号，不会执行差异化的SQL'
              style={{
                display: (isDetail && currentVersion.version && compareStringVersion(currentVersion.version, dbVersion) > 0) ? '' : 'none',
              }}
              onClick={() => execSQL(true, 'flagSynchronous')}
            >
              {state.flagSynchronous ? '正在标记为同步' : '标记为同步'}
            </Button>,
            <Button
              loading={state.again}
              title='不会更新数据源中的版本号'
              style={{
                display: (isDetail && currentVersion.version && compareStringVersion(currentVersion.version, dbVersion) <= 0) ? '' : 'none',
                marginLeft: 10,
              }}
              onClick={() => execSQL(false, 'again')}
            >
              {state.again ? '正在执行' : '再次执行'}</Button>
          ];
        },
      }}
    >
      <ProForm.Group style={{display: isCompare ? '' : 'none'}}>
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
        <Grid item xs={4}>
          变化信息
        </Grid>
        <Grid item xs={8}>
          {
            currentVersion ? `变化脚本(${compareStringVersion(currentVersion.version, dbVersion) <= 0 ?
              '已同步' : '未同步'})` : '变化脚本'
          }
        </Grid>
        <Grid item xs={4} style={{height: '450px', overflowY: "auto"}}>
          {
            messages.length > 0 ?
              _.sortBy(messages, ['opt', 'type']).map((m: any, index: number) => (
                <div key={m.message}>{`${index + 1}: ${m.message}`}</div>)) :
              `${data ? '当前脚本为全量脚本' : '当前版本无变化'}`
          }
        </Grid>
        <Grid item xs={8}>
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
