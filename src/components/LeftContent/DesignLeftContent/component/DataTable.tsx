import React from 'react';
import {Classes, Icon, InputGroup, Menu, MenuItem, NonIdealState} from "@blueprintjs/core";
import classNames from "classnames";
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
import {TreeView} from '@mui/lab';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {makeStyles} from "@mui/styles";
import {Bottom} from "react-spaces";

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
    <MenuItem icon="duplicate" text="复制表"/>
    <MenuItem icon="cut" text="剪切表"/>
    <MenuItem icon="clipboard" text="粘贴表"/>
  </Menu>
;
export const renderModuleRightContext = (payload: { name: string, chnname: string }) => <Menu>
    <AddModule moduleDisable={false}/>
    <RenameModule moduleDisable={false} renameInfo={payload}/>
    <RemoveModule disable={false}/>
    <MenuItem icon="duplicate" text="复制模块"/>
    <MenuItem icon="cut" text="剪切模块"/>
    <MenuItem icon="clipboard" text="粘贴模块"/>
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


  const StyledTreeItem = (prop: StyledTreeItemProps) => {
    const classes = useTreeItemStyles();
    const {type, module, labelText, chnname, labelIcon, labelInfo, color, bgColor, ...other} = prop;

    const activeModuleOrEntity = (t: string, m: string) => {
      projectDispatch.setCurrentModule(m);
      console.log(145, 111);
      if (type === "entity") {
        console.log(147, 222);
        console.log(147, 222);
        projectDispatch.setCurrentEntity(labelText);
      }
    }

    return (
      <ContextMenu2
        content={type === "module"
          ? renderModuleRightContext({name: labelText, chnname})
          : renderEntityRightContext({title: labelText, chnname})
        }
        onContextMenu={() => activeModuleOrEntity(type, module)}
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
    tabDispatch.addTab({module: module?.name, entity: entity.title});
    projectDispatch.setCurrentModule(module?.name);
    projectDispatch.setCurrentEntity(entity.title);
  }

  return (<>
    <InputGroup
      className={classNames(Classes.ROUND, "table-search-input")}
      asyncControl={true}
      leftIcon="search"
      placeholder=""
    />
    <Bottom size="90%" scrollable={true} style={{marginTop: '10px'}}>
      <TreeView
        className="root"
        defaultExpanded={['3']}
        defaultCollapseIcon={<ArrowDropDownIcon/>}
        defaultExpandIcon={<ArrowRightIcon/>}
        defaultEndIcon={<div style={{width: 24}}/>}
      >
        {modules && modules.length > 0 ? modules.map((module: any) => {
            return <StyledTreeItem key={module?.name}
                                   type="module"
                                   module={module?.name}
                                   nodeId={module?.name}
                                   labelText={module?.name}
                                   chnname={module?.chnname}
                                   labelIcon={"database"}
                                   labelInfo={module?.entities?.length}
                                   onClick={() => projectDispatch.setCurrentModule(module?.name)}>
              {module?.entities?.map((entity: any) => {
                return <StyledTreeItem key={`${module?.name}###${entity.title}`}
                                       type="entity"
                                       module={module?.name}
                                       nodeId={`${module?.name}###${entity.title}`}
                                       labelText={entity.title}
                                       chnname={entity?.chnname}
                                       labelIcon={"th"} labelInfo={entity?.fields?.length}
                                       onClick={() => activeEntity(module, entity)}/>
              })}
            </StyledTreeItem>;
          })
          :
          <NonIdealState
            icon={"info-sign"}
            title={"提示："}
            description={<>未创建模块,点击下方按钮新增一个吧！<a><AddModule moduleDisable={false}/></a></>}
          />
        }

      </TreeView>
    </Bottom>
  </>);
}

export default React.memo(DataTable);
