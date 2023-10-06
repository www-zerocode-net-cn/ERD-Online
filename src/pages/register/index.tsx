import {LoginFormPage, ProFormText,} from '@ant-design/pro-components';
import {Button, message} from 'antd';
import {POST} from "@/services/crud";
import {login} from "@/pages/login";


export default () => {
  return (
    <div style={{backgroundColor: 'white', height: 'calc(100vh - 48px)', margin: 24}}>
      <LoginFormPage
        backgroundImageUrl="../bg2.png"
        logo="../logo.svg"
        title="ERD Online"
        subTitle="全球第一个开源在线数据库建模平台"
        onFinish={async (values: any) => {
          console.log(29, values);
          let username = values.username;
          let pwd = values.pwd;
          let pwdCK = values.pwdCK;
          let email = values.email;
          let phone = values.phone;
          if (pwd !== pwdCK) {
            message.error("两次输入的密码不一致")
            return;
          }
          await POST(
            '/ncnb/project/group/user/register',
            {
              username, pwd, email, phone
            }
          ).then(r => {
            if (r.code === 200) {
              message.success("注册成功！");
              setTimeout(() => console.log('注册成功'), 1000);
              login(username, pwd);
            }
          });
        }}
        activityConfig={{
          style: {
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
            color: '#fff',
            borderRadius: 8,
            backgroundColor: '#f16824',
          },
          title: 'ERD Online 5.0.0发布',
          subTitle: '全新升级，团队协作，权限控制，接入ChatGPT，智能SQL',
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
      >
        <ProFormText
          width="md"
          name="username"
          label="用户名"
          tooltip="最长为 18 位"
          placeholder="请输入用户名"
          formItemProps={{
            rules: [
              {
                required: true,
                message: '不能为空',
              },
              {
                max: 18,
                message: '不能大于 18 个字符',
              },
            ],
          }}
        />
        <ProFormText.Password
          width="md"
          name="pwd"
          label="密码"
          tooltip="密码至少包含 数字和英文，长度6-20"
          placeholder="请输入密码"
          formItemProps={{
            rules: [
              {
                required: true,
                message: '密码不能为空',
              },
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                message: '密码至少包含 数字和英文，长度6-20',
              },
            ],
          }}
        />
        <ProFormText.Password
          width="md"
          name="pwdCK"
          label="确认密码"
          tooltip="密码至少包含 数字和英文，长度6-20"
          placeholder="请输入密码"
          formItemProps={{
            rules: [
              {
                required: true,
                message: '密码不能为空',
              },
              {
                pattern: /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/,
                message: '密码至少包含 数字和英文，长度6-20',
              },
            ],
          }}
        />
        <ProFormText
          width="md"
          name="email"
          label="邮箱"
          tooltip="标准邮箱地址"
          placeholder="请输入邮箱"
          formItemProps={{
            rules: [
              {
                required: true,
                message: '邮箱不能为空',
              },
              {
                pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((.[a-zA-Z0-9_-]{2,3}){1,2})$/,
                message: '请输入正确的邮箱地址'
              }
            ],
          }}
        />
        <ProFormText
          name='phone'
          width="md"
          label="手机号码"
          tooltip="标准手机号码"
          placeholder="请输入手机号码"
          formItemProps={{
            rules: [
              {
                required: true,
                message: '手机号码不能为空',
              },
              {
                pattern: /^1(3[0-9]|4[01456879]|5[0-3,5-9]|6[2567]|7[0-8]|8[0-9]|9[0-3,5-9])\d{8}$/,
                message: '请输入正确的手机号'
              }
            ],
          }}
        />


      </LoginFormPage>
    </div>
  );
};
