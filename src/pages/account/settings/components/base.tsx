import React from 'react';
import {UploadOutlined} from '@ant-design/icons';
import {Button, message, Spin, Upload} from 'antd';
import ProForm, {ProFormText,} from '@ant-design/pro-form';

import styles from './BaseView.less';
import {useRequest} from "@umijs/hooks";
import {GET} from "@/services/crud";

// 头像组件 方便以后独立，增加裁剪之类的功能
const AvatarView = ({avatar}: { avatar: string }) => (
  <>
    <div className={styles.avatar_title}>头像</div>
    <div className={styles.avatar}>
      <img src={avatar} alt="avatar"/>
    </div>
    <Upload showUploadList={false}>
      <div className={styles.button_view}>
        <Button>
          <UploadOutlined/>
          更换头像
        </Button>
      </div>
    </Upload>
  </>
);

const BaseView: React.FC = () => {
  const {data: r, loading} = useRequest(() => {
    return GET('/syst/user/settings/basic', {});
  });

  console.log(50, r);

  const getAvatarURL = () => {
    if (r) {
      if (r.data?.avatar) {
        return r.data?.avatar;
      }
      const url = '/logo.svg';
      return url;
    }
    return '/logo.svg';
  };

  const handleFinish = async () => {
    message.success('更新基本信息成功');
  };
  return (
    <div className={styles.baseView}>
      {loading ? <Spin></Spin> : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: '更新基本信息',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...r?.data,
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="username"
                label="用户名"
                disabled
                rules={[
                  {
                    required: true,
                    message: '请输入您的用户名!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="email"
                label="邮箱"
                rules={[
                  {
                    required: true,
                    message: '请输入您的邮箱!',
                  },
                ]}
              />

              <ProFormText
                width="md"
                name="phone"
                label="联系电话"
                rules={[
                  {
                    required: true,
                    message: '请输入您的联系电话!',
                  },
                ]}
              />
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()}/>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
