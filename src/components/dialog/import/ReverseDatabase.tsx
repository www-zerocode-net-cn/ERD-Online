import ProForm, {ModalForm, ProFormInstance, ProFormSelect, StepsForm} from '@ant-design/pro-form';
import React, {useRef, useState} from 'react';
import {Button as AntButton, Divider, message, Spin} from 'antd';
import {Alignment, Button} from "@blueprintjs/core";
import {MyIcon} from "@/components/Menu";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import _ from 'lodash';
import Test from "@/components/TableTransfer/Test";


export type DatabaseReverseProps = {};

const ReverseDatabase: React.FC<DatabaseReverseProps> = (props) => {
  const {projectDispatch, dbs, profileSliceState} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    profileSliceState: state.profileSliceState || {},
    dbs: state.project.projectJSON?.profile?.dbs || [],
  }), shallow);


  console.log(27, 'dbs', dbs);
  console.log(28, 'projectDispatch.getCurrentDBName()', projectDispatch.getCurrentDBName());

  const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(true);
      }, time);
    });
  };
  const formRef = useRef<ProFormInstance>();

  const {data, flag, status, exists, loading} = profileSliceState;
  const module = _.get(data, 'module', '');

  const titleRender = (c: any) => {
    if (exists.includes(c.title)) {
      return <span style={{color: 'red'}}>{c.chnname || c.title}({c.title})[已存在]</span>;
    }
    return `${c.chnname || c.title}(${c.title})`;
  };

  const mockData = (module.entities || []).map((e: any, i: number) => {
    return {
      key: i.toString(),
      title: titleRender(e),
      chnname: e?.chnname,
      disabled: exists.includes(e?.title),
    }
  });


  const leftTableColumns = [
    {
      dataIndex: 'title',
      title: '表名(英文名)',
    },
  ];
  const rightTableColumns = [
    {
      dataIndex: 'title',
      title: '表名(英文名)',
    },
  ];

  const [state, setState] = useState({
    targetKeys: []
  });

  const onTransferChange = (nextTargetKeys: any) => {
    setState({
      ...state,
      targetKeys: nextTargetKeys
    })
  }

  return (<>
    <ModalForm
      title={<span>解析已有数据源<span style={{color: "red"}}>（暂时不支持索引解析生成）</span></span>}
      trigger={
        <Button
          key="reverse"
          icon={<MyIcon type="icon-line-height"/>}
          text="数据源逆向解析"
          minimal={true}
          small={true}
          fill={true}
          alignText={Alignment.LEFT}></Button>
      }
      onFinish={async () => {
        await waitTime(1000);
        message.success('提交成功');
      }}

    >
      <StepsForm
        formRef={formRef}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        submitter={{
          render: (props) => {
            if (props.step === 0) {
              return (
                <AntButton type="primary" onClick={() => props.onSubmit?.()}>
                  下一步 {'>'}
                </AntButton>
              );
            }

            if (props.step === 1) {
              return [
                <AntButton type="primary" key="pre" onClick={() => props.onPre?.()}>
                  {'<'} 上一步
                </AntButton>,
              ];
            }

            return [
              <AntButton type="primary" key="gotoTwo" onClick={() => props.onPre?.()}>
                {'<'} 上一步
              </AntButton>,
              <AntButton type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                提交 √
              </AntButton>,
            ];
          },
        }}
      >
        <StepsForm.StepForm
          name="database"
          title="选择数据源"
          onFinish={async () => {
            const fieldsValue = formRef.current?.getFieldsValue();
            console.log(82, fieldsValue);
            const db = dbs.filter((d: any) => d.name === fieldsValue?.currentDB)[0];
            projectDispatch.dbReverseParse(db, fieldsValue?.dataFormat);
            return true;
          }}
        >
          <ProFormSelect
            name="currentDB"
            label="请选择需要解析的数据源："
            width="md"
            rules={[{required: true}]}
            initialValue={projectDispatch.getCurrentDBName()}
            request={async () => dbs.map((db: any) => {
              return {label: db.name, value: db.name}
            })}
          />
          <ProFormSelect
            name="dataFormat"
            label="逻辑名格式："
            width="md"
            rules={[{required: true}]}
            initialValue={"DEFAULT"}
            request={async () => [
              {label: '不处理', value: 'DEFAULT'},
              {label: '全大写', value: 'UPPERCASE'},
              {label: '全小写', value: 'LOWCASE'},
            ]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="parse"
          title="解析数据源"
          onFinish={async () => {
            console.log(formRef.current?.getFieldsValue());
            return true;
          }}

        >
          <Spin tip="正在解析数据源，请稍后。。。(请勿关闭当前弹窗！)" spinning={loading}>
            <ProForm.Group>
              {
                !flag && (status === 'SUCCESS' ?
      <Test/>
                  : 2)
              }
            </ProForm.Group>
            <Divider plain>「增量表」标记为白色，「<span style={{color:'red'}}>存量表</span>」标记为红色</Divider>
            <ProForm.Group>
              {
                !flag && (status === 'SUCCESS' ?
                  <div style={{textAlign: 'center'}}>解析结束：当前解析数据库「{data.dbType}」</div> :
                  <div style={{textAlign: 'center'}}>解析结束：解析失败</div>)
              }
              {
                !flag && <span style={{color: 'green'}}>解析结果：{status === 'SUCCESS' ?
                  <span>共解析出「<span style={{color: 'greenyellow'}}>{module.entities.length}</span>」张数据表，
            当前模型中已经存在的有「<span style={{color: 'red'}}>{exists.length}</span>」张表，请勾选需要添加到模型中的数据表！
            </span> : '解析失败'}
                </span>
              }
            </ProForm.Group>

          </Spin>
        </StepsForm.StepForm>

      </StepsForm>
    </ModalForm>
  </>);
}

export default React.memo(ReverseDatabase)
