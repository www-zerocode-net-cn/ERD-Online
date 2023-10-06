import React, {useLayoutEffect, useRef, useState} from 'react';
import {GridContent} from '@ant-design/pro-layout';
import {Dropdown, Menu} from 'antd';
import BaseView from './components/base';
import BindingView from './components/binding';
import SecurityView from './components/security';
import styles from './style.less';
import Identification from "@/pages/account/settings/components/identification";
import {PageContainer, ProCard, ProLayout, ProSettings, WaterMark} from '@ant-design/pro-components';
import {headRightContent} from "@/layouts/DesignLayout";
import {Me} from "@icon-park/react";
import * as cache from "@/utils/cache";
import {menuHeaderDropdown} from "@/layouts/HomeLayout";
import {useSearchParams} from "@@/exports";

const {Item} = Menu;

type SettingsStateKeys = 'base' | 'security' | 'binding' | 'identification';
type SettingsState = {
  mode: 'inline' | 'horizontal';
  selectKey: SettingsStateKeys;
};

const Settings: React.FC = () => {
  const menuMap: Record<string, React.ReactNode> = {
    base: '基本设置',
    security: '安全设置',
    // binding: '账号绑定',
    identification: '授权类型',
  };

  const [searchParams] = useSearchParams();
  let selectKey = searchParams.get("selectKey") || 'base';
  console.log(34, selectKey);

  const [initConfig, setInitConfig] = useState<SettingsState>({
    mode: 'inline',
    // @ts-ignore
    selectKey,
  });
  const dom = useRef<HTMLDivElement>();

  const resize = () => {
    requestAnimationFrame(() => {
      if (!dom.current) {
        return;
      }
      let mode: 'inline' | 'horizontal' = 'inline';
      const {offsetWidth} = dom.current;
      if (dom.current.offsetWidth < 641 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      if (window.innerWidth < 768 && offsetWidth > 400) {
        mode = 'horizontal';
      }
      setInitConfig({...initConfig, mode: mode as SettingsState['mode']});
    });
  };

  useLayoutEffect(() => {
    if (dom.current) {
      window.addEventListener('resize', resize);
      resize();
    }
    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [dom.current]);

  const getMenu = () => {
    return Object.keys(menuMap).map((item) => <Item key={item}>{menuMap[item]}</Item>);
  };

  const renderChildren = () => {
    const {selectKey} = initConfig;
    switch (selectKey) {
      case 'base':
        return <BaseView/>;
      case 'security':
        return <SecurityView/>;
      case 'binding':
        return <BindingView/>;
      case 'identification':
        return <Identification/>;
      default:
        return null;
    }
  };
  const settings: ProSettings | undefined = {
    fixSiderbar: true,
    layout: 'top',
    splitMenus: true,
  };
  const [pathname, setPathname] = useState('/project/home');


  const licence = cache.getItem2object('licence');
  console.log(154, licence, licence?.licensedTo, licence.licensedStartTime);

  return (
    <WaterMark content={[licence?.licensedTo?licence?.licensedTo:'ERD Online', 'V5.0.0']}>

      <ProLayout
        logo={"/logo.svg"}
        title={"ERD Online"}
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
        location={{
          pathname,
        }}
        avatarProps={{
          src: <Me theme="filled" size="28" fill="#DE2910" strokeWidth={2}/>,
          title: <Dropdown
            placement="bottom"
            arrow={{pointAtCenter: true}}
            overlay={menuHeaderDropdown}>
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
        {...settings}
      >
        <PageContainer title={false}>
          <ProCard
            style={{
              height: '80vh',
              minHeight: 800,
            }}
          >
            <GridContent>
              <div
                className={styles.main}
                ref={(ref) => {
                  if (ref) {
                    dom.current = ref;
                  }
                }}
              >
                <div className={styles.leftMenu}>
                  <Menu
                    mode={initConfig.mode}
                    selectedKeys={[initConfig.selectKey]}
                    onClick={({key}) => {
                      setInitConfig({
                        ...initConfig,
                        selectKey: key as SettingsStateKeys,
                      });
                    }}
                  >
                    {getMenu()}
                  </Menu>
                </div>
                <div className={styles.right}>
                  <div className={styles.title}>{menuMap[initConfig.selectKey]}</div>
                  {renderChildren()}
                </div>
              </div>
            </GridContent>
          </ProCard>
        </PageContainer>
      </ProLayout>
    </WaterMark>

  );
};
export default Settings;
