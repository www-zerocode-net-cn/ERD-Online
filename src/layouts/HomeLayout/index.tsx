import {
  GithubFilled,
  InfoCircleFilled,
  PlusCircleFilled,
  QuestionCircleFilled,
  SearchOutlined,
} from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import {PageContainer, ProLayout, ProSettings} from '@ant-design/pro-layout';
import {Button, Divider, Input} from 'antd';
import React, {useState} from 'react';
import defaultProps from './_defaultProps';
import {Link} from "umi";
import MenuDivider from "antd/lib/menu/MenuDivider";


export interface HomeLayoutLayoutProps {
  children: any;
}

const HomeLayout: React.FC<HomeLayoutLayoutProps> = props => {
  const [pathname, setPathname] = useState('/list/sub-page/sub-sub-page1');

  const {children} = props;

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
              <Input
                style={{
                  borderRadius: 4,
                  marginInlineEnd: 12,
                  backgroundColor: 'rgba(0,0,0,0.03)',
                }}
                prefix={
                  <SearchOutlined
                    style={{
                      color: 'rgba(0, 0, 0, 0.15)',
                    }}
                  />
                }
                placeholder="搜索方案"
                bordered={false}
              />
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
      menuItemRender={(item, dom) => (
        item.path?.startsWith('http') || item.exact ?
          <div>
            {item.icon} {item.name}
            <a href={item.path} target={'_blank'}>
              <MenuDivider/>
            </a>
          </div>
          :
          <div>
            <a
              onClick={() => {
                console.log(153, item);
                setPathname(item.path || '/project');
              }}
            >
              <Link to={item?.path || '/project'}>{dom}</Link>
            </a>
            <MenuDivider/>
          </div>

      )}
    >
      <PageContainer
        title={false}
      >
        <ProCard
          style={{
            minHeight: '85vh',
          }}
        >
          {children}
        </ProCard>
      </PageContainer>
    </ProLayout>
  );
};
export default React.memo(HomeLayout);
