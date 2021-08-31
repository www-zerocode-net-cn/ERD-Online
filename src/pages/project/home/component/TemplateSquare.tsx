import React from 'react';
import {AnchorButton, Card, Elevation, IBreadcrumbProps, OverflowList} from "@blueprintjs/core";


export type TemplateSquareProps = {};

const TemplateSquare: React.FC<TemplateSquareProps> = (props) => {
  const BREADCRUMBS1: IBreadcrumbProps[] = [
    {href: "/users", icon: "folder-close", text: "Users"},
    {href: "/users", icon: "folder-close", text: "Users"},
    {href: "/users", icon: "folder-close", text: "Users"},
    {href: "/users", icon: "folder-close", text: "Users"},

  ];
  const visibleItemRenderer1 = ({text, ...restProps}: IBreadcrumbProps) => {
    // customize rendering of last breadcrumb
    return <Card elevation={Elevation.TWO} className="item">
      <div className="projectImg"></div>
      <h5 className="bp3-heading name">H2 测试项目</h5>
    </Card>;
  };
  return (<>
    <div className="model-template-tool">
      <h5 className="bp3-heading head">模板</h5>
      <AnchorButton
        href="#core/components/button"
        rightIcon="share"
        minimal={true}
        target="_blank"
        text={"模板广场"}
      />
    </div>
    <OverflowList
      tagName="div"
      className="model-template-list"
      items={BREADCRUMBS1}
      visibleItemRenderer={visibleItemRenderer1}
    /></>)
};

export default React.memo(TemplateSquare);
