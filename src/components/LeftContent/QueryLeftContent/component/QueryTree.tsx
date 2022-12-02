import React, {useEffect} from 'react';
import {Dropdown, Empty, Menu, Tree} from "antd";
import {siderWidth} from "@/layouts/DesignLayout";
import {FolderCode, Table} from "@icon-park/react";

import shallow from "zustand/shallow";
import useQueryStore from "@/store/query/useQueryStore";
import {EllipsisMiddle} from "@/components/EllipsisMiddle";
import RenameQuery from "@/components/dialog/query/RenameQuery";
import RemoveQuery from "@/components/dialog/query/RemoveQuery";
import AddQuery from "@/components/dialog/query/AddQuery";
import AddQueryFolder from "@/components/dialog/query/AddQueryFolder";

const {DirectoryTree} = Tree;


export type QueryTreeProps = {};

const QueryTree: React.FC<QueryTreeProps> = (props) => {

  const {querySearchKey, treeData, queryDispatch} = useQueryStore(state => ({
    querySearchKey: state.querySearchKey,
    treeData: state.treeData,
    queryDispatch: state.dispatch
  }), shallow);


  console.log(46, querySearchKey)
  useEffect(() => {
    queryDispatch.fetchTreeData();
  }, [querySearchKey])

  const renderQueryRightContext = (payload: any) => <Menu mode="inline">
      {!payload.isLeaf ? <Menu.Item>
        <AddQueryFolder isRightContext={true}/>
      </Menu.Item> : <></>}
      <Menu.Item>
        <AddQuery model={payload}/>
      </Menu.Item>
      <Menu.Item>
        <RenameQuery model={payload}/>
      </Menu.Item>
      <Menu.Item>
        <RemoveQuery model={payload}/>
      </Menu.Item>
      {/*    <MenuItem icon="duplicate" text="复制查询"/>
    <MenuItem icon="cut" text="剪切查询"/>
    <MenuItem icon="clipboard" text="粘贴查询"/>*/}
    </Menu>
  ;

  return (<>
    {treeData.length > 0 ?
      <div style={{display: 'flex', marginRight: '20px', marginTop: '10px'}}>
        <DirectoryTree
          showIcon={false}
          blockNode={true}
          defaultExpandAll
          onSelect={(selectedKeys, info) => queryDispatch.onSelectNode(selectedKeys, info)}
          treeData={treeData}
          // onRightClick={onRightClick}
          style={{width: `${siderWidth - 50}px`}}
          titleRender={(node: any) => {
            console.log(101, 'node', node);

            return <Dropdown trigger={['contextMenu']}
                             overlay={
                               renderQueryRightContext(node)
                             }

            >
              <div>
                {node.isLeaf ?
                  <Table theme="filled" size="12" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/> :
                  <FolderCode theme="filled" size="12" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>}
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
        <AddQueryFolder isRightContext={false}/>
      </Empty>
    }

  </>);
}

export default React.memo(QueryTree);
