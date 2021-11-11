import React from "react";
import {Button, ButtonGroup, Icon, Menu, MenuDivider, MenuItem, Props} from "@blueprintjs/core";
import {createFromIconfontCN} from "@ant-design/icons";
import {history} from 'umi';
import AddVersion from "@/components/dialog/version/AddVersion";
import SyncConfig from "@/components/dialog/version/SyncConfig";
import InitVersion from "@/components/dialog/version/InitVersion";
import RebuildVersion from "@/components/dialog/version/RebuildVersion";
import ReversePDM from "@/components/dialog/import/ReversePDM";
import ReverseDatabase from "../dialog/import/ReverseDatabase";
import ReverseERWin from "@/components/dialog/import/ReverseERWin";
import ReversePdMan from "@/components/dialog/import/ReversePdMan";
import ExportFile from "@/components/dialog/export/ExportFile";
import ExportDDL from "@/components/dialog/export/ExportDDL";
import ExportJson from "@/components/dialog/export/ExportJson";
import DatabaseSetUp from "@/components/dialog/setup/DatabaseSetUp";
import {Popover2} from "@blueprintjs/popover2";
import {IconName} from "@blueprintjs/icons";
import {MaybeElement} from "@blueprintjs/core/src/common/props";


export const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_1485538_uljgplzg6rm.js', // 在 iconfont.cn 上生成
});


export interface IFileMenuProps extends Props {
  shouldDismissPopover?: boolean;
}


export const VersionMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <>
    <AddVersion/>
    <SyncConfig/>
    <InitVersion/>
    <RebuildVersion/>
  </>
);


export const ImportMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <ReverseDatabase/>
    <ReversePDM/>
    <ReverseERWin/>
    <ReversePdMan/>
  </Menu>
);

export const ExportMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <ExportFile/>
    <ExportDDL/>
    <ExportJson/>
  </Menu>
);

export const SetUpMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <DatabaseSetUp/>
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

const renderButton = (icon: IconName | MaybeElement, text: string, content: string | JSX.Element) => {
  return (
    <Popover2
      autoFocus={false}
      enforceFocus={false}
      hasBackdrop={true}
      content={content}
      position="right"
    >
      <Button rightIcon="caret-right" icon={icon} text={text}/>
    </Popover2>
  );
}

export const ProjectMenu: React.FunctionComponent<IFileMenuProps> = props => {
  return (
    1 === 1 ? <Menu>
        <MenuItem key="history" shouldDismissPopover={false} text="版本" icon="history"><VersionMenu/></MenuItem>
        <MenuItem key="import" shouldDismissPopover={false} text="导入" icon="import"><ImportMenu/></MenuItem>
        <MenuItem key="export" shouldDismissPopover={false} text="导出" icon="export"><ExportMenu/></MenuItem>
        <MenuItem key="cog" shouldDismissPopover={false} text="设置" icon="cog"><SetUpMenu/></MenuItem>
      </Menu>
      : <ButtonGroup vertical={true}>
        {renderButton("history", "版本", <VersionMenu/>)}
        {renderButton("import", "导入", <ImportMenu/>)}
        {renderButton("export", "导出", <ExportMenu/>)}
        {renderButton("cog", "设置", <SetUpMenu/>)}
      </ButtonGroup>
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

