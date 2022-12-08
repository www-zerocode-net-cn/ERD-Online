import React, {useEffect, useRef, useState} from "react";
import {Button, message, Select, Space} from "antd";
import {ProCard} from "@ant-design/pro-components";
import {Data, HistoryQuery, Info, Plan} from "@icon-park/react";
import CodeEditor from "@/components/CodeEditor";
import QueryResult from "@/pages/design/query/component/QueryResult";
import {BarsOutlined, EyeOutlined, PlayCircleOutlined, SaveOutlined} from "@ant-design/icons";
import useQueryStore from "@/store/query/useQueryStore";
import shallow from "zustand/shallow";
import useVersionStore from "@/store/version/useVersionStore";
import _ from "lodash";
import {useSearchParams} from "@@/exports";
import * as cache from "@/utils/cache";
import {CONSTANT} from "@/utils/constant";
import {format} from "sql-formatter";
import useProjectStore from "@/store/project/useProjectStore";
import ExplainResult from "@/pages/design/query/component/ExplainResult";
import QueryHistory from "@/pages/design/query/component/QueryHistory";
import {keys} from "idb-keyval";

const {Option, OptGroup} = Select;
export type QueryProps = {
  id: string | number;
};

const Query: React.FC<QueryProps> = (props) => {
  const {dbs, versionDispatch} = useVersionStore(state => ({
    dbs: state.dbs,
    versionDispatch: state.dispatch,
  }), shallow);

  const {tables,} = useProjectStore(state => ({
    tables: state.tables,
  }), shallow);

  console.log(130, tables);

  const [searchParams] = useSearchParams();
  let projectId = searchParams.get("projectId") || '';
  if (!projectId || projectId === '') {
    projectId = cache.getItem(CONSTANT.PROJECT_ID) || '';
  }

  const groupDb = _.groupBy(dbs, g => g.select);
  const currentDB = versionDispatch.getCurrentDB();


  const [tableResult, setTableResult] = useState({
    columns: [],
    dataSource: [],
    total: 0
  });
  const [explainTable, setExplainTable] = useState({
    columns: [],
    dataSource: [],
    total: 0
  });
  const [tab, setTab] = useState('result');
  const [selectDB, setSelectDB] = useState(currentDB);
  const [sqlMode, setSqlMode] = useState('mysql');
  const [theme, setTheme] = useState('xcode');

  const {queryDispatch} = useQueryStore(state => ({
    queryDispatch: state.dispatch
  }), shallow);

  const [queryInfo, setQueryInfo] = useState({
    sqlInfo: ''
  });

  const editorRef = useRef(null);


  useEffect(() => {
    queryDispatch.fetchQueryInfo(props.id).then(r => {
      if (r.code === 200) {
        setQueryInfo(r.data);
      }
    });
    console.log(26, queryInfo);
  }, [])

  useEffect(() => {

  }, [tableResult])

  const EDITOR_THEME = ['xcode', 'terminal',];

  const actions = <Space direction="vertical">
    <Space wrap>
      <span style={{marginRight: 8}}>数据源</span>
      <Select
        key={'db'}
        size="small"
        style={{width: 90, marginRight: 12}}
        value={selectDB ? selectDB : "请选择数据源"}
        onSelect={(e: any) => setSelectDB(e)}
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
        <Option key="sql" value="sql">SQL</Option>
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
          tables={tables}
          onRef={editorRef}
          mode={sqlMode}
          theme={theme}
          value={queryInfo.sqlInfo}
          onChange={(value) => {
            setQueryInfo({
              ...queryInfo,
              sqlInfo: value
            });
          }}
        />
      </ProCard>
    </ProCard>
    <ProCard size={'small'}>

      <Space direction="vertical">
        <Space wrap>
          <Button type="primary" icon={<PlayCircleOutlined/>} onClick={() => {
            // @ts-ignore
            const selectValue = editorRef?.current?.getSelectValue();
            console.log(267, selectValue);
            if (!selectValue) {
              message.warning('未选中要执行的SQL');
            } else {
              if (!selectDB) {
                message.warning("未选中数据源");
              } else {
                const db = dbs?.filter((d: any) => d.name === selectDB)[0];
                const dbConfig = _.omit(db.properties, ['driver_class_name']);
                const params = {
                  ...dbConfig,
                  driverClassName: db.properties['driver_class_name'],
                  key: db.key,
                  queryId: props.id,
                  sql: selectValue,
                  dbName: db.name,
                }
                queryDispatch.exec(params).then(r => {
                  if (r?.code === 200) {
                    setTableResult({
                      columns: r?.data.columns,
                      dataSource: r.data.tableData.records,
                      total: r.data.tableData.total
                    });
                    setTab("result");
                  }
                });
              }
            }
          }}
          >运行</Button>
          <Button icon={<BarsOutlined/>} onClick={() => {
            // @ts-ignore
            const selectValue = editorRef?.current?.getSelectValue();
            if (!selectValue) {
              message.warning('未选中要格式化的SQL');
            } else {
              // @ts-ignore
              const formatSqlInfo = format(selectValue || '', {language: sqlMode});
              console.log(130, formatSqlInfo);
              // @ts-ignore
              editorRef?.current?.setSelectValue(formatSqlInfo);
            }
          }}>格式化</Button>
          <Button icon={<EyeOutlined/>} onClick={() => {
            // @ts-ignore
            const selectValue = editorRef?.current?.getSelectValue();
            console.log(267, selectValue);
            if (!selectValue) {
              message.warning('未选中要执行的SQL');
            } else {
              if (!selectDB) {
                message.warning("未选中数据源");
              } else {
                const db = dbs?.filter((d: any) => d.name === selectDB)[0];
                const dbConfig = _.omit(db.properties, ['driver_class_name']);
                const params = {
                  ...dbConfig,
                  driverClassName: db.properties['driver_class_name'],
                  key: db.key,
                  queryId: props.id,
                  sql: selectValue,
                  dbName: db.name,
                }
                queryDispatch.explain(params).then(r => {
                  if (r?.code === 200) {
                    setExplainTable({
                      columns: r?.data.columns,
                      dataSource: r?.data.tableData,
                      total: r?.data?.tableData?.length
                    });
                    setTab("plan");
                  }
                });
              }
            }
          }}>查看执行计划</Button>
          <Button icon={<SaveOutlined/>} onClick={() => {
            queryDispatch.updateSqlInfo({
              id: props.id,
              sqlInfo: queryInfo.sqlInfo
            });
          }}>保存SQL</Button>
        </Space>
      </Space>
    </ProCard>
    <ProCard size={'small'}>
      <ProCard size={'small'} layout="center" bordered
               wrap={true}
               tabs={{
                 activeKey: tab,
                 items: [
                   {
                     label: <span><Data theme="filled" size="13" fill="#DE2910" strokeWidth={2}/> 执行结果</span>,
                     key: 'result',
                     children: <QueryResult tableResult={tableResult}/>,
                   },
                   {
                     label: <span><Plan theme="filled" size="13" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/> 执行计划</span>,
                     key: 'plan',
                     children: <ExplainResult tableResult={explainTable}/>,
                   },
                   {
                     label: <span><HistoryQuery theme="filled" size="13" fill="#DE2910" strokeWidth={2}/> 历史记录</span>,
                     key: 'history',
                     children: <QueryHistory queryId={props.id} key={tab}/>,
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
