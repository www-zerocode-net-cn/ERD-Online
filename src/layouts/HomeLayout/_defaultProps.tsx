import {
  BorderRightOutlined,
  ChromeFilled,
  CrownFilled, FireOutlined, GlobalOutlined, HomeOutlined,
  MediumOutlined,
  SmileFilled,
  TabletFilled, TeamOutlined,
  UsergroupAddOutlined,
  UserOutlined
} from '@ant-design/icons';

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/project/home',
        name: '首页',
        icon: <HomeOutlined />,
      },
      {
        path: '/project/recent',
        name: '最近',
        icon: <FireOutlined />,
      },
      {
        path: '/project/person',
        name: '个人',
        icon: <UserOutlined />,
      },
      {
        path: '/project/group',
        name: '团队',
        icon: <TeamOutlined />,
      },
      {
        exact: true,
        path: 'https://www.zerocode.net.cn/',
        name: 'ERD Online Pro 论坛',
        icon: <GlobalOutlined />
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: '/logo.svg',
      title: 'ERD Online Pro',
      desc: '国内第一个开源免费在线建模软件',
      url: 'https://portal.zerocode.net.cn/',
      target: '_blank',
    },
    {
      icon: '/zerocode.svg',
      title: '零代',
      desc: '国内第一个零代码社区',
      url: 'https://www.zerocode.net.cn/',
      target: '_blank',
    },
  ],
};
