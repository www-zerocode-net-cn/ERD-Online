import {
  CrownFilled,
  DatabaseOutlined,
  ExportOutlined,
  FieldTimeOutlined,
  ImportOutlined,
  MediumOutlined,
  RadiusSettingOutlined
} from '@ant-design/icons';

export default {
  route: {
    routes: [
      {
        path: '/design/table/model',
        name: '模型',
        icon: <DatabaseOutlined/>,
        routes: [
          {
            path: 'https://www.zerocode.net.cn/',
            name: 'ERD Online 官方论坛',
            icon: <MediumOutlined/>
          },
        ]
      },
      {
        path: '/design/table/version',
        name: '版本',
        icon: <FieldTimeOutlined/>,
        routes: [
          {
            path: '/design/table/version',
            name: '全部版本',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
        ],
      },
      {
        name: '导入',
        icon: <ImportOutlined/>,
        path: '/design/table/import',
        component: './ListTableList',
        routes: [
          {
            path: '/design/table/import/reverse',
            name: '数据源逆向解析',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
          {
            path: '/design/table/import/pdman',
            name: '解析PdMan文件',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
          {
            path: '/design/table/import/erd',
            name: '解析ERD文件',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
        ],
      },
      {
        name: '导出',
        icon: <ExportOutlined/>,
        path: '/design/table/export',
        component: './ListTableList',
        routes: [
          {
            path: '/design/table/export/common',
            name: '普通导出',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
          {
            path: '/design/table/export/more',
            name: '高级导出',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
        ],
      },
      {
        name: '设置',
        icon: <RadiusSettingOutlined/>,
        path: '/design/table/setting',
        component: './ListTableList',
        routes: [
          {
            path: '/design/table/setting/db',
            name: '数据源设置',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
          {
            path: '/design/table/setting/defaultField',
            name: '默认字段设置',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
          {
            path: '/design/table/setting/default',
            name: '系统默认项设置',
            icon: <CrownFilled/>,
            component: './Welcome',
          },
        ],
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


  ],
};
