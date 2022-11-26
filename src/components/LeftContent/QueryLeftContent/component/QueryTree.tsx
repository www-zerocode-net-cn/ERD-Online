import React, {useState} from 'react';
import {Dropdown, Empty, Tooltip, Tree} from "antd";
import AddQuery from "@/components/LeftContent/QueryLeftContent/component/AddQuery";
import type {DataNode} from "antd/lib/tree";
import {siderWidth} from "@/layouts/DesignLayout";
import {EditOutlined, MinusCircleOutlined, PlusCircleOutlined} from "@ant-design/icons";
import {ChartGraph, Data, Table, TableFile} from "@icon-park/react";
import {Typography} from "@mui/material";
import {
  renderEntityRightContext,
  renderModuleRightContext
} from "@/components/LeftContent/DesignLeftContent/component/DataTable";

const {DirectoryTree} = Tree;

export type DataTableProps = {};

const DataTable: React.FC<DataTableProps> = (props) => {

  const [state, setState] = useState({
    role: 0,
    treeData: [],
    defaultExpandedKeys: '',
    NodeTreeItem: null, //右键菜单
    visible: false,
    isModalVisible: false,//是否显示modal 新建组织或者修改组织
    isHideAdd: '',      //是否展示添加按钮
    isHideUpdate: '',   //是否展示修改按钮
    isHideDelete: '',  //是否展示删除按钮
    operType: '',      //区别Modal弹出框的类型，(添加，修改，删除用的是一个Modal)
    text: '',
    isLoading: true
  })

  const treeData: DataNode[] = [
    {
      title: 'parent 1',
      key: '0-0',
      children: [
        {
          title: 'leaf',
          key: '0-0-0',
        },
        {
          title: 'leaf',
          key: '0-0-1',
        },
      ],
    },
  ];

  const getNodeTreeMenu = () => {
    const tmpStyle = {
      position: 'absolute',
      maxHeight: 40,
      textAlign: 'center',
      left: `20px`,
      top: `20px`,
      display: 'flex',
      flexDirection: 'row',
    };
    const menu = (
      <div
        style={tmpStyle}
      >
        <div style={{alignSelf: 'center', marginLeft: 10, display: state.isHideAdd}}>
          <Tooltip placement="bottom" title="添加子节点">
            <PlusCircleOutlined/>
          </Tooltip>
        </div>
        <div style={{alignSelf: 'center', marginLeft: 10, display: state.isHideUpdate}}>
          <Tooltip placement="bottom" title="修改节点">
            <EditOutlined/>
          </Tooltip>
        </div>
        {state.NodeTreeItem?.category === 1 ? '' : (
          <div style={{alignSelf: 'center', marginLeft: 10, display: state.isHideDelete}}>
            <Tooltip placement="bottom" title="删除该节点">
              <MinusCircleOutlined/>
            </Tooltip>
          </div>
        )}
      </div>
    );
    return menu;
  }


  return (<>
    {1 > 0 ?
      <div style={{display: 'flex', marginRight: '20px'}}>
        <Tree
          blockNode={true}
          defaultExpandAll
          // defaultExpandedKeys={}
          // onSelect={onSelect}
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
                <span style={{paddingLeft:"5px"}}>{node.title}</span>
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
