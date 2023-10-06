import type {FC} from 'react';
import {Avatar, Card, Col, List, Skeleton, Row, Statistic, Tag, Space} from 'antd';
import {Radar, Pie} from '@ant-design/charts';

import moment from 'moment';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import type {ActivitiesType, CurrentUser} from './data.d';
import {queryProjectNotice, queryActivities, fakeChartData} from './service';
import {useRequest} from "@umijs/hooks";
import {Link} from "@@/exports";
import {GET, GET_ERD, POST_ERD} from "@/services/crud";
import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-components";
import {VipOne} from "@icon-park/react";
import * as cache from "@/utils/cache";
import Line from "antd/es/progress/Line";
import {TeamOutlined, UserOutlined} from "@ant-design/icons";


const PageHeaderContent: FC<{ currentUser: Partial<CurrentUser> }> = ({currentUser}) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{rows: 1}} active/>;
  }
  const licence = cache.getItem2object('licence');

  let vip;
  if (!licence.licensedStartTime) {
    vip = <VipOne theme="outline" size="20" fill="#333" strokeWidth={2} strokeLinejoin="miter" strokeLinecap="butt"/>
  } else {
    vip = <VipOne theme="filled" size="18" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>
  }


  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar size="large" src={currentUser?.avatar || '/logo.svg'}/>
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>
          您好，
          {currentUser.username}
          ，祝你开心每一天
          <a href={"/account/settings?selectKey=identification"}
             title={licence.licensedStartTime ? '已授权' : '未授权'}> {vip}</a>
        </div>
        <div>
          {currentUser?.title || '全球第一个开源在线数据库建模平台'} {currentUser.email}
        </div>
      </div>
    </div>
  );
};

export type HomeProps = {};

export const renderActivities = (item: ActivitiesType) => {

  return (
    <List.Item key={item.id}>
      <List.Item.Meta
        title={
          <Row>
            <Col span={20}>
              <a className={styles.username} href={item?.url} target={"_blank"}>{item?.title}</a>
            </Col>
            <Col span={4}>
              <span className={styles.datetime} title={item.createTime}>
                {moment(item.createTime).fromNow()}
              </span>
            </Col>
          </Row>
        }
      />
    </List.Item>
  );
};

const Home: React.FC<HomeProps> = (props) => {

  const [statisticInfo, setStatisticInfo] = useState({
    yesterday: 0,
    today: 0,
    month: 0,
    total: 0,
    userCount: 0,
    personTotal: 0,
    groupTotal: 0,
  });

  const fetchStatistic = () => {
    GET("/ncnb/project/statistic", {}).then(r => {
      console.log(24, r);
      if (r?.code === 200) {
        setStatisticInfo(r.data);
      }
    })
  }

  useEffect(() => {
    fetchStatistic();
  }, [statisticInfo.total])

  const ExtraContent: FC<Record<string, any>> = () => (
    <div className={styles.extraContent}>
      <div className={styles.statItem}>
        <Statistic title="设计中模型" value={statisticInfo.today}/>
      </div>
      <div className={styles.statItem}>
        <Statistic title="昨日全部模型" value={statisticInfo.yesterday}/>
      </div>
      <div className={styles.statItem}>
        <Statistic title="本月累计模型" value={statisticInfo.month}/>
      </div>
      <div className={styles.statItem}>
        <Statistic title="历史模型总数" value={statisticInfo.total}/>
      </div>
      <div className={styles.statItem}>
        <Statistic title="平台总用户" value={statisticInfo.userCount}/>
      </div>
    </div>
  );


  const {loading: projectLoading, data: recentProject = []} = useRequest(() => {
    return GET('/ncnb/project/recent', {
      page: 1,
      limit: 6
    })
  });
  const {loading: activitiesLoading, data: activities = []} = useRequest(() => {
    return POST_ERD('/syst/sysAnnouncement', {
      "current": 1,
      "size": 4,
      "orders": [
        {
          "column": "createTime",
          "asc": false
        }
      ]
    })
  });

  const {data: r, userInfoLoading} = useRequest(() => {
    return GET('/syst/user/settings/basic', {});
  });

  console.log(157, recentProject?.data?.records);
  const data = [
    {
      type: '个人',
      value: statisticInfo.personTotal,
    },
    {
      type: '团队',
      value: statisticInfo.groupTotal,
    },

  ];
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 16,
        textAlign: 'center',
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };


  return (
    <PageContainer
      title={false}
      content={
        <PageHeaderContent
          currentUser={r?.data}
        />
      }
      extraContent={<ExtraContent/>}
    >
      <Row gutter={24}>
        <Col xl={16} lg={24} md={24} sm={24} xs={24}>
          <Card
            className={styles.projectList}
            style={{marginBottom: 24}}
            title="进行中的项目"
            bordered={false}
            extra={<Link to="/project/recent">全部项目</Link>}
            loading={projectLoading}
            bodyStyle={{padding: 0}}
          >
            {recentProject?.data?.records?.map((item: any) => (
              <Card.Grid key={item.id}>
                <Link to={'/design/table/model?projectId=' + item.id}>
                  <Card key={item.id} bordered={false} style={{boxShadow: 'none'}}>
                    <Card.Meta
                      title={
                        <div className={styles.cardTitle}>
                          <Tag color={'blue'} key={item.id}>
                            {item.type === '1' ? <UserOutlined/> : <TeamOutlined/>}
                          </Tag>
                          <Link to={'/design/table/model?projectId=' + item.id}>{item.projectName}</Link>
                        </div>
                      }
                      description={item.description || '全球第一个开源在线数据库建模平台'}
                    />
                    <div className={styles.projectItemContent}>
                      {item.updateTime && (
                        <span className={styles.datetime} title={item.updateTime}>
                        {moment(item.updateTime).fromNow()}
                      </span>
                      )}
                    </div>
                  </Card>
                </Link>
              </Card.Grid>
            ))}
          </Card>
          <Card
            bodyStyle={{padding: 0}}
            bordered={false}
            className={styles.activeCard}
            title="公告"
            loading={activitiesLoading}
            extra={<a href="/project/notice">更多</a>}
          >
            <List<ActivitiesType>
              size="small"
              loading={activitiesLoading}
              renderItem={(item) => renderActivities(item)}
              dataSource={activities?.data?.records}
              className={styles.activitiesList}
            />
          </Card>
        </Col>
        <Col xl={8} lg={24} md={24} sm={24} xs={24}>
          <Card
            style={{marginBottom: 24}}
            title="快速开始 / 便捷导航"
            bordered={false}
            bodyStyle={{padding: 0}}
          >
            <EditableLinkGroup/>
          </Card>
          <Card
            bordered={false}
            title="模型分布"
            bodyStyle={{padding: 0}}
          >
            <Pie {...config}/>
          </Card>
          {/*<Card*/}
          {/*  bodyStyle={{paddingTop: 12, paddingBottom: 12}}*/}
          {/*  bordered={false}*/}
          {/*  title="团队"*/}
          {/*  loading={projectLoading}*/}
          {/*>*/}
          {/*  <div className={styles.members}>*/}

          {/*  </div>*/}
          {/*</Card>*/}
        </Col>
      </Row>
    </PageContainer>
  );
}


export default React.memo(Home)
