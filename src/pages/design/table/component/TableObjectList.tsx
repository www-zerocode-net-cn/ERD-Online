import React from 'react';
import {Button, ButtonGroup, Divider, IBreadcrumbProps, OverflowList} from "@blueprintjs/core";
import {Alignment} from "@blueprintjs/core/src/common/index";


export type TableObjectListProps = {};
const BREADCRUMBS: IBreadcrumbProps[] = [
  {href: "/users", icon: "folder-close", text: "sys_config"},
  {href: "/users", icon: "folder-close", text: "sys_user"},
  {href: "/users", icon: "folder-close", text: "测试表3"},
  {href: "/users", icon: "folder-close", text: "测试表4"},
  {href: "/users", icon: "folder-close", text: "测试表5"},
  {href: "/users", icon: "folder-close", text: "测试表6"},
  {href: "/users", icon: "folder-close", text: "测试表7"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},
  {href: "/users", icon: "folder-close", text: "测试表8"},


];
const TableObjectList: React.FC<TableObjectListProps> = (props) => {

  const visibleItemRenderer = ({text, ...restProps}: IBreadcrumbProps) => {
    console.log(text)
    // customize rendering of last breadcrumb
    return <Button small={true} alignText={Alignment.LEFT} text={text} minimal={true} active={false} fill={true}
                   icon="th"/>

  };
  return (
    <>
      <Divider/>
      <ButtonGroup minimal={true} className="table-button-tool-group">
        <Button icon="database" text={"打开表"} small={true}></Button>
        <Button icon="edit" text={"设计表"} small={true}></Button>
        <Button icon="insert" text={"新建表"} small={true}></Button>
        <Button icon="trash" text={"删除表"} small={true}></Button>
        <Button icon="import" text={"导入向导"} small={true}></Button>
        <Button icon="export" text={"导出向导"} small={true}></Button>
      </ButtonGroup>
      <Divider/>
      <OverflowList
        tagName="div"
        className="tableNameList"
        items={BREADCRUMBS}
        visibleItemRenderer={visibleItemRenderer}
      />
    </>
  )
};

export default React.memo(TableObjectList);
