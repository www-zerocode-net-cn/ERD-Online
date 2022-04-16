import React from "react";
import {Left, Right} from "react-spaces";
import "./index.less";
import TemplateSquare from "@/pages/project/home/component/TemplateSquare";
import ProjectList from "@/pages/project/home/component/ProjectList";

export type CodeProps = {};
const Code: React.FC<CodeProps> = (props) => {

  return (
    <>
      <Left size={"80%"}>
        <ProjectList/>
        <a className="copyright" href="https://www.zerocode.net.cn/">2021@ERD Online</a>
      </Left>
      <Right size="20%">
        <TemplateSquare/>
      </Right>
    </>
  );
}
export default React.memo(Code)
