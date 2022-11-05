import React, {useState} from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import defaultProps from './_defaultProps';
import DesignLeftContent from "@/components/LeftContent/DesignLeftContent";
import {Link} from "@umijs/max";
import shallow from "zustand/shallow";
import _ from 'lodash';
import {PageContainer, ProCard, ProLayout, ProSettings, WaterMark} from "@ant-design/pro-components";
import {history, Outlet, useSearchParams} from "@@/exports";
import {Me, TwoDimensionalCodeOne, TwoDimensionalCodeTwo, WeixinMiniApp} from "@icon-park/react";
import {Button, Dropdown, Image, Popover} from "antd";
import {logout} from "@/utils/request";
import * as cache from "@/utils/cache";


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
  <a style={{marginTop:'-10px'}} target={"_blank"} href='https://gitee.com/MARTIN-88/erd-online'><img
    src='https://gitee.com/MARTIN-88/erd-online/badge/star.svg?theme=white' alt='star'></img></a>,

];

export interface CommonLayoutLayoutProps {
  children: any;
}

const CommonLayout: React.FC<CommonLayoutLayoutProps> = props => {
  console.log(17, props);
  const [pathname, setPathname] = useState('/design/table/model');
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("projectId") || '';

  console.log(19, 'projectId', projectId);

  const {fetch, project} = useProjectStore(
    state => ({
      fetch: state.fetch,
      project: state.project
    }), shallow);


  console.log(34, project);
  if (_.isEmpty(project) || _.isEmpty(project.projectJSON)) {
    fetch();
  }

  const settings: Partial<ProSettings> | undefined = {
    fixSiderbar: true,
    layout: 'mix',
    splitMenus: true,

  };


  return (
    <WaterMark content={['ERD Online', 'V4.0.3']}>
      <ProLayout
        logo={"/logo.svg"}
        title={'ERD Online Pro'}
        bgLayoutImgList={[
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            left: 85,
            bottom: 100,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i2/O1CN01O4etvp1DvpFLKfuWq_!!6000000000279-2-tps-609-606.png',
            bottom: -68,
            right: -45,
            height: '303px',
          },
          {
            src: 'https://img.alicdn.com/imgextra/i3/O1CN018NxReL1shX85Yz6Cx_!!6000000005798-2-tps-884-496.png',
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
          title: <Dropdown overlay={<Button onClick={logout}>退出登录</Button>} placement="bottom"
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
                  // navigate(`${item?.path}?${createSearchParams({projectId})}`)
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
export default React.memo(CommonLayout)
