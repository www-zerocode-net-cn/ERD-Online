import React from 'react';
import {Fill, Fixed, Right} from "react-spaces";
import ProjectHeader from "@/components/Header/ProjectHeader";
import ProjectLeftContent from "@/components/LeftContent/ProjectLeftContent";


export type ProjectLayoutProps = {
  children: React.ReactNode | (() => React.ReactNode) | any;
};


const ProjectLayout: React.FC<ProjectLayoutProps> = (props) => {
  const {children} = props;

  return (
    < Fixed width={"100%"} height={"100%"} className="bp3-dark dark-theme">
      <ProjectHeader/>
      <Fill>
        <ProjectLeftContent/>
        <Right size="90%">
          {children}
        </Right>
      </Fill>
    </Fixed>
  )
};

export default React.memo(ProjectLayout);
