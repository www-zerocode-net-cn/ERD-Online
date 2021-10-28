import React from 'react';
import {Button, ButtonGroup, Card, Elevation, IBreadcrumbProps, IconName, OverflowList} from "@blueprintjs/core";
import {Popover2} from "@blueprintjs/popover2";
import {ProjectMenu} from "@/components/Menu";

export type ProjectListProps = {};
const BREADCRUMBS: IBreadcrumbProps[] = [
  {href: "/users", icon: "folder-close", text: "Users"},
  {href: "/users", icon: "folder-close", text: "Users"},
  {href: "/users", icon: "folder-close", text: "Users"},
  {href: "/users", icon: "folder-close", text: "Users"},
  {href: "/users", icon: "folder-close", text: "Users"},
  {href: "/users", icon: "folder-close", text: "Users"},
  {href: "/users", icon: "folder-close", text: "Users"},
  {href: "/users", icon: "folder-close", text: "Users"},

];
const ProjectList: React.FC<ProjectListProps> = (props) => {
  const renderButton = (text: string, iconName: IconName) => {
    const vertical = false
    const rightIconName: IconName = vertical ? "caret-right" : "caret-down";
    return (
      <Popover2 content={<ProjectMenu/>} placement={vertical ? "right-start" : "bottom-start"}>
        <Button rightIcon={rightIconName} icon={iconName} text={text}/>
      </Popover2>
    );
  }
  const visibleItemRenderer = ({text, ...restProps}: IBreadcrumbProps) => {
    // customize rendering of last breadcrumb
    return <a onClick={()=>{window.location.href='/design/table'}} key={Math.random()}><Card elevation={Elevation.TWO} className="cardList">
      <div className="projectImg"></div>
      <h5 className="bp3-heading name">H2 测试项目</h5>
      <p className="time">2021:08:26 10:00</p>
    </Card></a>;
  };
  return (<>
      <div className="body-header-tool">
        <div>
          <ButtonGroup minimal={true} fill={true} style={{minWidth: 120}}>
            {renderButton("File", "document")}
          </ButtonGroup>
        </div>
        <div>
          <div>
            <ButtonGroup style={{minWidth: 120}}>
              {renderButton("新增", "plus")}
            </ButtonGroup>
          </div>
        </div>
      </div>
      <OverflowList
        tagName="div"
        className="projectList"
        items={BREADCRUMBS}
        visibleItemRenderer={visibleItemRenderer}
      />
    </>
  )
};

export default React.memo(ProjectList);
