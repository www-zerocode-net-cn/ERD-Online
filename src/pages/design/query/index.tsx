import React, {useEffect, useState} from "react";
import {Button, Select, Space} from "antd";
import {ProCard} from "@ant-design/pro-components";
import {Data, HistoryQuery, Info, Plan} from "@icon-park/react";
import CodeEditor from "@/components/CodeEditor";
import QueryResult from "@/pages/design/query/component/QueryResult";
import {BarsOutlined, EyeOutlined, InfoCircleOutlined, PlayCircleOutlined} from "@ant-design/icons";
import useQueryStore from "@/store/query/useQueryStore";
import shallow from "zustand/shallow";
import useVersionStore from "@/store/version/useVersionStore";
import _ from "lodash";
import {useSearchParams} from "@@/exports";
import * as cache from "@/utils/cache";
import {CONSTANT} from "@/utils/constant";

const {Option, OptGroup} = Select;
export type QueryProps = {
  id: string | number;
};

const Query: React.FC<QueryProps> = (props) => {
  const {dbs, versionDispatch} = useVersionStore(state => ({
    dbs: state.dbs,
    versionDispatch: state.dispatch,
  }), shallow);

  const [searchParams] = useSearchParams();
  let projectId = searchParams.get("projectId") || '';
  if (!projectId || projectId === '') {
    projectId = cache.getItem(CONSTANT.PROJECT_ID) || '';
  }

  const groupDb = _.groupBy(dbs, g => g.select);
  const currentDB = versionDispatch.getCurrentDB();


  const [tab, setTab] = useState('result');
  const [sqlMode, setSqlMode] = useState('mysql');
  const [theme, setTheme] = useState('xcode');

  const {queryDispatch} = useQueryStore(state => ({
    queryDispatch: state.dispatch
  }), shallow);

  const [queryInfo, setQueryInfo] = useState({
    sqlInfo: ''
  });


  useEffect(() => {
    queryDispatch.fetchQueryInfo(props.id).then(r => {
      if (r.code === 200) {
        setQueryInfo(r.data);
      }
    });
    console.log(26, queryInfo);
  }, [])

  const EDITOR_THEME = ['xcode', 'terminal',];

  const actions = <Space direction="vertical">
    <Space wrap>
      <span style={{marginRight: 8}}>数据源</span>
      <Select
        key={'db'}
        size="small"
        style={{width: 90, marginRight: 12}}
        value={currentDB ? currentDB : "请选择数据源"}

      >
        {
          Object.keys(groupDb).map(m => {
            console.log(267, m, groupDb[m]);
            return <OptGroup key={m} label={m}>
              {groupDb[m].map(
                m1 => {
                  return <Option key={m.name} value={m1.name}>{m1.name}</Option>
                }
              )}
            </OptGroup>
          })

        }
      </Select>
      <span style={{marginRight: 8}}>模式</span>
      <Select key={'model'} size="small" style={{width: 90, marginRight: 12}} value={sqlMode}
              onSelect={(e: any) => setSqlMode(e)}>
        <Option key="mysql" value="mysql">MySQL</Option>
        <Option key="psql" value="psql">Postgres</Option>
        <Option key="sqlserver" value="sqlserver">SqlServer</Option>
      </Select>
      <span style={{marginRight: 8}}>主题</span>
      <Select key={'topic'} size="small" style={{marginRight: 16, width: 170}} value={theme} onSelect={(e: any) => {
        setTheme(e);
        console.log(58, e)
      }}>
        {
          EDITOR_THEME.map(v => <Option key={v} value={v}>{v}</Option>)
        }
      </Select>
    </Space>

  </Space>
  return (<>
    <ProCard size={'small'}>
      <ProCard layout="center" bordered extra={actions} size={'small'}>
        <CodeEditor
          mode={sqlMode}
          theme={theme}
          value={queryInfo.sqlInfo}
          onChange={(value) => {
            setQueryInfo({
              ...queryInfo,
              sqlInfo: value
            });
            queryDispatch.updateSqlInfo({
              id: props.id,
              sqlInfo: value
            });
          }}
        />
      </ProCard>
    </ProCard>
    <ProCard size={'small'}>

      <Space direction="vertical">
        <Space wrap>
          <Button type="primary" icon={<PlayCircleOutlined/>}>运行</Button>
          <Button icon={<BarsOutlined/>}>格式化</Button>
          <Button icon={<EyeOutlined/>}>查看执行计划</Button>
          <Button icon={<InfoCircleOutlined/>}>优化建议</Button>
        </Space>
      </Space>
    </ProCard>
    <ProCard size={'small'}>
      <ProCard size={'small'} layout="center" bordered
               tabs={{
                 activeKey: tab,
                 items: [
                   {
                     label: <span><Data theme="filled" size="13" fill="#DE2910" strokeWidth={2}/> 执行结果</span>,
                     key: 'result',
                     children: <QueryResult sqlInfo={queryInfo.sqlInfo}/>,
                   },
                   {
                     label: <span><Plan theme="filled" size="13" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/> 执行计划</span>,
                     key: 'plan',
                     children: `内容二`,
                   },
                   {
                     label: <span><Info theme="filled" size="13" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/> 优化建议</span>,
                     key: 'advice',
                     children: `内容二`,
                   },
                   {
                     label: <span><HistoryQuery theme="filled" size="13" fill="#DE2910" strokeWidth={2}/> 历史记录</span>,
                     key: 'history',
                     children: `内容二`,
                   },
                 ],
                 onChange: (key) => {
                   setTab(key);
                 },
               }}
      >
        Auto
      </ProCard>

    </ProCard>


  </>);
};

export default React.memo(Query)
