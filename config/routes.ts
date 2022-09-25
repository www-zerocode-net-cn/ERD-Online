export default [
  {
    path: '/login',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/login',
        component: './login',
      },
      {
        name: 'loginSuccess',
        path: '/login/success',
        component: './login/success',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/project',
    layout: false,
    component: '../layouts/HomeLayout',
    routes: [
      {
        path: '/project/home',
        component: './project/home',
      },
      {
        path: '/project/recent',
        component: './project/recent',
      },
      {
        path: '/project/person',
        component: './project/person',
      },
      {
        path: '/project/group',
        component: './project/group',
      },
      {
        name: 'new',
        path: '/project/new',
        component: './project/new',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/design',
    layout: false,
    component: '../layouts/CommonLayout',
    routes: [
      {
        path: '/design/table/model',
        component: './design/table',
      },
      {
        path: '/design/table/version',
        routes: [
          {
            path: '/design/table/version',
            redirect: '/design/table/version/all',
          },
          {
            path: '/design/table/version/all',
            component: './design/version',
          },
        ]
      },
      {
        path: '/design/table/import',
        routes: [
          {
            path: '/design/table/import',
            redirect: '/design/table/import/reverse',
          },
          {
            path: '/design/table/import/reverse',
            component: './design/import/component/ReverseDatabase',
          },
          {
            path: '/design/table/import/pdman',
            component: './design/import/component/ReversePdMan',
          },
          {
            path: '/design/table/import/erd',
            component: './design/import/component/ReverseERD',
          },
        ]
      },
      {
        path: '/design/table/export',
        routes: [
          {
            path: '/design/table/export',
            redirect: '/design/table/export/common',
          },
          {
            path: '/design/table/export/common',
            component: './design/export/component/ExportCommon',
          },
          {
            path: '/design/table/export/more',
            component: './design/export/component/ExportDDL',
          },
        ]
      },
      {
        path: '/design/table/setting',
        routes: [
          {
            path: '/design/table/setting',
            redirect: '/design/table/setting/db',
          },
          {
            path: '/design/table/setting/db',
            component: './design/setting/component/DatabaseSetUp',
          },
          {
            path: '/design/table/setting/defaultField',
            component: './design/setting/component/DefaultField',
          },
          {
            path: '/design/table/setting/default',
            component: './design/setting/component/DefaultSetUp',
          },
        ]
      },
      {
        name: 'relation',
        path: '/design/relation',
        component: './design/relation',
      },
      {
        name: 'test',
        path: '/design/test',
        component: './design/test',
      },
      {
        name: 'test2',
        path: '/design/test2',
        component: './design/test/Test2'
      },
      {
        name: 'test3',
        path: '/design/test3',
        component: './design/test/Test3',
      },
      {
        name: 'code',
        path: '/design/code',
        component: './design/code',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'test',
    path: '/test',
    layout: false,
    component: '../layouts/CommonLayout',
    routes: [
      {
        name: 'test',
        path: '/test/test',
        component: './test/test',
      },]
  },

  {
    path: '/',
    redirect: '/project/home',
  },

  {
    name: 'excel',
    path: '/JExcel',
    component: './JExcel',
  },
  {
    component: './404',
  },
];
