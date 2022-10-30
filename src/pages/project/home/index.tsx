import {ProCard, StatisticCard} from '@ant-design/pro-components';
import RcResizeObserver from 'rc-resize-observer';
import React, {useEffect, useState} from 'react';

const {Statistic} = StatisticCard;

export type HomeProps = {};
const Home: React.FC<HomeProps> = (props) => {

  const [responsive, setResponsive] = useState(false);

  const [dateInfo, setDateInfo] = useState('2019年9月28日 星期五');


  useEffect(() => {
    let time = new Date();
    let year = time.getFullYear();
    let month = time.getMonth() + 1;
    let date = time.getDate();
    let hour = time.getHours();
    let minutes = time.getMinutes();
    let second = time.getSeconds();
    // @ts-ignore
    month < 10 ? (month = "0" + month) : month;
    // month = month + 1;
    // @ts-ignore
    hour < 10 ? (hour = "0" + hour) : hour;
    // @ts-ignore
    minutes < 10 ? (minutes = "0" + minutes) : minutes;
    // @ts-ignore
    second < 10 ? (second = "0" + second) : second;
    let now_time =

      year +
      "年" +
      month +
      "月" +
      date +
      "日" +
      " " +
      hour +
      ":" +
      minutes +
      ":" +
      second;
    setDateInfo(now_time);
    setInterval(() => setDateInfo(now_time), 1000);
  })

  return (
    <RcResizeObserver
      key="resize-observer"
      onResize={(offset) => {
        setResponsive(offset.width < 596);
      }}
    >
      <ProCard
        title="数据概览"
        extra={dateInfo}
        split={responsive ? 'horizontal' : 'vertical'}
        headerBordered
        bordered
      >
        <ProCard split="horizontal">
          <ProCard split="horizontal">
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '昨日全部模型',
                  value: 234,
                  description: <Statistic title="较本月平均模型" value="8.04%" trend="down"/>,
                }}
              />
              <StatisticCard
                statistic={{
                  title: '本月累计模型',
                  value: 234,
                  description: <Statistic title="月同比" value="8.88%" trend="up"/>,
                }}
              />
            </ProCard>
            <ProCard split="vertical">
              <StatisticCard
                statistic={{
                  title: '设计中模型',
                  value: '12/56',
                  suffix: '个',
                }}
              />
              <StatisticCard
                statistic={{
                  title: '历史模型总数',
                  value: '134',
                  suffix: '个',
                }}
              />
            </ProCard>
          </ProCard>
          <StatisticCard
            title="模型走势"
            chart={
              <img
                src="/zhuzhuangtu.svg"
              />
            }
          />
        </ProCard>

      </ProCard>
    </RcResizeObserver>
  );

}
export default React.memo(Home)
