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
    component: '../layouts/DesignLayout',
    routes: [
      {
        name: 'table',
        path: '/design/table',
        component: './design/table',
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
    component: './test',
  },
  {
    path: '/',
    redirect: '/login',
  },
  {
    component: './404',
  },
];
