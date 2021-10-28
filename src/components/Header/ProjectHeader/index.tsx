import React from 'react';
import {Alignment, Button, Classes, InputGroup, Navbar, NavbarDivider} from "@blueprintjs/core";
import {Left, Right, Top} from "react-spaces";


export type ProjectHeaderProps = {};

const ProjectHeader: React.FC<ProjectHeaderProps> = (props) => {
  return (
    <Top size="50px">
      <Left size={"10%"}>
        <Navbar>
          <Navbar.Group align={Alignment.CENTER}>
            <img src={"/favicon.ico"}/>
            <NavbarDivider/>
            <Navbar.Heading>ZERO CODE</Navbar.Heading>
          </Navbar.Group>
        </Navbar>
      </Left>
      <Right size={"20%"}>
        <Navbar>
          <Navbar.Group align={Alignment.CENTER}>
            <InputGroup
              className={Classes.ROUND}
              asyncControl={true}
              leftIcon="search"
              placeholder=""
            />
            <NavbarDivider></NavbarDivider>
            <Button className="bp3-minimal" icon="cog" title="设置"/>
            <Button className="bp3-minimal" icon="notifications" title="通知"/>
            <Button className="bp3-minimal" icon="user" title="用户"/>
          </Navbar.Group>
        </Navbar>
      </Right>
    </Top>
  )
};

export default React.memo(ProjectHeader);
