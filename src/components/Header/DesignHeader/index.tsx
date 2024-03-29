import React from 'react';
import {Alignment, Button, ButtonGroup, Classes, InputGroup, Navbar, NavbarDivider} from "@blueprintjs/core";
import {Popover2} from "@blueprintjs/popover2";
import shallow from "zustand/shallow";
import './index.less';
import {NavigationMenu, ProjectMenu} from '@/components/Menu';
import useGlobalStore from "@/store/global/globalStore";
import classNames from "classnames";

export type DesignHeaderProps = {};

const DesignHeader: React.FC<DesignHeaderProps> = (props) => {
  const {globalDispatch} = useGlobalStore(state => ({
    searchKey: state.searchKey,
    saved: state.saved,
    globalDispatch: state.dispatch
  }), shallow);
  return (
    <>
      <Navbar>
        <Navbar.Group align={Alignment.CENTER}>
          <Popover2 autoFocus={false}
                    enforceFocus={false}
                    hasBackdrop={true}
                    content={<NavigationMenu/>}
                    placement={"bottom-start"}>
            <Button minimal={true} icon={"menu"}/>
          </Popover2>
          <NavbarDivider/>
          <ButtonGroup minimal={true}>
            <Popover2
              autoFocus={false}
              enforceFocus={false}
              hasBackdrop={true}
              content={<ProjectMenu/>}
              placement={"bottom-start"}
            >
              <Button rightIcon={"caret-down"} text={"项目"}/>
            </Popover2>
          </ButtonGroup>
        </Navbar.Group>
      </Navbar>
      <InputGroup
        className={classNames(Classes.ROUND, "table-search-input")}
        asyncControl={true}
        leftIcon="search"
        onChange={(e) => globalDispatch.setSearchKey(e.target.value)}
        placeholder="搜索元数据（区分大小写）"
      />
      <Navbar>
        {/* <Navbar.Group align={Alignment.RIGHT}>
            <Button className="bp4-minimal" icon="people" title="用户"/>
            <NavbarDivider/>
            <Button className="bp4-minimal" icon="share" title="邀请协作"/>
            <NavbarDivider/>
            <Button className="bp4-minimal" icon="notifications" title="通知"/>
            <NavbarDivider/>
            <Button className="bp4-minimal" icon="chat" title="聊天"/>
            <NavbarDivider/>
            <Button className="bp4-minimal" intent={saved ? "success" : "danger"}
                    icon={saved ? "tick-circle" : "disable"} title={saved ? "已保存" : "未保存"}/>
          </Navbar.Group>*/}
      </Navbar>
    </>
  )
};

export default React.memo(DesignHeader);
