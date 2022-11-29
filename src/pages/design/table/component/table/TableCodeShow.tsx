import React, {useEffect, useState} from 'react';
import CodeEditor from "@/components/CodeEditor";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {ModuleEntity} from "@/store/tab/useTabStore";
import {getCurrentVersionData} from "@/utils/dbversionutils";
import {getCodeByDataTable} from "@/utils/json2code";
import * as Save from "@/utils/save";
import {Tooltip, Typography} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";

const {Paragraph} = Typography;

export type TableCodeShowProps = {
  dbCode: string;
  templateCode: string;
  moduleEntity: ModuleEntity;
};

const TableCodeShow: React.FC<TableCodeShowProps> = (props) => {
  const {dbCode, templateCode} = props;
  console.log(16, 'templateCode', templateCode, dbCode);
  const {dataSource, dataTable, dbs} = useProjectStore(state => ({
    dataTable: state.project?.projectJSON?.modules[state.currentModuleIndex || 0].entities[state.currentEntityIndex || 0],
    dataSource: state.project?.projectJSON,
    dbs: state.project?.projectJSON?.profile?.dbs,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('database', 19, dataSource)


  const height = document.body.clientHeight;
  const tempHeight = height;
  const [result, setResult] = useState('');
  const [changes, setChanges] = useState([]);
  const [oldDataSource, setOldDataSource] = useState({});

  const getChanges = () => {
    const db = dbs?.filter((d: any) => d.defaultDB)[0];
    console.log(37, dbs, db);
    Save.hisProjectLoad(db).then(r => {
      if (r && r.code === 200) {
        console.log(44,'versions',r.data)
        getCurrentVersionData(dataSource, r.data, (c: any, o: any) => {
          console.log(44, c, o)
          setChanges(c);
          setOldDataSource(o);
          setResult(getTableCode(c));
        });
      }
    })
  };

  const getTableCode = (changes: any) => {
    if (!dataTable || dataTable.fields.length <= 0) {
      return '';
    }
    // 根据模板类型的不同，传递不同的变化数据
    const tempChanges = changes.filter((c: any) => {
      const title = c.name.split('.')[0];
      return (templateCode === 'createFieldTemplate'
        && c.type === 'field'
        && c.opt === 'add'
        && title === dataTable.title) ||
        (templateCode === 'updateFieldTemplate'
          && c.type === 'field'
          && c.opt === 'update'
          && title === dataTable.title) ||
        (templateCode === 'deleteFieldTemplate'
          && c.type === 'field'
          && c.opt === 'delete'
          && title === dataTable.title) ||
        (templateCode === 'deleteIndexTemplate'
          && c.type === 'index'
          && c.opt === 'delete'
          && title === dataTable.title) ||
        (templateCode === 'rebuildTableTemplate'
          && c.type === 'field'
          && title === dataTable.title);
    });
    return getCodeByDataTable(dataSource, props.moduleEntity.module, dataTable, dbCode, templateCode, tempChanges, oldDataSource);
  }

  useEffect(() => {
    getChanges();
  }, [templateCode]);

  return (<>

    <Paragraph copyable={{text: result}}>    {
      (templateCode === 'createTableTemplate' ||
        templateCode === 'deleteTableTemplate' ||
        templateCode === 'createIndexTemplate') ? '该脚本为全量脚本' :
        <Tooltip placement="top" title='差异化脚本:
        1、根据最后一个版本的元数据，计算和当前模型的差异，然后按模板渲染；
        2、未同步版本时这里为空;
        3、当前项未产生变化，这里为空;
        '>
          <QuestionCircleOutlined/> 该脚本为差异化脚本
        </Tooltip>
    }

    </Paragraph>

    <CodeEditor
      mode='mysql'
      height={`${tempHeight * 0.55}px`}
      value={result}
    />
  </>);
}

export default React.memo(TableCodeShow)
