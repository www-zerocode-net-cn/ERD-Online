import React from 'react';
import {Left} from "react-spaces";
import {Classes, Icon, Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import './index.less';

export type ProjectLeftContentProps = {};

const ProjectLeftContent: React.FC<ProjectLeftContentProps> = (props) => {
  return (
    <Left size="12%">
      <Menu>
        <MenuItem icon="time" text="最近"/>
        <MenuItem selected={true} icon="document" text="项目模型"/>
      </Menu>
      <Menu className={Classes.ELEVATION_1}>
        <MenuDivider title="团队"/>
        <MenuItem icon="group-objects" text="团队1"/>
        <MenuItem icon="add" text="创建团队"/>
      </Menu>
      <Menu className={Classes.ELEVATION_1}>
        <MenuItem icon="globe-network" labelElement={<Icon icon="share"/>} text="资源社区"/>
      </Menu>
    </Left>
  )
};

export default React.memo(ProjectLeftContent);
