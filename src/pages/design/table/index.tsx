import React, {useEffect} from "react";
import {Left, Right} from "react-spaces";
import "./index.scss";
import TemplateSquare from "@/pages/project/home/component/TemplateSquare";
import Footer from "@/components/Footer";
import {Icon, Menu, MenuItem, Tab, Tabs} from "@blueprintjs/core";
import TableObjectList from "@/pages/design/table/component/TableObjectList";
import TableTab from "@/pages/design/table/component/TableTab";
import useTabStore, {ModuleEntity} from "@/store/tab/useTabStore";
import {ContextMenu2} from "@blueprintjs/popover2";
import shallow from "zustand/shallow";

export type TableProps = {};
const Table: React.FC<TableProps> = (props) => {
  const {tableTabs, selectTabId, tabDispatch} = useTabStore(state => ({
    tableTabs: state.tableTabs,
    selectTabId: state.selectTabId,
    tabDispatch: state.dispatch
  }), shallow);
  console.log('tableTabs', tableTabs)
  console.log('selectTabId', selectTabId)

  const closeCurrent = (tab: ModuleEntity) => {
    console.log('currentEntity19', tab)
    tabDispatch.removeTab(tab);
  }

  const closeLeft = (tab: ModuleEntity) => {
    console.log('currentEntity 29', tab)
    tabDispatch.removeLeftTab(tab);
  }

  const closeRight = (tab: ModuleEntity) => {
    console.log('currentEntity 34', tab)
    tabDispatch.removeRightTab(tab);
  }

  const renderRightContent = (tab: ModuleEntity) => {
    return (
      <Menu>
        <MenuItem icon="small-cross" onClick={() => closeCurrent(tab)} text="关闭当前"/>
        <MenuItem icon="small-cross" onClick={() => closeLeft(tab)} text="关闭左边"/>
        <MenuItem icon="small-cross" onClick={() => closeRight(tab)} text="关闭右边"/>

      </Menu>
    );
  };

  useEffect(() => {
    console.log('re-rending11')
  })

  return (
    <>
      <Left size={"85%"}>
        <Tabs
          id="globalNavbar"
          renderActiveTabPanelOnly={true}
          className="tabs-height"
          defaultSelectedTabId={"all###object"}
          selectedTabId={selectTabId}
        >
          <Tab id={"all###object"}
               onClickCapture={() => tabDispatch.activeTab({module: "all", entity: "object"})}
               key={0}
               title={"对象"}
               style={{width: "50px"}}
               panel={<TableObjectList/>}>

          </Tab>

          {
            tableTabs?.map((tab: ModuleEntity, index: number) => {
              console.log('tab75', tab)
              const selectedTabId = `${tab.module}###${tab.entity}`;
              return <Tab id={selectedTabId}
                          key={selectTabId}
                          onClickCapture={() => tabDispatch.activeTab(tab)}
                          panel={<TableTab moduleEntity={tab}/>}>
                <ContextMenu2 content={() => renderRightContent(tab)}>
                  <div title={`${tab.entity}|${tab.module}`} className="tab-text-close">
                    <div style={{textAlign: 'center'}}>{tab.entity}</div>
                    <Icon style={{width: "20%"}} icon={"cross"} onClick={() => closeCurrent(tab)}/>
                  </div>
                </ContextMenu2>
              </Tab>;
            })
          }
          <Tabs.Expander/>
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
