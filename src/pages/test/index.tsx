import * as React from "react";

import {Classes, Menu, MenuDivider, MenuItem} from "@blueprintjs/core";
import {ContextMenu2, ContextMenu2ContentProps, Tooltip2} from "@blueprintjs/popover2";


export type indexProps = {};


const index: React.FC<indexProps> = (props) => {
  const renderContent = React.useCallback(
    ({targetOffset}: ContextMenu2ContentProps) => (
      <Menu>
        <MenuItem icon="select" text="123123"/>
        <MenuItem icon="insert" text="Insert...">
          <MenuItem icon="new-object" text="Object"/>
          <MenuItem icon="new-text-box" text="Text box"/>
          <MenuItem icon="star" text="Astral body"/>
        </MenuItem>
        <MenuItem icon="layout" text="Layout...">
          <MenuItem icon="layout-auto" text="Auto"/>
          <MenuItem icon="layout-circle" text="Circle"/>
          <MenuItem icon="layout-grid" text="Grid"/>
        </MenuItem>
        {targetOffset === undefined ? undefined : (
          <>
            <MenuDivider/>
            <MenuItem
              disabled={true}
              text={`Clicked at (${Math.round(targetOffset.left)}, ${Math.round(targetOffset.top)})`}
            />
          </>
        )}
      </Menu>
    ),
    [],
  );

  return (
    <ContextMenu2 content={renderContent}>
      <Tooltip2
        content={
          <div style={{maxWidth: 230, textAlign: "center"}}>
            This tooltip will close when you open the node's context menu
          </div>
        }
      >
      </Tooltip2>
      <span className={Classes.TEXT_MUTED}>Right-click on node or background.</span>
    </ContextMenu2>
  );
}

export default React.memo(index);
