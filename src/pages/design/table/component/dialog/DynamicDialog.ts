import {dynamic} from 'umi';
import React from "react";

interface IProps {
  type: string;
}

const AddModule: typeof React.Component = dynamic({
  loader: async () => {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const addModule = await import(
      './AddModule'
      );
    return addModule;
  },
})

const DynamicDialog = (props: IProps) => {
  const {type} = props;
  const setComponent = () => {
    switch (type) {
      case   'addModule':
        return AddModule;
      default:
        return ''
    }
  }

  return (
    setComponent()
  )
}
export default DynamicDialog
