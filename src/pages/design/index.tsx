import React from "react";
import {Left, Right} from "react-spaces";
import "./index.less";
import TemplateSquare from "@/pages/project/home/component/TemplateSquare";
import ProjectList from "@/pages/project/home/component/ProjectList";

export type DesignProps = {};
const Design: React.FC<DesignProps> = (props) => {

  return (
    <>
      <Left size={"85%"}>

        <ProjectList/>
        <a className="copyright">2021@ZEROCODE</a>
      </Left>
      <Right size="15%">
        <TemplateSquare/>
      </Right>
    </>
  );
}
export default React.memo(Design)