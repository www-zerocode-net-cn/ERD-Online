import React from 'react';
import {Alignment, Button, ButtonGroup, Navbar, NavbarDivider} from "@blueprintjs/core";
import {Left, Right, Top} from "react-spaces";
import {Popover2} from "@blueprintjs/popover2";
import shallow from "zustand/shallow";
import './index.less';
import {NavigationMenu, ProjectMenu} from '@/components/Menu';
import useGlobalStore from "@/store/global/globalStore";

export type DesignHeaderProps = {};

const DesignHeader: React.FC<DesignHeaderProps> = (props) => {
  const {saved} = useGlobalStore(state => ({
    saved: state.saved,
  }), shallow);
  return (
    <Top size="50px" style={{background:"#404854"}}>
      <Left size={"15%"}>
        <Navbar>
          <Navbar.Group align={Alignment.CENTER}>
            <Popover2 autoFocus={false}
                      enforceFocus={false}
                      hasBackdrop={true}
                      content={<NavigationMenu/>}
                      placement={"bottom-start"}>
              <Button icon={"menu"}/>
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
      </Left>
      <Right size={"20%"}>
        <Navbar>
          <Navbar.Group align={Alignment.RIGHT}>
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
          </Navbar.Group>
        </Navbar>
      </Right>
    </Top>
  )
};

export default React.memo(DesignHeader);
