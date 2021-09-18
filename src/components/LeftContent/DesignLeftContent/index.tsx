import React from 'react';
import {Popconfirm} from 'antd';

import {Alignment, Button, Classes, Icon, InputGroup, Menu, MenuItem, Tab, Tabs} from "@blueprintjs/core";
import {Left} from "react-spaces";
import './index.less'
import classNames from "classnames";
import {ContextMenu2} from "@blueprintjs/popover2";
import PropTypes from 'prop-types';
import {makeStyles} from '@material-ui/core/styles';
import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import Typography from '@material-ui/core/Typography';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import {TreeItemProps} from "@material-ui/lab/TreeItem/TreeItem";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {IconName} from "@blueprintjs/icons";
import {MaybeElement} from "@blueprintjs/core/src/common/index";
import useTabStore from "@/store/tab/useTabStore";
import AddEntity from "@/pages/design/table/component/dialog/entity/AddEntity";
import AddModule from "@/pages/design/table/component/dialog/module/AddModule";
import RenameEntity from "@/pages/design/table/component/dialog/entity/RenameEntity";
import RenameModule from "@/pages/design/table/component/dialog/module/RenameModule";

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    },
    '&:focus > $content, &$selected > $content': {
      color: 'var(--tree-view-color)',
    },
    '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  },
  content: {
    borderTopRightRadius: theme.spacing(1),
    borderBottomRightRadius: theme.spacing(1),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  },
  group: {
    marginLeft: 0,
    '& $content': {
      paddingLeft: theme.spacing(2),
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
    width: '88%',
    alignItems: 'center',
    padding: theme.spacing(0.5, 0),
  },
  labelIcon: {
    marginRight: theme.spacing(1),
  },
  labelText: {
    fontWeight: 'inherit',
    flexGrow: 1,
    display: 'block',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '80px',
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


export type DesignLeftContentProps = {};

const DesignLeftContent: React.FC<DesignLeftContentProps> = (props) => {

    const {modules, projectDispatch, currentModuleIndex, currentEntityIndex} = useProjectStore(state => ({
      modules: state.project?.projectJSON?.modules,
      projectDispatch: state.dispatch,
      currentModuleIndex: state.currentModuleIndex || -1,
      currentEntityIndex: state.currentEntityIndex || -1,
    }), shallow);
    console.log('modules139', modules)
    const {tabDispatch} = useTabStore(state => ({tableTabs: state.tableTabs, tabDispatch: state.dispatch}));

    const renderModuleRightContext = (payload: { name: string, chnname: string }) => <Menu>
        <AddModule moduleDisable={false}/>
        <RenameModule moduleDisable={false} renameInfo={payload}/>

        <MenuItem icon="trash" text="删除模块"/>
        <MenuItem icon="duplicate" text="复制模块"/>
        <MenuItem icon="cut" text="剪切模块"/>
        <MenuItem icon="clipboard" text="粘贴模块"/>
      </Menu>
    ;


    const renderEntityRightContext = (payload: { title: string, chnname: string }) => <Menu>
        <AddEntity moduleDisable={false}/>
        <RenameEntity moduleDisable={false} renameInfo={payload}/>
        <Popconfirm placement="right" title="删除表"
                    onConfirm={() => projectDispatch.removeEntity(currentModuleIndex, currentEntityIndex)} okText="是"
                    cancelText="否">
          <Button icon="remove"
                  text={"删除表"}
                  minimal={true}
                  small={true}
                  fill={true}
                  alignText={Alignment.LEFT}
          ></Button>
        </Popconfirm>
        <MenuItem icon="duplicate" text="复制表"/>
        <MenuItem icon="cut" text="剪切表"/>
        <MenuItem icon="clipboard" text="粘贴表"/>
      </Menu>
    ;


    const StyledTreeItem = (props: StyledTreeItemProps) => {
      const classes = useTreeItemStyles();
      const {type, module, labelText, chnname, labelIcon, labelInfo, color, bgColor, ...other} = props;

      const activeModuleOrEntity = (t: string, m: string) => {
        projectDispatch.setCurrentModule(m);
        if (type === "entity") {
          projectDispatch.setCurrentEntity(currentModuleIndex, labelText);
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
      chnname: PropTypes.string.isRequired,
    };

    const activeEntity = (module: any, entity: any) => {
      tabDispatch.addTab({module: module.name, entity: entity.title});
      projectDispatch.setCurrentModule(module.name);
      projectDispatch.setCurrentEntity(currentModuleIndex, entity.title);
    }

    return (
      <Left size="10%">
        <Tabs
          id="navbar"
          animate={false}
          large={true}
          renderActiveTabPanelOnly={true}
          className="left-table-tab"
        >
          <Tab id="table" title="数据表"></Tab>
          <Tab id="domain" title="数据域"/>
        </Tabs>
        <InputGroup
          className={classNames(Classes.ROUND, "table-search-input")}
          asyncControl={true}
          leftIcon="search"
          placeholder=""
        />
        <TreeView
          className="root"
          defaultExpanded={['3']}
          defaultCollapseIcon={<ArrowDropDownIcon/>}
          defaultExpandIcon={<ArrowRightIcon/>}
          defaultEndIcon={<div style={{width: 24}}/>}
        >
          {modules?.map((module: any) => {
            return <StyledTreeItem key={module.name}
                                   type="module"
                                   module={module.name}
                                   nodeId={module.name}
                                   labelText={module.name}
                                   chnname={module.chnname}
                                   labelIcon={"database"}
                                   labelInfo={module?.entities?.length}
                                   onClick={() => projectDispatch.setCurrentModule(module.name)}>
              {module?.entities?.map((entity: any) => {
                return <StyledTreeItem key={`${module.name}###${entity.title}`}
                                       type="entity"
                                       module={module.name}
                                       nodeId={`${module.name}###${entity.title}`}
                                       labelText={entity.title}
                                       chnname={entity.chnname}
                                       labelIcon={"th"} labelInfo={entity?.fields?.length}
                                       onClick={() => activeEntity(module, entity)}/>
              })}
            </StyledTreeItem>;
          })}

        </TreeView>
      </Left>
    )
  }
;

export default React.memo(DesignLeftContent)
