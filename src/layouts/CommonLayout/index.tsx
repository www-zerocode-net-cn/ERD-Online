import React, {useState} from 'react';
import useProjectStore from "@/store/project/useProjectStore";
import {GithubFilled, InfoCircleFilled, PlusCircleFilled, QuestionCircleFilled} from "@ant-design/icons";
import {PageContainer, ProLayout, ProSettings} from "@ant-design/pro-layout";
import defaultProps from './_defaultProps';
import DesignLeftContent from "@/components/LeftContent/DesignLeftContent";
import {Link} from "umi";
import shallow from "zustand/shallow";
import _ from 'lodash';


export interface CommonLayoutLayoutProps {
  children: any;
}

const CommonLayout: React.FC<CommonLayoutLayoutProps> = props => {
  console.log(17, props);
  // @ts-ignore
  console.log(18, props?.location?.pathname);
  // @ts-ignore
  const [pathname, setPathname] = useState(props?.location?.pathname || 'design/table/model');


  const {children} = props;
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
    <div
      id="test-pro-layout"
      style={{
        height: '100vh',
      }}
    >
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
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: <div>七妮妮</div>,
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
          return [
            props.layout !== 'side' && document.body.clientWidth > 1400 ? (
              <div
                key="SearchOutlined"
                aria-hidden
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  marginInlineEnd: 24,
                }}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
              >
                <PlusCircleFilled
                  style={{
                    color: 'var(--ant-primary-color)',
                    fontSize: 24,
                  }}
                />
              </div>
            ) : undefined,
            <InfoCircleFilled key="InfoCircleFilled"/>,
            <QuestionCircleFilled key="QuestionCircleFilled"/>,
            <GithubFilled key="GithubFilled"/>,
          ];
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
              {item.icon} {item.name}
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
          {children}
        </PageContainer>
      </ProLayout>
    </div>
  );
}
export default React.memo(CommonLayout)
