import React, {useState} from "react";

import type {DescriptionsProps} from 'antd';
import {Button, Card, Descriptions, Input, QRCode, Space, Typography} from 'antd';
import {UserOutlined} from "@ant-design/icons";
import {POST_ERD} from "@/services/crud";

const {Paragraph} = Typography;


export type BackendCodeProps = {};
const BackendCode: React.FC<BackendCodeProps> = (props) => {
  const [transInfo, setTransInfo] = useState({
    email: '',
    customer: '',
    productId: '1736337567885922305',
    userId: '',
    tradeNo: '',
    licenseCheckModel: {},
  });

  const [QRUrl, setQRUrl] = useState("");
  const [tradeNo, setTradeNo] = useState("");

  const items1: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '产品',
      children: 'ERD Online 微服务架构源码',
    },
    {
      key: '2',
      label: '付款方式',
      children: '微信扫码',
    },
    {
      key: '3',
      label: '价格',
      children: '￥1999.00',
    },
    {
      key: '10',
      label: '交付产品清单',
      children: (
        <>
          <strong>交付物:</strong> 完整的ERD Online后端微服务架构
          <br/>
          <strong>整体架构组成:</strong> jdk1.8、maven3、spring boot2.3.2、mysql8、nacos1.4、redis4.10
          <br/>
          <strong>包含模块:</strong> erd-zerocode、erd-system、erd-auth、erd-gateway以及其余基础模块
          <br/>
          <strong>是否可以本地启动:</strong> 是，您可以在本地启动整套微服务架构
          <br/>
          <strong>交付方式:</strong> 产品将通过邮件进行交付。请提供您的邮件地址，并在完成付款后，我们将自动发送产品给您
          <br/>
          <strong>交付时间:</strong> 产品将在您提供邮件地址并完成付款后立即发送
          <br/>
          感谢您的购买！如果您有任何进一步的疑问或需求，请关注公众号"<strong>零代科技</strong>"随时联系我们
        </>
      ),
    },
  ];
  const items2: DescriptionsProps['items'] = [
    {
      key: '1',
      label: '请您填写邮箱地址',
      children: <Space.Compact style={{width: '100%'}}>
        <Input placeholder="请先录入邮箱地址" prefix={<UserOutlined/>} onChange={(e) => {
          console.log('email', e.target.value);
          const newTransInfo = {
            ...transInfo,
            email: e.target.value
          };
          setTransInfo(newTransInfo);
        }}/>
        <Button type="primary" onClick={() => {
          console.log('transInfo', transInfo);
          if (!transInfo.email) {
            return
          }
          POST_ERD("/trans/transaction", transInfo).then(r => {
            console.log(91, r);
            console.log(91, r?.data?.tradeNo);
            if (r?.code === 200) {
              setQRUrl(r?.data?.WX?.code_url || "");
              setTradeNo(r?.data?.tradeNo);
              // Create a new object with the updated tradeNo
              const newTransInfo = {...transInfo, tradeNo: r?.data?.tradeNo};
              // Update the state with the new object
              setTransInfo(newTransInfo);
            }
          });
        }
        }>确认</Button>
      </Space.Compact>,
    },
    {
      key: '2',
      label: '微信扫码',
      children: <QRCode
        errorLevel="H"
        value={QRUrl}
        icon="/logo.svg"
      />,
    },
    {
      key: '3',
      label: '订单编号（牢记订单编号，有问题凭流水号做凭证）',
      children: <Paragraph copyable={tradeNo ? true : false}
                           disabled={tradeNo ? false : true}>{tradeNo || "录入邮箱后生成订单编号"}</Paragraph>
    },
  ];

  return (
    <>
      <Card>
        <Descriptions title="购买后端源码" layout="vertical" bordered items={items1}/>
      </Card>
      <Card>
        <Descriptions title="邮箱及付款" layout="vertical" bordered items={items2}/>
      </Card>
    </>
  );
};

export default React.memo(BackendCode)
