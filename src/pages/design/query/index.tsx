import React, {useState} from "react";
import {Button, Select, Space} from "antd";
import {ProCard} from "@ant-design/pro-components";
import {Data, HistoryQuery} from "@icon-park/react";
import CodeEditor from "@/components/CodeEditor";
import QueryResult from "@/pages/design/query/component/QueryResult";

const {Option} = Select;

export type QueryProps = {};

const Query: React.FC<QueryProps> = (props) => {
  const [tab, setTab] = useState('tab1');


  const EDITOR_THEME = ["material-one-dark", 'atom-one-dark', 'vs-dark', 'ambiance', 'chrome', 'dracula', 'eclipse', 'github', 'merbivore', 'merbivore_soft', 'monokai', 'terminal', 'xcode'];

  const actions = <Space direction="vertical">
    <Space wrap>
      <span style={{marginRight: 8}}>数据源</span>
      <Select size="small" style={{width: 90, marginRight: 12}}>
        <Option key="mysql" value="mysql">MySQL</Option>
        <Option key="psql" value="psql">Postgres</Option>
      </Select>
      <span style={{marginRight: 8}}>模式</span>
      <Select size="small" style={{width: 90, marginRight: 12}}>
        <Option key="mysql" value="mysql">MySQL</Option>
        <Option key="psql" value="psql">Postgres</Option>
      </Select>
      <span style={{marginRight: 8}}>主题 </span>
      <Select size="small" style={{marginRight: 16, width: 170}}>
        {
          EDITOR_THEME.map(v => <Option value={v}>{v}</Option>)
        }
      </Select>
    </Space>

  </Space>
  return (<>
    <ProCard size={'small'}>
      <ProCard layout="center" bordered extra={actions} size={'small'}>
        <CodeEditor
          mode='mysql'
          value={"select * from dual"}
        />
      </ProCard>
    </ProCard>
    <ProCard size={'small'}>

      <Space direction="vertical">
        <Space wrap>
          <Button type="primary">执行</Button>
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
                     key: 'tab1',
                     children: <QueryResult/>,
                   },
                   {
                     label: <span><HistoryQuery theme="filled" size="13" fill="#DE2910" strokeWidth={2}/> 历史记录</span>,
                     key: 'tab2',
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
