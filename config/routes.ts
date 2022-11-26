export default [
  {
    path: '/login',
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
    path: '/register',

    routes: [
      {
        name: 'register',
        path: '/register',
        component: './register',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/project',
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
    path: '/project/group/setting',
    component: '../layouts/GroupLayout',
    routes: [
      {
        path: '/project/group/setting',
        redirect: '/project/group/setting/basic',
      },
      {
        path: '/project/group/setting/basic',
        component: './project/group/component/BasicSetting',
      },
      {
        path: '/project/group/setting/permission',
        component: './project/group/component/GroupSetting',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/design',
    component: '../layouts/DesignLayout',
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
        path: '/design/table/query',
        component: './design/query',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/project/home',
  },
  {path: '/*', component: './404',},
  {
    component: './404',
  },
];
