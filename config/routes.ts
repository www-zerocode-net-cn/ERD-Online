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
    component: '../layouts/ProjectLayout',
    layout: false,
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
    component: './404',
  },

  {
    path: '/',
    redirect: '/user/login',
  },
  {
    component: './404',
  },
];
