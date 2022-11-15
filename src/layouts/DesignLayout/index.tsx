import React, {useEffect, useState} from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import defaultProps from './_defaultProps';
import DesignLeftContent from "@/components/LeftContent/DesignLeftContent";
import {Link, useModel} from "@umijs/max";
import shallow from "zustand/shallow";
import _ from 'lodash';
import {PageContainer, ProCard, ProLayout, ProSettings, WaterMark} from "@ant-design/pro-components";
import {history, Outlet, useSearchParams} from "@@/exports";
import {Me, TwoDimensionalCodeOne, TwoDimensionalCodeTwo, WeixinMiniApp} from "@icon-park/react";
import {Button, Dropdown, Image, Popover} from "antd";
import {logout} from "@/utils/request";
import * as cache from "@/utils/cache";
import {useAccess} from "@@/plugin-access";
import {get} from "@/services/crud";
import {CONSTANT} from "@/utils/constant";


export const headRightContent = [

  <Popover placement="bottom" title="公众号" content={<Image src="/gongzhonghao.jpg"/>} trigger="hover">
    <TwoDimensionalCodeOne theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
  </Popover>,
  <Popover placement="bottom" title="微信群" content={<Image src="/zerocode.png"/>} trigger="hover">
    <TwoDimensionalCodeTwo theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
  </Popover>,
  <Popover placement="bottom" title="小程序" content={<Image src="/xiaochengxu.jpg"/>} trigger="hover">
    <WeixinMiniApp theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
  </Popover>,
  <a style={{marginTop: '-10px'}} target={"_blank"} href='https://gitee.com/MARTIN-88/erd-online'><img
    src='https://gitee.com/MARTIN-88/erd-online/badge/star.svg?theme=white' alt='star'></img></a>,

];

export interface DesignLayoutLayoutProps {
  children: any;
}

export function fixRouteAccess(defaultPropsTmp: any, access: any) {
  const routes = defaultPropsTmp.route.routes.map((m: any) => {
    const pathAccess = access[m?.access];
    console.log(48, pathAccess, m);
    if (pathAccess !== false) {
      return {
        ...m,
        routes: m?.routes?.map((m1: any) => {
          const pathAccess1 = access[m1?.access];
          if (pathAccess1 !== false) {
            return m1;
          }
        })
      };
    }
  });

  return routes;

}

const DesignLayout: React.FC<DesignLayoutLayoutProps> = props => {
  const access = useAccess();

  console.log(17, props);
  const [pathname, setPathname] = useState('/design/table/model');
  const [searchParams] = useSearchParams();
  let projectId = searchParams.get("projectId") || '';
  if (!projectId || projectId === '') {
    projectId = cache.getItem(CONSTANT.PROJECT_ID) || '';
  }

  console.log(19, 'projectId', projectId);

  const {fetch, project} = useProjectStore(
    state => ({
      fetch: state.fetch,
      project: state.project
    }), shallow);

  useEffect(() => {
    fetch();
  }, [projectId]);
  console.log(34, project);


  const settings: Partial<ProSettings> | undefined = {
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,

  };
  const {setInitialState} = useModel('@@initialState');

  useEffect(() => {
    console.log(69, access,project.type)
    if (project && project.type === '2') {
      get("/ncnb/project/group/currentRolePermission", {
        projectId
      }).then(r => {
        console.log(29, r);
        if (r?.code === 200) {
          r?.data?.permission?.push('initialized');
          setInitialState((s: any) => ({...s, access: {...r.data, person: false}}));
        }
      })
      //权限初始化之后再过滤路由
      console.log(106, 'access.initialized', access);
      if (access.initialized) {
        defaultProps.route.routes = fixRouteAccess(defaultProps, access);
        console.log(54, defaultProps)
      }
    } else {
      setInitialState((s: any) => ({...s, access: {person: true}}));
    }
  }, [project, access.initialized, defaultProps.route.routes])


  return (
    <WaterMark content={['ERD Online', 'V4.0.3']}>
      <ProLayout
        logo={"/logo.svg"}
        title={'ERD Online Pro'}
        bgLayoutImgList={[
          {
            src: '/ant-1.png',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: '/ant-1.png',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: '/ant-3.png',
            bottom: 0,
            left: 0,
            width: '331px',
          },
        ]}
        {...defaultProps}
        location={{
          pathname,
          search: 'a=1'
        }}
        menu={{
          type: 'group',
        }}
        avatarProps={{
          src: <Me theme="filled" size="28" fill="#DE2910" strokeWidth={2}/>,
          size: 'small',
          title: <Dropdown overlay={<Button onClick={() => {
            setInitialState((s: any) => ({...s, access: {}}));
            logout();
          }}>退出登录</Button>} placement="bottom"
                           arrow={{pointAtCenter: true}}>
            <div>{cache.getItem('username')}</div>
          </Dropdown>,
        }}
        menuExtraRender={(props) => {
          console.log(118, props)
          return (
            pathname === '/design/table/model' ? <DesignLeftContent collapsed={props.collapsed}/> : null

          )
        }}
        siderWidth={333}
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
              <div>{project.projectName}</div>
              <div>© 2022 Made with 零代</div>
              <div>ERD Online Pro</div>
            </div>
          );
        }}
        onMenuHeaderClick={(e) => history.push("/")}
        itemRender={(route, params, routes, paths) => {
          console.log(141, route, params, routes, paths)
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuItemRender={(item, dom) => {
          return (

            item.path?.startsWith('http') || item.exact ?
              <a href={item.path} target={'_blank'}>
                {dom}
              </a>
              :
              <div
                onClick={() => {
                  console.log(153, item);
                  setPathname(item?.path || pathname);
                }}
              >
                <Link to={item?.path + "?projectId=" + projectId || '/project/home'}>{dom}</Link>
              </div>

          );
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
}
export default React.memo(DesignLayout)
