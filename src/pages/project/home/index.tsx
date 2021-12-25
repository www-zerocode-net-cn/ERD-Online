import React from "react";
import {Left, Right} from "react-spaces";
import "./index.less";
import TemplateSquare from "@/pages/project/home/component/TemplateSquare";
import ProjectList from "@/pages/project/home/component/ProjectList";
import Footer from "@/components/Footer";

export type HomeProps = {};
const Home: React.FC<HomeProps> = (props) => {

  return (
    <>
      <Left size={"80%"}>
        <ProjectList/>
        <Footer/>
      </Left>
      <Right size="20%">
        <TemplateSquare/>
      </Right>
    </>
  );
}
export default React.memo(Home)
