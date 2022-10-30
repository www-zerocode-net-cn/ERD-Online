import {PageContainer, ProLayout, ProSettings} from '@ant-design/pro-layout';
import React, {useState} from 'react';
import defaultProps from './_defaultProps';
import {Link, Outlet} from "@@/exports";
import {ProCard, WaterMark} from '@ant-design/pro-components';
import {Me} from "@icon-park/react";
import {avatarTitle, headRightContent} from "@/layouts/CommonLayout";


export interface HomeLayoutLayoutProps {
  children: any;
}

const HomeLayout: React.FC<HomeLayoutLayoutProps> = props => {
  const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');

  const settings: ProSettings | undefined = {
    "layout": "mix",
    "navTheme": "light",
    "contentWidth": "Fluid",
    "fixSiderbar": true,
    "colorPrimary": "#1890ff",
    "siderMenuType": "group",
    "fixedHeader": true
  };

  return (
    <WaterMark content={['ERD Online', 'V4.0.3']}>
      <ProLayout
        logo={"/logo.svg"}
        // @ts-ignore
        title={<Link to={"/"}>ERD Online Pro</Link>}
        {...defaultProps}
        location={{
          pathname,
        }}
        avatarProps={{
          src: <Me theme="filled" size="28" fill="#DE2910" strokeWidth={2}/>,
          title: avatarTitle,
        }}
        actionsRender={(props) => {
          if (props.isMobile) return [];
          return headRightContent;
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <div
              style={{
                textAlign: 'center',
                paddingBlockStart: 12,
              }}
            >
              <div>© 2022 Made with 零代</div>
              <div>ERD Online Pro</div>
            </div>
          );
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => (
          item.path?.startsWith('http') || item.exact ?
            <a href={item.path} target={'_blank'}>
              {dom}
            </a>
            :

            <a
              onClick={() => {
                console.log(153, item);
                setPathname(item.path || '/project');
              }}
            >
              <Link to={item?.path || '/project'}>{dom}</Link>
            </a>
        )}
        {...settings}
      >
        <PageContainer
          title={false}
        >
          <ProCard
            style={{
              minHeight: '85vh',
            }}
          >
            <Outlet/>
          </ProCard>
        </PageContainer>
      </ProLayout>
    </WaterMark>
  );
};
export default React.memo(HomeLayout);
