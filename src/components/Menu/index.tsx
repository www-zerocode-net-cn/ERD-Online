import React from "react";
import {Icon, Menu, MenuDivider, MenuItem, Props} from "@blueprintjs/core";
import {createFromIconfontCN} from "@ant-design/icons";
import {history} from 'umi';
import AddVersion from "@/components/dialog/version/AddVersion";
import SyncConfig from "@/components/dialog/version/SyncConfig";


const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1485538_o1m665bjvx9.js', // 在 iconfont.cn 上生成
});


export interface IFileMenuProps extends Props {
  shouldDismissPopover?: boolean;
}


export const VersionMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <AddVersion/>
    <SyncConfig/>
    <MenuItem key="selection" text="初始化基线" icon="selection" {...props} />
    <MenuItem key="undo" text="重建基线" icon="undo" {...props} />
  </Menu>
);

export const ImportMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <MenuItem key="reverse" text="数据库逆向解析" icon={<MyIcon type="icon-line-height"/>}  {...props} />
    <MenuItem key="pdm" text="解析PDM文件" icon={<MyIcon type="icon-PDM"/>} {...props} />
    <MenuItem key="other_win" text="解析ERWin文件" icon={<MyIcon type="icon-other_win"/>} {...props} />
    <MenuItem key="pdman" text="解析PdMan文件" icon={<MyIcon type="icon-other_win"/>} {...props} />
  </Menu>
);

export const ExportMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <MenuItem key="export" text="导出文档" icon={<MyIcon type="icon-f-export"/>}  {...props} />
    <MenuItem key="DDL" text="导出DDL" icon={<MyIcon type="icon-DDL"/>} {...props} />
    <MenuItem key="JSON" text="导出JSON" icon={<MyIcon type="icon-JSON"/>} {...props} />
  </Menu>
);

export const SystemMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <MenuItem key="db" text="数据库设置" icon="database"  {...props} />
    <MenuItem key="default" text="默认配置设置" icon="code-block" {...props} />
  </Menu>
);

export const HelpMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <MenuItem key="video" text="教程" icon="video"  {...props} />
    <MenuItem key="default" text="快捷键" icon="key-command" {...props} />
  </Menu>
);

export const ProjectMenu: React.FunctionComponent<IFileMenuProps> = props => {
  const {className} = props;
  return (
    <Menu className={className}>
      <MenuItem key="history" text="版本" icon="history"><VersionMenu className={className}/></MenuItem>
      <MenuItem key="import" text="导入" icon="import"><ImportMenu className={className}/></MenuItem>
      <MenuItem key="export" text="导出" icon="export"><ExportMenu className={className}/></MenuItem>
      <MenuItem key="cog" text="设置" icon="cog"><SystemMenu className={className}/></MenuItem>
    </Menu>
  );
};

export const NavigationMenu: React.FunctionComponent<IFileMenuProps> = props => {
  const {className} = props;
  return (
    <Menu className={className}>
      <MenuItem text="返回工作台" icon="chevron-left" onClick={() => {
        history.push('/project/home')
      }}></MenuItem>
      <MenuDivider/>
      <MenuItem text="资源社区" icon="globe-network" labelElement={<Icon icon="share"/>}></MenuItem>
      <MenuDivider/>
      <MenuItem text="帮助" icon="help"><HelpMenu className={className}/></MenuItem>
      <MenuItem text="账号设置" icon="user"></MenuItem>
      <MenuItem text="退出登录" icon="log-out"></MenuItem>
    </Menu>
  );
};


