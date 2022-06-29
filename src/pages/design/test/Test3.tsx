import {Tree} from 'antd';
import type {DataNode, DirectoryTreeProps} from 'antd/lib/tree';
import React from 'react';
import './index.less';

export type TES3Props = {};

export const treeData: DataNode[] = [
  {
    title: 'parentparentparentparentparent 0',
    key: '0-0',
    children: [
      {title: 'leaf 0-0', key: '0-0-0', isLeaf: true},
      {title: 'leaf 0-1', key: '0-0-1', isLeaf: true},
    ],
  },
  {
    title: 'parent 1',
    key: '0-1',
    children: [
      {title: 'leaf 1-0', key: '0-1-0', isLeaf: true},
      {title: 'leaf 1-1', key: '0-1-1', isLeaf: true},
    ],
  },
];

const Test3: React.FC<TES3Props> = (props) => {


  const {DirectoryTree} = Tree;



  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    console.log('Trigger Select', keys, info);
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
    console.log('Trigger Expand', keys, info);
  };

  return (<>
      <DirectoryTree
        multiple
        defaultExpandAll
        draggable={true}
        onSelect={onSelect}
        onExpand={onExpand}
        treeData={treeData}
      />
      <div className="droptarget"
           onDrop={(e) => {
             console.log('放下')
           }}
           onDragOver={
             (e) => {
               e.preventDefault();
               console.log('经过')

             }
           }>lallal</div>
    </>
  );
};

export default React.memo(Test3)
