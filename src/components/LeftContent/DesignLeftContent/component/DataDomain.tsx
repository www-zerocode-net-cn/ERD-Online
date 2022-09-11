import React, {useRef} from 'react';
import {Icon, Menu, MenuItem} from "@blueprintjs/core";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {ContextMenu2} from "@blueprintjs/popover2";
import PropTypes from "prop-types";
import {IconName} from "@blueprintjs/icons";
import {MaybeElement} from "@blueprintjs/core/src/common/index";
import AddDataType from "@/components/dialog/dataType/AddDataType";
import {useTreeItemStyles} from "@/components/LeftContent/DesignLeftContent/component/DataTable";
import RemoveDataType from "@/components/dialog/dataType/RemoveDataType";
import RenameDataType from "@/components/dialog/dataType/RenameDataType";
import TreeItem, {TreeItemProps} from '@mui/lab/TreeItem';
import {Typography} from '@mui/material';
import AddDatabase from "@/components/dialog/database/AddDatabase";
import RemoveDatabase from "@/components/dialog/database/RemoveDatabase";
import RenameDatabase from "@/components/dialog/database/RenameDatabase";
import {Tree} from "antd";


interface StyledTreeItemProps extends TreeItemProps {
  type: string,
  code: string,
  bgColor?: string,
  color?: string,
  labelIcon: IconName | MaybeElement,
  labelInfo?: number,
  labelText: string,
  chnname: string,
  haveRightMenu: boolean,
}


export type DataDomainProps = {};

const DataDomain: React.FC<DataDomainProps> = (props) => {
  const {datatype, database, projectDispatch} = useProjectStore(state => ({
    database: state.project?.projectJSON?.dataTypeDomains?.database,
    datatype: state.project?.projectJSON?.dataTypeDomains?.datatype,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('datatype', 115, datatype, database)

  const activeDataTypeOrDatabase = (t: string, m: string) => {
    console.log('t', 68, t);
    console.log('m', 69, m);
    if (t === "dataType") {
      projectDispatch.setCurrentDatatype(m);
    } else if (t === "database") {
      projectDispatch.setCurrentDatabase(m);
    }
  }

  const dataTypeRef = useRef();
  const activeDataTypePanel = () => {
    // @ts-ignore
    dataTypeRef.current.setModalVisit(true);
  }
  const databaseRef = useRef();
  const activeDatabasePanel = () => {
    // @ts-ignore
    databaseRef.current.setModalVisit(true);
  }

  const StyledTreeItem = (prop: StyledTreeItemProps) => {
    const classes = useTreeItemStyles();
    const {type, code, labelText, chnname, labelIcon, labelInfo, color, bgColor, haveRightMenu, ...other} = prop;

    const renderDataTypeRightContext = () => <Menu>
        <AddDataType moduleDisable={false}/>
        <MenuItem icon="edit" text="修改字段类型" onClick={() => {
          activeDataTypePanel();
        }}/>
        <RemoveDataType disable={false}/>
        {/*  <MenuItem icon="duplicate" text="复制字段类型"/>
        <MenuItem icon="cut" text="剪切字段类型"/>
        <MenuItem icon="clipboard" text="粘贴字段类型"/>*/}
      </Menu>
    ;
    const renderDatabaseRightContext = () => <Menu>
        <AddDatabase moduleDisable={false}/>
        <MenuItem icon="edit" text="修改数据源" onClick={() => {
          activeDatabasePanel();
        }}/>
        <RemoveDatabase disable={false}/>
        {/*   <MenuItem icon="duplicate" text="复制数据源"/>
        <MenuItem icon="cut" text="剪切数据源"/>
        <MenuItem icon="clipboard" text="粘贴数据源"/>*/}
      </Menu>
    ;

    const renderContext = () => {
      if (code === '###menu###') {
        return type === "database" ? <AddDatabase moduleDisable={false}/> : <AddDataType moduleDisable={false}/>;
      }
      return type === "database" ? renderDatabaseRightContext() : renderDataTypeRightContext();
    }

    return (
      <ContextMenu2
        content={haveRightMenu ? renderContext() : undefined}
        onContextMenu={() => activeDataTypeOrDatabase(type, code)}
      >
        <TreeItem
          label={
            <div className={classes.labelRoot}>
              <Icon icon={labelIcon} className={classes.labelIcon}/>
              <Typography variant="body2" className={classes.labelText}>
                {labelText}
              </Typography>
              <Typography variant="caption" color="inherit">
                {labelInfo}
              </Typography>
            </div>
          }
          title={labelText}
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            group: classes.group,
            label: classes.label,
          }}
          {...other}
        />
      </ContextMenu2>
    );
  }
  StyledTreeItem.propTypes = {
    type: PropTypes.string,
    code: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.number,
    labelText: PropTypes.string.isRequired,
    chnname: PropTypes.string,
  };

  return (<div>
    <Tree
      showIcon={false}
      height={550}
      defaultExpandedKeys={['database###database']}
      blockNode={true}
      rootStyle={{textAlign: 'left'}}
      treeData={projectDispatch.getDataTypeTree('')}
      onClick={(e, node: any) => {
        console.log(224, 'node', node);
        if (node.type === "dataType") {
          activeDataTypeOrDatabase("dataType", node.code);
          activeDataTypePanel();
        } else if (node.type === "database") {
          activeDataTypeOrDatabase("database", node.code);
          activeDatabasePanel();
        }
      }}
    >
    </Tree>
    <RenameDataType onRef={dataTypeRef}/>
    <RenameDatabase onRef={databaseRef}/>
  </div>)
    ;
}

export default React.memo(DataDomain);
