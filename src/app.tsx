/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
import {RunTimeLayoutConfig} from "@@/plugin-layout/types";


export async function getInitialState(): Promise<{}> {
}


export const layout: RunTimeLayoutConfig = (initialState) => {
  return {
    // 常用属性
    title: 'ERD Online',
    logo: '/logo.svg',
    pure: true,
    // 自定义 403 页面
    unAccessible: <div>'unAccessible'</div>,
    // 自定义 404 页面
    noFound: <div>'noFound'</div>,
    // 其他属性见：https://procomponents.ant.design/components/layout#prolayout
  };
};
