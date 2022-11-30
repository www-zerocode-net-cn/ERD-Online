import React, {useEffect} from 'react';
import {Dropdown, Empty, Tree} from "antd";
import AddQuery from "@/components/LeftContent/QueryLeftContent/component/AddQuery";
import {siderWidth} from "@/layouts/DesignLayout";
import {Table} from "@icon-park/react";
import {
  renderEntityRightContext,
  renderModuleRightContext
} from "@/components/LeftContent/DesignLeftContent/component/DataTable";

import shallow from "zustand/shallow";
import useQueryStore from "@/store/query/useQueryStore";
import {EllipsisMiddle} from "@/components/EllipsisMiddle";


export type DataTableProps = {};

const DataTable: React.FC<DataTableProps> = (props) => {

  const {querySearchKey, treeData, queryDispatch} = useQueryStore(state => ({
    querySearchKey: state.querySearchKey,
    treeData: state.treeData,
    queryDispatch: state.dispatch
  }), shallow);


  console.log(46, querySearchKey)
  useEffect(() => {
    queryDispatch.fetchTreeData();
  }, [querySearchKey])


  return (<>
    {treeData.length > 0 ?
      <div style={{display: 'flex', marginRight: '20px', marginTop: '10px'}}>
        <Tree
          blockNode={true}
          defaultExpandAll
          onSelect={(selectedKeys, info) => queryDispatch.onSelectNode(selectedKeys, info)}
          treeData={treeData}
          // onRightClick={onRightClick}
          style={{width: `${siderWidth - 50}px`}}
          titleRender={(node: any) => {
            console.log(101, 'node', node);

            return <Dropdown trigger={['contextMenu']}
                             overlay={node.type === "module"
                               ? renderModuleRightContext({name: node.name, chnname: node.chnname})
                               : renderEntityRightContext({
                                 title: node.title,
                                 chnname: node.chnname
                               })
                             }

            >
              <div>
                <Table theme="filled" size="12" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>
                <EllipsisMiddle title={node.title} style={{marginLeft: '5px'}}>
                  {node.title}
                </EllipsisMiddle>
              </div>
            </Dropdown>
          }}
        />

      </div>
      :
      <Empty
        image="/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>暂无数据</span>
        }
      >
        <AddQuery moduleDisable={false} trigger="ant"/>
      </Empty>
    }

  </>);
}

export default React.memo(DataTable);
