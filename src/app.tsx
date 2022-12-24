/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
import type {RunTimeLayoutConfig} from '@umijs/max';
import NoAccessPage from "@/pages/403";
import NoFoundPage from "@/pages/404";

export async function getInitialState(): Promise<{}> {
  return {}
}


export const layout: RunTimeLayoutConfig = (initialState: any) => {
  return {
    // 常用属性
    title: 'ERD Online',
    logo: '/logo.svg',
    pure: true,
    // 自定义 403 页面
    noAccessible: <NoAccessPage/>,
    // 自定义 404 页面
    noFound: <NoFoundPage/>,
    // 其他属性见：https://procomponents.ant.design/components/layout#prolayout
  };
};
