import React from "react";
import {Left, Right} from "react-spaces";
import "./index.less";
import TemplateSquare from "@/pages/project/home/component/TemplateSquare";
import ProjectList from "@/pages/project/home/component/ProjectList";
import shallow from "zustand/shallow";
import useShortcutStore, {PANEL} from "@/store/shortcut/useShortcutStore";
import Version from "@/pages/design/version";

export type DesignProps = {};
const Design: React.FC<DesignProps> = (props) => {
  const {panel} = useShortcutStore(state => ({
    panel: state.panel
  }), shallow);

  const rightContent = () => {
    console.log(17, "panel", panel);
    switch (panel) {
      case PANEL.DEFAULT:
        return <TemplateSquare/>;
      case PANEL.VERSION:
        return <Version/>;
      default:
        return <></>;
    }
  }
  return (
    <>
      <Left size={"80%"}>
        <ProjectList/>
        <a className="copyright">2021@ERD Online</a>
      </Left>
      <Right size="20%">
        {rightContent()}
      </Right>
    </>
  );
}
export default React.memo(Design)
