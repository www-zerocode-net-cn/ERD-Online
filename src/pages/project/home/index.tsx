import type {FC} from 'react';
import {Avatar, Card, Col, List, Skeleton, Row, Statistic} from 'antd';
import {Radar} from '@ant-design/charts';

import moment from 'moment';
import EditableLinkGroup from './components/EditableLinkGroup';
import styles from './style.less';
import type {ActivitiesType, CurrentUser} from './data.d';
import {queryProjectNotice, queryActivities, fakeChartData} from './service';
import {useRequest} from "@umijs/hooks";
import {Link} from "@@/exports";
import {GET} from "@/services/crud";
import React, {useEffect, useState} from "react";
import {PageContainer} from "@ant-design/pro-components";

const links = [
  {
    title: '操作一',
    href: '',
  },
  {
    title: '操作二',
    href: '',
  },
  {
    title: '操作三',
    href: '',
  },
  {
    title: '操作四',
    href: '',
  },
  {
    title: '操作五',
    href: '',
  },
  {
    title: '操作六',
    href: '',
  },
];

const PageHeaderContent: FC<{ currentUser: Partial<CurrentUser> }> = ({currentUser}) => {
  const loading = currentUser && Object.keys(currentUser).length;
  if (!loading) {
    return <Skeleton avatar paragraph={{rows: 1}} active/>;
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
          ，祝你开心每一天！
        </div>
        <div>
          {currentUser?.title || '全球第一个开源在线数据库建模平台'} |{currentUser.email}
        </div>
      </div>
    </div>
  );
};

export type HomeProps = {};
const Home: React.FC<HomeProps> = (props) => {

  const [statisticInfo, setStatisticInfo] = useState({
    yesterday: 0,
    today: 0,
    month: 0,
    total: 0,
    userCount: 0,
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
  const {loading: activitiesLoading, data: activities = []} = useRequest(queryActivities);
  const {data} = useRequest(fakeChartData);

  const renderActivities = (item: ActivitiesType) => {
    const events = item.template.split(/@\{([^{}]*)\}/gi).map((key) => {
      if (item[key]) {
        return (
          <a href={item[key].link} key={item[key].name}>
            {item[key].name}
          </a>
        );
      }
      return key;
    });
    return (
      <List.Item key={item.id}>
        <List.Item.Meta
          avatar={<Avatar src={item.user.avatar}/>}
          title={
            <span>
              <a className={styles.username}>{item.user.name}</a>
              &nbsp;
              <span className={styles.event}>{events}</span>
            </span>
          }
          description={
            <span className={styles.datetime} title={item.updatedAt}>
              {moment(item.updatedAt).fromNow()}
            </span>
          }
        />
      </List.Item>
    );
  };

  const {data: r, userInfoLoading} = useRequest(() => {
    return GET('/syst/user/settings/basic', {});
  });

  console.log(157, recentProject?.data?.records);

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
                          <Avatar size="small" src={"/logo.svg"}/>
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
            title="动态"
            loading={activitiesLoading}
          >
            <List<ActivitiesType>
              loading={activitiesLoading}
              renderItem={(item) => renderActivities(item)}
              dataSource={activities}
              className={styles.activitiesList}
              size="large"
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
            <EditableLinkGroup onAdd={() => {
            }} links={links} linkElement={Link}/>
          </Card>
          <Card
            style={{marginBottom: 24}}
            bordered={false}
            title="模型走势"
            loading={data?.radarData?.length === 0}
          >
            <div className={styles.chart}>
              <Radar
                height={343}
                data={data?.radarData || []}
                angleField="label"
                seriesField="name"
                radiusField="value"
                area={{
                  visible: false,
                }}
                point={{
                  visible: true,
                }}
                legend={{
                  position: 'bottom-center',
                }}
              />
            </div>
          </Card>
          <Card
            bodyStyle={{paddingTop: 12, paddingBottom: 12}}
            bordered={false}
            title="团队"
            loading={projectLoading}
          >
            <div className={styles.members}>

            </div>
          </Card>
        </Col>
      </Row>
    </PageContainer>
  );
}


export default React.memo(Home)
