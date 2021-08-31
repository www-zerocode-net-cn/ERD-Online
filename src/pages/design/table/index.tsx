import React from "react";
import {Left, Right} from "react-spaces";
import "./index.scss";
import TemplateSquare from "@/pages/project/home/component/TemplateSquare";
import Footer from "@/components/Footer";
import {Icon, Tab, Tabs} from "@blueprintjs/core";
import TableObjectList from "@/pages/design/table/component/TableObjectList";
import TableInfoEdit from "@/pages/design/table/component/TableInfoEdit";

export type TableProps = {};
const Table: React.FC<TableProps> = (props) => {

  return (
    <>
      <Left size={"85%"}>
        <Tabs
          id="navbar"
          animate={false}
          renderActiveTabPanelOnly={true}
          className="tabs-height"
        >
          <Tab id="object" title="对象" panel={<TableObjectList/>}></Tab>
          <Tab id="table" title="数据表" panel={<TableInfoEdit/>}><Icon icon="small-cross"/></Tab>
          <Tab id="domain" title="数据域"><Icon icon="small-cross"/></Tab>
          <Tab id="domain1" title="数据域"><Icon icon="small-cross"/></Tab>
          <Tab id="domain2" title="数据域"><Icon icon="small-cross"/></Tab>
          <Tab id="domain3" title="数据域"><Icon icon="small-cross"/></Tab>
          <Tab id="domain4" title="数据域"><Icon icon="small-cross"/></Tab>
          <Tab id="domain5" title="数据域"><Icon icon="small-cross"/></Tab>
        </Tabs>
        <Footer/>
      </Left>
      <Right size="15%">
        <TemplateSquare/>
      </Right>
    </>
  );
}
export default React.memo(Table)
