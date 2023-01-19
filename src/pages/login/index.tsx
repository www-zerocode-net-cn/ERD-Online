import {LockOutlined, MobileOutlined, UserOutlined, WechatOutlined,} from '@ant-design/icons';
import {LoginFormPage, ProFormCaptcha, ProFormText,} from '@ant-design/pro-components';
import {Button, Divider, message, Popover, Space, Tabs} from 'antd';
import type {CSSProperties} from 'react';
import {useState} from 'react';
import * as cache from "@/utils/cache";
import {history} from '@@/exports';
import request, {BASE_URL} from "@/utils/request";

type LoginType = 'phone' | 'account';

const iconStyles: CSSProperties = {
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '18px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

export async function login(username: string, password: string) {
  await request.get(
    '/auth/oauth/token?username=' + username + '&password=' + password + '&grant_type=password&scope=select'
  ).then(res => {
    if (res) {
      if (res.access_token) {
        cache.setItem('Authorization', res.access_token);
        cache.setItem('username', username);
        history.push({
          pathname: "/project/home"
        });
      }
    }
  });
}

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');

  return (
    <div style={{backgroundColor: 'white', height: 'calc(100vh - 48px)', margin: 24}}>
      <LoginFormPage
        backgroundImageUrl="../login-bg.jpg"
        logo="../logo.svg"
        title="ERD Online"
        subTitle="全球第一个开源在线数据库建模平台"
        onFinish={async (values: any) => {
          console.log(29, values);
          let username = values.username;
          let password = values.password;
          await login(username, password);
        }}
        activityConfig={{
          style: {
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            borderRadius: 8,
            backgroundColor: '#1677FF',
          },
          title: 'ERD Online 4.0.7发布',
          subTitle: '全新升级，团队协作，权限控制',
          action: (
            <Button
              size="large"
              style={{
                borderRadius: 20,
                background: '#fff',
                color: '#1677FF',
                width: 120,
              }}
              onClick={() => {
                window.location.href = "https://github.com/orgs/www-zerocode-net-cn/discussions"
              }}
            >
              去看看
            </Button>
          ),
        }}
        actions={
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <Divider plain>
              <span style={{color: '#CCC', fontWeight: 'normal', fontSize: 14}}>
                其他登录方式
              </span>
            </Divider>
            <Space align="center" size={24}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'column',
                  height: 40,
                  width: 40,
                  border: '1px solid #D4D8DD',
                  borderRadius: '50%',
                }}
              >
                <Popover
                  content={
                    <iframe src={`${BASE_URL}/auth/oauth2/authorization/wechat`}
                            style={{"border": "none"}}
                            scrolling="no" height="400px"
                            sandbox="allow-scripts  allow-top-navigation"/>
                  }
                  trigger="click"
                  placement="left"
                >
                  <WechatOutlined style={{...iconStyles, color: '#FF6A10'}}/>
                </Popover>
              </div>

            </Space>
          </div>
        }
      >
        <Tabs
          centered
          activeKey={loginType}
          onChange={(activeKey) => setLoginType(activeKey as LoginType)}
        >
          <Tabs.TabPane key={'account'} tab={'账号密码登录'}/>
          {/*<Tabs.TabPane key={'phone'} tab={'手机号登录'} />*/}
        </Tabs>
        {loginType === 'account' && (
          <>
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large',
                prefix: <UserOutlined className={'prefixIcon'}/>,
              }}
              placeholder={'用户名'}
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'}/>,
              }}
              placeholder={'密码'}
              rules={[
                {
                  required: true,
                  message: '请输入密码！',
                },
              ]}
            />
          </>
        )}
        {loginType === 'phone' && (
          <>
            <ProFormText
              fieldProps={{
                size: 'large',
                prefix: <MobileOutlined className={'prefixIcon'}/>,
              }}
              name="mobile"
              placeholder={'手机号'}
              rules={[
                {
                  required: true,
                  message: '请输入手机号！',
                },
                {
                  pattern: /^1\d{10}$/,
                  message: '手机号格式错误！',
                },
              ]}
            />
            <ProFormCaptcha
              fieldProps={{
                size: 'large',
                prefix: <LockOutlined className={'prefixIcon'}/>,
              }}
              captchaProps={{
                size: 'large',
              }}
              placeholder={'请输入验证码'}
              captchaTextRender={(timing, count) => {
                if (timing) {
                  return `${count} ${'获取验证码'}`;
                }
                return '获取验证码';
              }}
              name="captcha"
              rules={[
                {
                  required: true,
                  message: '请输入验证码！',
                },
              ]}
              onGetCaptcha={async () => {
                message.success('获取验证码成功！验证码为：1234');
              }}
            />
          </>
        )}
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <Button type={"link"} onClick={() => {
            history.push({
              pathname: '/register'
            });
          }}>
            注册
          </Button>
          <a
            style={{
              float: 'right',
            }}
            onClick={() => {
              message.warning("请联系管理员修改密码");
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};
