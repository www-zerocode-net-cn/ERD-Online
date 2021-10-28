import React from 'react';
import {Left} from "react-spaces";
import {Classes, Icon, Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import classNames from "classnames";
import './index.less';

export type ProjectLeftContentProps = {};

const ProjectLeftContent: React.FC<ProjectLeftContentProps> = (props) => {
  return (
    <Left size="10%">
      <Menu className={classNames(Classes.ELEVATION_4)}>
        <MenuItem icon="time" text="最近"/>
        <MenuItem icon="document" text="项目模型"/>
      </Menu>
      <Menu className={Classes.ELEVATION_1}>
        <MenuDivider title="团队"/>
        <MenuItem icon="group-objects" text="我的team"/>
      </Menu>
      <Menu className={Classes.ELEVATION_1}>
        <MenuItem icon="globe-network" labelElement={<Icon icon="share"/>} text="资源社区"/>
      </Menu>
    </Left>
  )
};

export default React.memo(ProjectLeftContent);
