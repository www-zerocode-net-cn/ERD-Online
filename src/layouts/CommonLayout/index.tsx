import React, {useState} from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import {PageContainer, ProLayout, ProSettings} from "@ant-design/pro-layout";
import defaultProps from './_defaultProps';
import DesignLeftContent from "@/components/LeftContent/DesignLeftContent";
import {Link} from "@umijs/max";
import shallow from "zustand/shallow";
import _ from 'lodash';
import {ProCard, WaterMark} from "@ant-design/pro-components";
import {Outlet} from "@@/exports";
import {Me, TwoDimensionalCodeOne, TwoDimensionalCodeTwo, WeixinMiniApp} from "@icon-park/react";
import {Popover, Image, Button, Dropdown} from "antd";


export const headRightContent = [
  <a target={"_blank"} href='https://gitee.com/MARTIN-88/erd-online'><img
    src='https://gitee.com/MARTIN-88/erd-online/widgets/widget_6.svg' alt='Fork me on Gitee'></img></a>,
  <a target={"_blank"} href='https://gitee.com/MARTIN-88/erd-online/stargazers'><img
    src='https://gitee.com/MARTIN-88/erd-online/badge/star.svg?theme=white' alt='star'></img></a>,
  <Popover placement="bottom" title="公众号" content={<Image src="/gongzhonghao.jpg"/>} trigger="hover">
    <TwoDimensionalCodeOne theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
  </Popover>,
  <Popover placement="bottom" title="微信群" content={<Image src="/zerocode.png"/>} trigger="hover">
    <TwoDimensionalCodeTwo theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
  </Popover>,
  <Popover placement="bottom" title="小程序" content={<Image src="/xiaochengxu.jpg"/>} trigger="hover">
    <WeixinMiniApp theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
  </Popover>
];

export const avatarTitle = <Dropdown overlay={<Button>退出登录</Button>} placement="bottom" arrow={{pointAtCenter: true}}>
  <div>七妮妮</div>
</Dropdown>;

export interface CommonLayoutLayoutProps {
  children: any;
}

const CommonLayout: React.FC<CommonLayoutLayoutProps> = props => {
  console.log(17, props);
  // @ts-ignore
  console.log(18, props?.location?.pathname);
  // @ts-ignore
  const [pathname, setPathname] = useState(props?.location?.pathname || 'design/table/model');

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
        // @ts-ignore
        title={<Link to={"/"}>ERD Online Pro</Link>}
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
        }}
        menu={{
          type: 'group',
        }}
        avatarProps={{
          src: <Me theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
          size: 'small',
          title: avatarTitle,
        }}
        menuExtraRender={(props) => {
          console.log(118, props)
          return (
            props.location.pathname === '/design/table/model' ? <DesignLeftContent collapsed={props.collapsed}/> : null

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
        onMenuHeaderClick={(e) => console.log(e)}
        itemRender={(route, params, routes, paths) => {
          console.log(141, route, params, routes, paths)
          const first = routes.indexOf(route) === 0;
          return first ? (
            <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
          ) : (
            <span>{route.breadcrumbName}</span>
          );
        }}
        menuItemRender={(item, dom) => (

          item.path?.startsWith('http') || item.exact ?
            <a href={item.path} target={'_blank'}>
              {dom}
            </a>
            :
            <a
              onClick={() => {
                console.log(153, item);
                setPathname(item.path || '/design/table/model');
              }}
            >
              <Link to={item?.path || '/design/table/model'}>{dom}</Link>
            </a>

        )}
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
