import React, {useEffect, useState} from "react";
import {PageContainer, ProCard, ProLayout, ProSettings, WaterMark} from "@ant-design/pro-components";
import defaultProps from './_defaultProps';
import {Me} from "@icon-park/react";
import {Button, Dropdown} from "antd";
import {logout} from "@/utils/request";
import * as cache from "@/utils/cache";
import {headRightContent} from "@/layouts/CommonLayout";
import {history, Link, Outlet, useModel, useSearchParams} from "@umijs/max";
import {get} from "@/services/crud";
import {useAccess} from "@@/plugin-access";
import {CONSTANT} from "@/utils/constant";

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
    get("/ncnb/project/group/currentRolePermission", {
      projectId
    }).then(r => {
      console.log(29, r);
      if (r?.code === 200) {
        setInitialState((s: any) => ({...s, access: r.data}));
      }
    })

  }, [])

  const settings: ProSettings | undefined = {
    "layout": "mix",
    "navTheme": "light",
    "contentWidth": "Fluid",
    "fixSiderbar": true,
    "siderMenuType": "group",
    "fixedHeader": true
  };

  const defaultPropsTmp = defaultProps.route.routes.map((m: any) => {
    const pathAccess = access[m?.access];
    console.log(48, pathAccess, m);
    if (pathAccess !== 'false') {
      return {
        ...m,
        routes: m?.routes?.map((m1: any) => {
          const pathAccess1 = access[m1?.access];
          if (pathAccess1 !== 'false') {
            return m1;
          }
        })
      };
    }
  });
  defaultProps.route.routes = defaultPropsTmp;

  console.log(54, defaultPropsTmp)

  return (
    <WaterMark content={['ERD Online', 'V4.0.3']}>
      <ProLayout
        logo={"/logo.svg"}
        title={"ERD Online Pro"}
        {...defaultProps}
        location={{
          pathname,
        }}
        avatarProps={{
          src: <Me theme="filled" size="28" fill="#DE2910" strokeWidth={2}/>,
          title: <Dropdown overlay={<Button onClick={logout}>退出登录</Button>} placement="bottom"
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
              <div>© 2022 Made with 零代</div>
              <div>ERD Online Pro</div>
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
                  console.log(85, searchParams)
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
            <Outlet/>
          </ProCard>
        </PageContainer>
      </ProLayout>
    </WaterMark>
  );
};

export default React.memo(GroupLayout)
