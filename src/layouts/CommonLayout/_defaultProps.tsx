import {
  CrownFilled,
  DatabaseOutlined,
  ExportOutlined,
  FieldTimeOutlined,
  ImportOutlined,
  MediumOutlined,
  RadiusSettingOutlined, SettingOutlined
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
            exact: true,
            path: 'https://www.zerocode.net.cn/',
            name: 'ERD Online Pro 官方论坛',
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
            path: '/design/table/version/all',
            name: '全部版本',
            icon: <CrownFilled/>,
          },
        ],
      },
      {
        name: '导入',
        icon: <ImportOutlined/>,
        path: '/design/table/import',
        routes: [
          {
            path: '/design/table/import/reverse',
            name: '数据源逆向解析',
            icon: <CrownFilled/>,
          },
          {
            path: '/design/table/import/pdman',
            name: '解析PdMan文件',
            icon: <CrownFilled/>,
          },
          {
            path: '/design/table/import/erd',
            name: '解析ERD文件',
            icon: <CrownFilled/>,
          },
        ],
      },
      {
        name: '导出',
        icon: <ExportOutlined/>,
        path: '/design/table/export',
        routes: [
          {
            path: '/design/table/export/common',
            name: '普通导出',
            icon: <CrownFilled/>,
          },
          {
            path: '/design/table/export/more',
            name: '高级导出',
            icon: <CrownFilled/>,
          },
        ],
      },
      {
        name: '设置',
        icon: <SettingOutlined />,
        path: '/design/table/setting',
        routes: [
          {
            path: '/design/table/setting/db',
            name: '数据源设置',
            icon: <CrownFilled/>,
          },
          {
            path: '/design/table/setting/defaultField',
            name: '默认字段设置',
            icon: <CrownFilled/>,
          },
          {
            path: '/design/table/setting/default',
            name: '系统默认项设置',
            icon: <CrownFilled/>,
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
