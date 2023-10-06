import React, {useState} from "react";
import {Button, Result, Spin} from "antd";
import {useRequest} from "@umijs/hooks";
import {GET} from "@/services/crud";

import {LightMember, PeopleTopCard, VipOne} from "@icon-park/react";
import * as cache from "@/utils/cache";
import Upgrade from "@/components/dialog/upgrade";


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

  const licence = cache.getItem2object('licence');
  console.log(37, licence, licence?.licensedTo, licence.licensedStartTime);
  let title = '';
  let subTitle = '';
  let extra: any[] = [];
  if (!licence.licensedStartTime) {
    title = '未取得授权：';
    subTitle = '未获取授权，您可以免费使用ERD Online全部功能，只能新建有限数量的模型';
    extra.push(<Upgrade/>);
  } else {
    title = '已取得授权：';
    subTitle = '授权给: ' + licence?.licensedTo + ', 有效期：' + licence.licensedStartTime + ' ~ ' + licence.licensedEndTime;
  }


  return (loading ? <Spin></Spin> : <>
    <Result
      icon={initConfig.icon}
      title={title}
      subTitle={subTitle}
      extra={extra}
    />
  </>);
};

export default React.memo(Identification)
