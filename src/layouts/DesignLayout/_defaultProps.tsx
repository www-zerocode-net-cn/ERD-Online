import {
  Audit,
  Column,
  DatabaseConfig,
  DatabaseDownload,
  DatabaseNetwork, DatabaseSearch,
  DataDisplay,
  Export,
  FileJpg,
  FileLock,
  History,
  Outbound,
  SettingConfig,
  SettingTwo,
  Sphere, TransactionOrder,
  Warehousing
} from "@icon-park/react";

export default {
  route: {
    routes: [
      {
        path: '/design/table/model',
        name: '模型',
        icon: <DatabaseNetwork theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
        routes: [
          {
            path: 'https://github.com/orgs/www-zerocode-net-cn/discussions',
            name: 'ERD Online 论坛',
            icon: <Sphere theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
          },
        ]
      },
      {
        path: '/design/table/version',
        name: '版本',
        icon: <History theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
        access: 'canErdHisprojectLoad',
        routes: [
          {
            path: '/design/table/version/all',
            name: '版本管理',
            icon: <History theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdHisprojectAll',
          },
          {
            path: '/design/table/version/order',
            name: '我的工单',
            icon: <TransactionOrder theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
          },
          {
            path: '/design/table/version/approval',
            name: '我的审批',
            icon: <Audit theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
          },
        ],
      },
      {
        name: '导入',
        icon: <Warehousing theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
        path: '/design/table/import',
        access: 'canErdTableImport',
        routes: [
          {
            path: '/design/table/import/reverse',
            name: '数据源逆向解析',
            icon: <DataDisplay theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdConnectorDbreverseparse',
          },
          {
            path: '/design/table/import/pdman',
            name: '解析PdMan文件',
            icon: <FileJpg theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdTableImportPdman',
          },
          {
            path: '/design/table/import/erd',
            name: '解析ERD文件',
            icon: <FileLock theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdTableImportErd',
          },
        ],
      },
      {
        name: '导出',
        icon: <Outbound theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
        path: '/design/table/export',
        access: 'canErdTableExport',
        routes: [
          {
            path: '/design/table/export/common',
            name: '普通导出',
            icon: <Export theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdTableExportCommon',
          },
          {
            path: '/design/table/export/more',
            name: '高级导出',
            icon: <DatabaseDownload theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdTableExportMore',
          },
        ],
      },
      {
        name: '设置',
        icon: <SettingTwo theme="filled" size="15" fill="#DE2910" strokeWidth={2}/>,
        path: '/design/table/setting',
        access: 'canErdTableSetting',
        routes: [
          {
            path: '/design/table/setting/db',
            name: '数据源设置',
            icon: <DatabaseConfig theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdTableSettingDb',
          },
          {
            path: '/design/table/setting/defaultField',
            name: '默认字段设置',
            icon: <Column theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdTableSettingDefaultfield',
          },
          {
            path: '/design/table/setting/default',
            name: '系统默认项设置',
            icon: <SettingConfig theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
            access: 'canErdTableSettingDefault',
          },
        ],
      },
      {
        path: '/design/table/query',
        name: '查询',
        icon: <DatabaseSearch theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
        routes: [
          {
            path: 'https://github.com/orgs/www-zerocode-net-cn/discussions',
            name: 'ERD Online 论坛',
            icon: <Sphere theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
          },
        ]
      },
      {
        path: '/design/table/chatsql',
        name: 'Chat SQL',
        icon: <DatabaseSearch theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>,
        routes: [
          {
            path: 'https://github.com/orgs/www-zerocode-net-cn/discussions',
            name: 'ERD Online 论坛',
            icon: <Sphere theme="filled" size="18" fill="#DE2910" strokeWidth={2}/>
          },
        ]
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    // {
    //   icon: '/logo.svg',
    //   title: 'ERD Online',
    //   desc: '国内第一个开源免费在线建模软件',
    //   url: 'https://portal.zerocode.net.cn/',
    //   target: '_blank',
    // },
    // {
    //   icon: '/zerocode.svg',
    //   title: '零代',
    //   desc: '国内第一个零代码社区',
    //   url: 'https://www.zerocode.net.cn/',
    //   target: '_blank',
    // },
    // {
    //   icon: '/loco.svg',
    //   title: 'LOCO',
    //   desc: '类钉钉宜搭的低代码搭建平台',
    //   url: 'https://loco.zerocode.net.cn/',
    //   target: '_blank',
    // },
    // {
    //   icon: '/zerocode.svg',
    //   title: 'Fast Test',
    //   desc: '接口快速测试平台',
    //   url: 'https://www.zerocode.net.cn/',
    //   target: '_blank',
    // },
    // {
    //   icon: '/zerocode.svg',
    //   title: 'Super BI',
    //   desc: '超级报表、BI引擎',
    //   url: 'https://www.zerocode.net.cn/',
    //   target: '_blank',
    // },


  ],
};
