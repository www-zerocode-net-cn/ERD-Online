import {dynamic} from 'umi';
import React from "react";

interface IProps {
  type: string;
}

const AddModule: typeof React.Component = dynamic({
  loader: async () => {
    const addModule = await import(
      './module/AddModule'
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
