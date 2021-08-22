import React from "react";
import ZeroCodeGridLayout from "@/components/ZeroCodeGridLayout";
import {Image} from "antd";
import style from './index.less';
import {
  B0062A6BDF52,
  B56EC4F2D9B,
  B57EBF5,
  D05FA0EA492,
  E079FA73D7,
  E0DF67094,
  F1DE6A851EC,
  F8886065B3D,
} from './gridLayouts';

export interface ProjectLayoutLayoutProps {
  children: any;
}

const ProjectLayout: React.FC<ProjectLayoutLayoutProps> = props => {
  const {children} = props;
  console.log('11', children)

  return (
    <>
      <div key="320400F6-E186-4B63-9E06-08446B57EBF5" className={style.B57EBF5}><ZeroCodeGridLayout layout={B57EBF5}>
        <div key="03FC057B-1296-48C0-B0E0-0F1DE6A851EC" className={style.F1DE6A851EC}><ZeroCodeGridLayout
          layout={F1DE6A851EC}>
          <div key="3C23EFE7-ABDF-4769-96E9-430E0DF67094" className={style.E0DF67094}><ZeroCodeGridLayout
            layout={E0DF67094}>
            <div key="D355114D-A813-4154-A227-B0062A6BDF52" className={style.B0062A6BDF52}><ZeroCodeGridLayout
              layout={B0062A6BDF52}>
              <div key="03394707-1ECF-4D1E-A838-26E079FA73D7" className={style.E079FA73D7}><ZeroCodeGridLayout
                layout={E079FA73D7}>
                <div key="D9936EA7-9DA1-4A5C-AFE9-5E0EF3E180AD">
                  <div className={style.E0EF3E180AD}>Metadata modeling</div>
                </div>
                <div key="339150DA-BDF7-4A54-9205-7DAE6C568C78"><Image preview={false} src={"/erd/元数据建模.svg"}/></div>
              </ZeroCodeGridLayout></div>
            </ZeroCodeGridLayout></div>
            <div key="A9A1628C-718E-4807-B1A4-B245C4FFFF40" className={style.B245C4FFFF40}></div>
            <div key="38A5F68C-C6FA-420B-942E-1F8886065B3D" className={style.F8886065B3D}><ZeroCodeGridLayout
              layout={F8886065B3D}>
              <div key="4E4A78B6-1AD8-49EE-A379-1ED72AC85E45" className={style.ED72AC85E45}></div>
            </ZeroCodeGridLayout></div>
            <div key="72F8F22A-B889-4453-BD3D-8D05FA0EA492" className={style.D05FA0EA492}><ZeroCodeGridLayout
              layout={D05FA0EA492}>
              <div key="0880D20C-BAE0-4095-9D76-0197C626995B">
                <div className={style.C626995B}>Home</div>
              </div>
              <div key="E7D89249-2754-4911-831D-A9CA5FE66713"><Image preview={false} src={"/erd/首页.svg"}/></div>
            </ZeroCodeGridLayout></div>
            <div key="41BB0E66-AF8E-4F90-816D-6B56EC4F2D9B" className={style.B56EC4F2D9B}><ZeroCodeGridLayout
              layout={B56EC4F2D9B}>
              <div key="81D9C25D-7F16-4E10-A9A1-9FEEC3D8B965">
                <div className={style.FEEC3D8B965}>System management</div>
              </div>
              <div key="8CC1F54A-E5C4-4046-B2CF-D668EA63D7F9"><Image preview={false} src={"/erd/系统管理.svg"}/></div>
            </ZeroCodeGridLayout></div>
          </ZeroCodeGridLayout></div>
        </ZeroCodeGridLayout></div>
      </ZeroCodeGridLayout></div>
      {children}
    </>
  );
}
export default ProjectLayout
