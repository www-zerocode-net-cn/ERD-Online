import React, {useEffect, useState} from 'react';
import CodeEditor from "@/components/CodeEditor";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {ModuleEntity} from "@/store/tab/useTabStore";
import {getCurrentVersionData} from "@/utils/dbversionutils";
import {getCodeByDataTable} from "@/utils/json2code";


export type TableCodeShowProps = {
  dbCode: string;
  templateCode: string;
  moduleEntity: ModuleEntity;
};

const TableCodeShow: React.FC<TableCodeShowProps> = (props) => {
  const {dbCode, templateCode} = props;
  console.log(16, 'templateCode', templateCode, dbCode);
  const {dataSource, dataTable} = useProjectStore(state => ({
    dataTable: state.project?.projectJSON?.modules[state.currentModuleIndex || 0].entities[state.currentEntityIndex || 0],
    dataSource: state.project?.projectJSON,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('database', 19, dataSource)


  const height = document.body.clientHeight;
  const tempHeight = height;
  const [result, setResult] = useState('');
  const [changes, setChanges] = useState([]);
  const [oldDataSource, setOldDataSource] = useState({});

  const getChanges = () => {
    // todo 获取服务端versions
    getCurrentVersionData(dataSource, [], (c: any, o: any) => {
      setChanges(c);
      setOldDataSource(o);
    });
  };

  const getTableCode = () => {
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
    return getCodeByDataTable(dataSource, module, dataTable, dbCode, templateCode, tempChanges, oldDataSource);
  }

  useEffect(() => {
    getChanges();
    setResult(getTableCode());
  }, [templateCode]);

  return (<>
    <CodeEditor
      mode='mysql'
      height={`${tempHeight * 0.65}px`}
      value={result}
    />
  </>);
}

export default React.memo(TableCodeShow)
