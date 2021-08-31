import * as React from "react";

import { Props, Menu, MenuDivider, MenuItem } from "@blueprintjs/core";

export interface IFileMenuProps extends Props {
  shouldDismissPopover?: boolean;
}

export const FileMenu: React.FunctionComponent<IFileMenuProps> = props => (
  <Menu className={props.className}>
    <MenuItem text="New" icon="document" {...props} />
    <MenuItem text="Open" icon="folder-shared" {...props} />
    <MenuItem text="Close" icon="add-to-folder" {...props} />
    <MenuDivider />
    <MenuItem text="Save" icon="floppy-disk" {...props} />
    <MenuItem text="Save as..." icon="floppy-disk" {...props} />
    <MenuDivider />
    <MenuItem text="Exit" icon="cross" {...props} />
  </Menu>
);
