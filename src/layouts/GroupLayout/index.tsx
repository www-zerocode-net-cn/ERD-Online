import React, {useEffect, useState} from "react";
import {PageContainer, ProCard, ProLayout, ProSettings, WaterMark} from "@ant-design/pro-components";
import defaultProps from './_defaultProps';
import {Me} from "@icon-park/react";
import {Button, Dropdown} from "antd";
import {logout} from "@/utils/request";
import * as cache from "@/utils/cache";
import {fixRouteAccess, headRightContent} from "@/layouts/DesignLayout";
import {history, Link, Outlet, useModel, useSearchParams} from "@umijs/max";
import {GET} from "@/services/crud";
import {useAccess} from "@@/plugin-access";
import {CONSTANT} from "@/utils/constant";
import Theme from "@/components/Theme";


export type GroupLayoutProps = {};

const GroupLayout: React.FC<GroupLayoutProps> = (props) => {
  const {initialState, setInitialState} = useModel('@@initialState');
  const access = useAccess();


  const [pathname, setPathname] = useState('/project/home');


  const [searchParams] = useSearchParams();
  let projectId = searchParams.get("projectId") || '';
  if (!projectId || projectId === '') {
    projectId = cache.getItem(CONSTANT.PROJECT_ID) || '';
  }

  console.log(19, 'projectId', projectId);
  console.log(24, initialState);
  useEffect(() => {
    GET("/ncnb/project/group/currentRolePermission", {
      projectId
    }).then(r => {
      console.log(29, r);
      if (r?.code === 200) {
        r?.data?.permission?.push('initialized');
        setInitialState((s: any) => ({...s, access: r.data}));
      }
    })
  }, [access.initialized, defaultProps.route.routes])

  //权限初始化之后再过滤路由
  console.log(106, 'access.initialized', access);
  if (access.initialized) {
    defaultProps.route.routes = fixRouteAccess(defaultProps, access);
    console.log(54, defaultProps)
  }

  const settings: ProSettings | undefined = {
    "layout": "mix",
    "navTheme": "light",
    "contentWidth": "Fluid",
    "fixSiderbar": true,
    "siderMenuType": "group",
    "fixedHeader": true
  };

  return (
    <WaterMark content={['ERD Online', 'V4.1.0']}>
      <ProLayout
        logo={"/logo.svg"}
        title={"ERD Online"}
        {...defaultProps}
        location={{
          pathname,
        }}
        avatarProps={{
          src: <Me theme="filled" size="28" fill="#DE2910" strokeWidth={2}/>,
          title: <Dropdown overlay={<Button onClick={() => {
            setInitialState((s: any) => ({...s, access: {}}));
            logout();
          }}>退出登录</Button>} placement="bottom"
                           arrow={{pointAtCenter: true}}>
            <div>{cache.getItem('username')}</div>
          </Dropdown>,
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
              <div>© 2023 Made with 零代科技</div>
              <div>ERD Online</div>
            </div>
          );
        }}
        onMenuHeaderClick={(e) => history.push("/")}
        menuItemRender={(item, dom) => {
          return (
            item.path?.startsWith('http') || item.exact
              ? <a href={item?.path || '/project'} target={'_blank'}>{dom}</a>
              :

              <div
                onClick={() => {
                  console.log(153, item);
                  setPathname(item.path || '/project/home');
                  console.log(85, searchParams);
                }}
              >
                <Link to={item?.path + "?projectId=" + projectId || '/project/home'}>{dom}</Link>
              </div>
          )
        }}

        {...settings}
      >
        <PageContainer
          title={false}
          fixedHeader
          breadcrumbRender={false}>
          <ProCard
            style={{
              minHeight: '85vh',
            }}
          >
            <Theme/>
          </ProCard>
        </PageContainer>
      </ProLayout>
    </WaterMark>
  );
};

export default React.memo(GroupLayout)
