import React, {useEffect, useState} from 'react';
import {Icon, Menu} from "@blueprintjs/core";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import useTabStore from "@/store/tab/useTabStore";
import {ContextMenu2} from "@blueprintjs/popover2";
import PropTypes from "prop-types";
import {IconName} from "@blueprintjs/icons";
import {MaybeElement} from "@blueprintjs/core/src/common/index";
import AddEntity from "@/components/dialog/entity/AddEntity";
import RenameEntity from "@/components/dialog/entity/RenameEntity";
import RemoveEntity from "@/components/dialog/entity/RemoveEntity";
import AddModule from "@/components/dialog/module/AddModule";
import RenameModule from "@/components/dialog/module/RenameModule";
import RemoveModule from "@/components/dialog/module/RemoveModule";

import TreeItem, {TreeItemProps} from '@mui/lab/TreeItem';
import {Typography} from '@mui/material';
import {makeStyles} from "@mui/styles";
import {Top} from "react-spaces";
import {Empty, Tree} from "antd";
import useShortcutStore from "@/store/shortcut/useShortcutStore";
import useGlobalStore from "@/store/global/globalStore";


export const useTreeItemStyles = makeStyles((theme: any) => ({
  root: {
    '&:hover > $content': {
      backgroundColor: theme.palette?.action?.hover,
    },
    '&:focus > $content, &$selected > $content': {
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    '$expanded > &': {},
  },
  group: {
    marginLeft: '5px',
    '& $content': {
      paddingLeft: '10px',
    },
  },
  expanded: {},
  selected: {},
  label: {
    fontWeight: 'inherit',
    color: 'inherit',
  },
  labelRoot: {
    display: 'flex',
    flex: 'auto',
    width: '100%',
    alignItems: 'center',
    padding: '2px',
  },
  labelIcon: {
    marginRight: '5px',
    marginLeft: '5px',
  },
  labelText: {
    width: '80px',
    fontWeight: 'inherit',
    flexGrow: 1,
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    textAlign: 'left',
  },
}));

interface StyledTreeItemProps extends TreeItemProps {
  type: string,
  module: string,
  bgColor?: string,
  color?: string,
  labelIcon: IconName | MaybeElement,
  labelInfo?: number,
  labelText: string,
  chnname: string,
}

export const renderEntityRightContext = (payload: { title: string, chnname: string }) => <Menu>
    <AddEntity moduleDisable={false}/>
    <RenameEntity moduleDisable={false} renameInfo={payload}/>
    <RemoveEntity disable={false}/>
    {/*    <MenuItem icon="duplicate" text="复制表"/>
    <MenuItem icon="cut" text="剪切表"/>
    <MenuItem icon="clipboard" text="粘贴表"/>*/}
  </Menu>
;
export const renderModuleRightContext = (payload: { name: string, chnname: string }) => <Menu>
    <AddModule moduleDisable={false} trigger="bp"/>
    <RenameModule moduleDisable={false} renameInfo={payload}/>
    <RemoveModule disable={false}/>
    <AddEntity moduleDisable={false}/>

    {/*    <MenuItem icon="duplicate" text="复制模块"/>
    <MenuItem icon="cut" text="剪切模块"/>
    <MenuItem icon="clipboard" text="粘贴模块"/>*/}
  </Menu>
;

export type DataTableProps = {};

const DataTable: React.FC<DataTableProps> = (props) => {
  const {modules, projectDispatch} = useProjectStore(state => ({
    modules: state.project?.projectJSON?.modules,
    projectDispatch: state.dispatch,
  }), shallow);
  console.log('modules139', modules)
  const {tabDispatch} = useTabStore(state => ({tableTabs: state.tableTabs, tabDispatch: state.dispatch}));
  const {searchKey} = useGlobalStore(state => ({
    searchKey: state.searchKey,
    globalDispatch: state.dispatch,
  }), shallow);
  const {shortcutDispatch} = useShortcutStore(state => ({
    shortcutDispatch: state.dispatch
  }));

  const [autoExpandParent, setAutoExpandParent] = useState(true);


  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  useEffect(() => {
    setExpandedKeys(projectDispatch.getExpandedKeys(searchKey || ''));
  }, [searchKey]);

  const onExpand = (newExpandedKeys: any) => {
    console.log(128, newExpandedKeys);
    setExpandedKeys(newExpandedKeys);
    setAutoExpandParent(false);
  };

  const classes = useTreeItemStyles();
  const StyledTreeItem = (prop: StyledTreeItemProps) => {
    const {type, module, labelText, chnname, labelIcon, labelInfo, color, bgColor, ...other} = prop;

    return (
      <ContextMenu2
        content={type === "module"
          ? renderModuleRightContext({name: labelText, chnname})
          : renderEntityRightContext({title: labelText, chnname})
        }
        onContextMenu={() => {
        }}
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
    module: PropTypes.string.isRequired,
    bgColor: PropTypes.string,
    color: PropTypes.string,
    labelIcon: PropTypes.elementType.isRequired,
    labelInfo: PropTypes.number,
    labelText: PropTypes.string.isRequired,
    chnname: PropTypes.string,
  };

  const activeEntity = (module: any, entity: any) => {
    projectDispatch.setCurrentModule(module);
    projectDispatch.setCurrentEntity(entity);
  }


  return (<>

    <Top size="90%" scrollable={true}>
      {modules && modules.length > 0 ? <Tree
          showIcon={false}
          onExpand={(newExpandedKeys) => onExpand(newExpandedKeys)}
          expandedKeys={expandedKeys}
          autoExpandParent={autoExpandParent}
          treeData={projectDispatch.getModuleEntityTree(searchKey || '')}
          blockNode={true}
          className={classes.label}
          rootStyle={{textAlign: 'left'}}
          onClick={(e, node: any) => {
            console.log(198, 'node', node);
            if (node.type === "module") {
              projectDispatch.setCurrentModule(node.module)
            } else if (node.type === "entity") {
              tabDispatch.addTab({module: node.module, entity: node.title});
              activeEntity(node.module, node.title)
            } else if (node.type === "relation") {
              shortcutDispatch.setShow(false);
              tabDispatch.addTab({module: node.module, entity: `关系图-${node.module}`});
              activeEntity(node.module, node.title)
            }
          }}
          titleRender={(node: any) => {
            console.log(185, 'node', node);
            const type = node.type;
            const module = node.module;
            const entity = node.title;

            return <ContextMenu2
              content={node.type === "module"
                ? renderModuleRightContext({name: node.name, chnname: node.chnname})
                : node.type === "entity" ? renderEntityRightContext({title: node.title, chnname: node.chnname}) : <></>
              }
              onContextMenu={() => {
              }}
            >
              <div className={classes.labelRoot} onDragStart={(e) => {

                console.log('开始拖');
                e.stopPropagation();
                let value = '';
                if (type === "module") {
                  value = `module&${module}`;
                } else {
                  if (type === "entity") {
                    value = `entity&${module}&${entity}`;
                  } else if (type === "relation") {
                    value = `map&${module}/关系图`;
                  }
                }
                e.dataTransfer.setData("Text", value);
              }} draggable="true">
                <Icon icon={node.type === "module" ? "database" : node.type === "relation" ? "many-to-many" : "th"}
                      className={classes.labelIcon}/>
                <Typography variant="body2" className={classes.labelText}>
                  {node.title}
                </Typography>
                <Typography variant="caption" color="inherit">
                  {node.type !== 'relation' ? node.length : null}
                </Typography>
              </div>
            </ContextMenu2>
          }}
        />
        :
        <Empty
          image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
          imageStyle={{
            height: 60,
          }}
          description={
            <span>暂无数据</span>
          }
        >
          <AddModule moduleDisable={false} trigger="ant"/>
        </Empty>
      }

    </Top>
  </>);
}

export default React.memo(DataTable);
