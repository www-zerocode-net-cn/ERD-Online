export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        name: 'login',
        path: '/user/login',
        component: './user/Login',
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
    component: '../layouts/DesignLayout',
    routes: [
      {
        name: 'table',
        path: '/design/table',
        component: './design/table',
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
    component: './test'
  },
  {
    path: '/',
    redirect: '/project/home',
  },
  {
    component: './404',
  },
];
