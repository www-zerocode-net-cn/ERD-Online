export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/project',
    layout: false,
    routes: [
      {
        path: '/project',
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
            name: 'design-table',
            path: '/project/design/table',
            component: './project/design/table',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
