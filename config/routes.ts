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
    component: '../layouts/ProjectLayout',
    routes: [
      {
        name: 'home',
        path: '/project/home',
        component: './project/home',
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
        component: './design/version',
      },
      {
        path: '/design/table/import',
        component: './design/version',
        routes: [
          {
            path: '/design/table/import/reverse',
            component: './design/version',
          },
          {
            path: '/design/table/import/pdman',
            component: './design/version',
          },
          {
            path: '/design/table/import/erd',
            component: './design/version',
          },
        ]
      },
      {
        path: 'design/table/export',
        component: './design/version',
        routes: [
          {
            path: '/design/table/import/common',
            component: './design/version',
          },
          {
            path: '/design/table/import/more',
            component: './design/version',
          },
        ]
      },
      {
        path: '/design/table/setting',
        component: './design/version',
        routes: [
          {
            path: '/design/table/setting/db',
            component: './design/version',
          },
          {
            path: '/design/table/setting/default',
            component: './design/version',
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
