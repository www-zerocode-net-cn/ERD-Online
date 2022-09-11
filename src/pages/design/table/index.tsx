import React, {useEffect} from "react";
import "./index.scss";
import TableTab from "@/pages/design/table/component/tab/TableTab";
import useTabStore, {ModuleEntity} from "@/store/tab/useTabStore";
import Relation from "@/pages/design/relation";
import {Dropdown, Menu, Tabs, TabsProps} from "antd";

export type TableProps = {};
const Table: React.FC<TableProps> = (props) => {
  const tableTabs = useTabStore(state => state.tableTabs);
  const selectTabId = useTabStore(state => state.selectTabId);
  const tabDispatch = useTabStore(state => state.dispatch);


  console.log('tableTabs', tableTabs)
  console.log('selectTabId', selectTabId)

  const getTab = (tab: ModuleEntity) => {
    if (tab.entity?.startsWith('关系图')) {
      return <Relation moduleEntity={tab}/>
    } else {
      return <TableTab moduleEntity={tab}/>;
    }
  }

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

  const closeAll = (tab: ModuleEntity) => {
    console.log('currentEntity 37', tab)
    tabDispatch.removeAllTab(tab);
  }


  useEffect(() => {
    console.log('re-rending11')
  })
  const {TabPane} = Tabs;

  const getModuleEntity = (key: string) => {
    return {module: key.split('###')[0], entity: key.split('###')[1]};
  }

  const onChange = (targetKey: string) => {
    tabDispatch.activeTab(getModuleEntity(targetKey));
  };

  const onEdit = (targetKey: any, action: 'add' | 'remove') => {
    console.log(targetKey)
    if (action === 'remove') {
      closeCurrent(getModuleEntity(targetKey));
    } else {
    }
  };


  const renderRightContent = (tab: ModuleEntity) => {
    return (
      <Menu>
        <Menu.Item key={"closeCurrent"} onClick={() => closeCurrent(tab)}>关闭当前</Menu.Item>
        <Menu.Item key={"closeLeft"} onClick={() => closeLeft(tab)}>关闭左边</Menu.Item>
        <Menu.Item key={"closeRight"} onClick={() => closeRight(tab)}>关闭右边</Menu.Item>
        <Menu.Item key={"closeAll"} onClick={() => closeAll(tab)}>关闭全部</Menu.Item>
      </Menu>
    );
  };


  const renderTabBar: TabsProps['renderTabBar'] = (tabBarProps, DefaultTabBar) => (
    // @ts-ignore
    <DefaultTabBar {...tabBarProps}>
      {node => (
        // @ts-ignore
        <Dropdown overlay={renderRightContent({module: node?.key?.split('###')[0], entity: node?.key?.split('###')[1]})}
                  trigger={['contextMenu']}>
          {node}
        </Dropdown>
      )}
    </DefaultTabBar>
  );

  return (
    <>

      <Tabs type="editable-card" hideAdd onEdit={(e, action) => onEdit(e, action)} activeKey={selectTabId}
            onChange={onChange}
            renderTabBar={renderTabBar}
      >
        {tableTabs?.map((tab: ModuleEntity, index: number) => {
            return <TabPane tab={tab.entity} key={`${tab.module}###${tab.entity}`} closable={true}>
              {getTab(tab)}
            </TabPane>
          }
        )}
      </Tabs>
      {/*<Tabs*/}
      {/*  id="globalNavbar"*/}
      {/*  renderActiveTabPanelOnly={true}*/}
      {/*  className="tabs-height"*/}
      {/*  defaultSelectedTabId={defaultSelectTabId}*/}
      {/*  selectedTabId={selectTabId}*/}
      {/*>*/}
      {/*  <Tab id={defaultSelectTabId}*/}
      {/*       onClickCapture={() => tabDispatch.activeTab({module: "all", entity: "object"})}*/}
      {/*       key={0}*/}
      {/*       title={"对象"}*/}
      {/*       style={{width: "40px", textAlign: "center"}}*/}
      {/*       panel={<TableObjectList/>}>*/}

      {/*  </Tab>*/}

      {/*  {*/}
      {/*    tableTabs?.map((tab: ModuleEntity, index: number) => {*/}
      {/*      console.log('tab75', tab)*/}
      {/*      const selectedTabId = `${tab.module}###${tab.entity}`;*/}
      {/*      return <Tab id={selectedTabId}*/}
      {/*                  key={index}*/}
      {/*                  panel={getTab(tab)}>*/}
      {/*        <ContextMenu2 content={() => renderRightContent(tab)}>*/}
      {/*          <div title={`${tab.entity}|${tab.module}`} className="tab-text-close">*/}
      {/*            <div style={{textAlign: 'center'}} onClick={() => tabDispatch.activeTab(tab)}>{tab.entity}</div>*/}
      {/*            <Icon style={{width: "20%"}} icon={"cross"} onClick={() => closeCurrent(tab)}/>*/}
      {/*          </div>*/}
      {/*        </ContextMenu2>*/}
      {/*      </Tab>;*/}
      {/*    })*/}
      {/*  }*/}
      {/*  <Tabs.Expander/>*/}
      {/*</Tabs>*/}
      {/*<Footer/>*/}
      {/*    </Left>
      <Right size="20%">
        {rightContent()}
      </Right>*/}
    </>
  );
}
export default React.memo(Table)
