import React, {useState} from "react";
import {Button, Result, Spin} from "antd";
import {useRequest} from "@umijs/hooks";
import {GET} from "@/services/crud";

import {LightMember, PeopleTopCard, VipOne} from "@icon-park/react";


export type IdentificationProps = {};
const IdentificationType = {
  free: <PeopleTopCard theme="filled" size="66" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>,
  pro: <LightMember theme="filled" size="66" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>,
  enterprise: <VipOne theme="filled" size="66" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>,
};
const Identification: React.FC<IdentificationProps> = (props) => {
  const {data: r, loading} = useRequest(() => {
    return GET('/syst/user/settings/basic', {});
  });

  type ModeKeys = 'free' | 'pro' | 'enterprise';
  type ModeState = {
    mode: ModeKeys;
    title: string;
    subTitle: string;
    icon: React.ReactNode;
  };

  const [initConfig, setInitConfig] = useState<ModeState>({
    mode: 'free',
    title: '',
    subTitle: '',
    icon: IdentificationType.free
  });


  return (loading ? <Spin></Spin> : <>
    <Result
      icon={initConfig.icon}
      title="Successfully Purchased Cloud Server ECS!"
      subTitle="Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait."
      extra={[
        <Button type="primary" key="pro">
          订阅专业版
        </Button>,
        <Button type="primary" key="enterprise">升级至尊版</Button>,
      ]}
    />
  </>);
};

export default React.memo(Identification)
