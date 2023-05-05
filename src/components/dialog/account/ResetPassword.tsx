import React from "react";
import {Button, message} from "antd";
import {ModalForm, ProFormText} from "@ant-design/pro-components";
import {POST} from "@/services/crud";

export type ResetPasswordProps = {};

const ResetPassword: React.FC<ResetPasswordProps> = (props) => {
  return (<>
    <ModalForm
      title="修改密码"
      trigger={
        <Button type="link">修改</Button>
      }
      onFinish={async (values: any) => {
        let pwd = values.pwd;
        let pwdCK = values.pwdCK;
        if (pwd !== pwdCK) {
          message.error("两次输入的密码不一致")
          return;
        }
        POST('/syst/user/settings/update', values).then(r => {
          if (r && r.code === 200) {
            message.success('更新密码信息成功');
          }
        });
        return true;
      }}
    >
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
    </ModalForm>
  </>);
};

export default React.memo(ResetPassword)
