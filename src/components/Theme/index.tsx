import React from "react";
import {ConfigProvider} from "antd";
import {Outlet} from "@@/exports";

export type indexProps = {};
const Theme: React.FC<indexProps> = (props) => {
  return (<>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#DE2910',
        },
      }}
    >
      <Outlet/>
    </ConfigProvider>
  </>);
};

export default React.memo(Theme)
