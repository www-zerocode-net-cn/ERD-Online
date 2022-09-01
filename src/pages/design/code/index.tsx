import React from "react";
import {Left, Right} from "react-spaces";
import "./index.less";
import TemplateSquare from "@/pages/project/home/component/TemplateSquare";
import ProjectList from "@/pages/project/home/component/ProjectList";

export type CodeProps = {};
const Code: React.FC<CodeProps> = (props) => {

  return (
    <>
      <ProjectList/>
      <TemplateSquare/>
    </>
  );
}
export default React.memo(Code)
