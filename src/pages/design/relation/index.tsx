import G6Relation from "@/pages/design/relation/g6";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import React from "react";
import {ModuleEntity} from "@/store/tab/useTabStore";
import {Left} from "react-spaces";


export type RelationProps = {
  moduleEntity: ModuleEntity
};
const Relation: React.FC<RelationProps> = (props) => {
  const {projectJSON, projectDispatch} = useProjectStore(state => ({
    projectJSON: state.project?.projectJSON,
    projectDispatch: state.dispatch,
  }), shallow);


  console.log(13, projectJSON);
  const columnOrder = [
    {code: 'chnname', value: '字段名', com: 'Input', relationNoShow: false},
    {code: 'name', value: '逻辑名(英文名)', com: 'Input', relationNoShow: false},
    {code: 'type', value: '类型', com: 'Select', relationNoShow: false},
    {code: 'dataType', value: '数据库类型', com: 'Text', relationNoShow: true},
    {code: 'remark', value: '说明', com: 'Input', relationNoShow: true},
    {code: 'pk', value: '主键', com: 'Checkbox', relationNoShow: false},
    {code: 'notNull', value: '非空', com: 'Checkbox', relationNoShow: true},
    {code: 'autoIncrement', value: '自增', com: 'Checkbox', relationNoShow: true},
    {code: 'defaultValue', value: '默认值', com: 'Input', relationNoShow: true},
    {code: 'relationNoShow', value: '关系图', com: 'Icon', relationNoShow: true},
    {code: 'uiHint', value: 'UI建议', com: 'Select', relationNoShow: true},
  ];

  return (
    <Left size={"100%"}>

      <G6Relation dataSource={JSON.parse(JSON.stringify(projectJSON))}
                  columnOrder={columnOrder}
                  value={`map&${props.moduleEntity.module}`}
                  height={document.body.clientHeight * 0.9}
                  width={document.body.clientWidth * 0.7}
                  projectDispatch={projectDispatch}

      />
    </Left>
  );
}
export default React.memo(Relation)
