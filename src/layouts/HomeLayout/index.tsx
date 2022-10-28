import {GithubFilled, InfoCircleFilled, QuestionCircleFilled,} from '@ant-design/icons';
import {PageContainer, ProLayout, ProSettings} from '@ant-design/pro-layout';
import React, {useState} from 'react';
import defaultProps from './_defaultProps';
import {Link, Outlet} from "@@/exports";
import {ProCard} from '@ant-design/pro-components';


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
    <ProLayout
      logo={"/logo.svg"}
      // @ts-ignore
      title={<Link to={"/"}>ERD Online Pro</Link>}
      {...defaultProps}
      location={{
        pathname,
      }}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'small',
        title: '七妮妮',
      }}
      actionsRender={(props) => {
        if (props.isMobile) return [];
        return [
          props.layout !== 'side' ? (
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
      menuItemRender={(item, dom) => (
        item.path?.startsWith('http') || item.exact ?
          <a href={item.path} target={'_blank'}>
            {item.icon} {item.name}
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
  );
};
export default React.memo(HomeLayout);
