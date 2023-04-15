import {DatabaseNetwork, LeftC, Permissions, SettingOne, Sphere} from "@icon-park/react";

export default {
  route: {
    path: '/',
    routes: [
      {
        path: '/project/group',
        name: '返回项目列表',
        icon: <LeftC theme="filled" size="18" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>,
      },
      {
        path: '/project/group/setting/basic',
        name: '基本设置',
        icon: <SettingOne theme="filled" size="18" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>,
      },
      {
        path: '/project/group/setting/permission',
        name: '权限组',
        icon: <Permissions theme="filled" size="18" fill="#DE2910" strokeWidth={2} strokeLinejoin="miter"/>,
        access: 'canErdProjectPermissionGroup'
      },
      {
        path: '/design/table/model',
        name: '打开模型',
        icon: <DatabaseNetwork theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
      },
      {
        exact: true,
        path: 'https://github.com/orgs/www-zerocode-net-cn/discussions',
        name: 'ERD Online 论坛',
        icon: <Sphere theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: '/logo.svg',
      title: 'ERD Online',
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
    {
      icon: '/loco.svg',
      title: 'LOCO',
      desc: '类钉钉宜搭的低代码搭建平台',
      url: 'https://loco.zerocode.net.cn/',
      target: '_blank',
    },
    {
      icon: '/zerocode.svg',
      title: 'Fast Test',
      desc: '接口快速测试平台',
      url: 'https://www.zerocode.net.cn/',
      target: '_blank',
    },
    {
      icon: '/zerocode.svg',
      title: 'Super BI',
      desc: '超级报表、BI引擎',
      url: 'https://www.zerocode.net.cn/',
      target: '_blank',
    },
  ],
};
