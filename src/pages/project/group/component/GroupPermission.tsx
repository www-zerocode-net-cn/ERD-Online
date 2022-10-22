import React, {ReactNode, useRef} from "react";
import MenuPrivilege from "@/pages/project/group/component/MenuPrivilege";
import OperationPrivilege from "@/pages/project/group/component/OperationPrivilege";
import type {ProFormInstance} from '@ant-design/pro-components';
import {StepsForm,} from '@ant-design/pro-components';


export type StepItem = {
  title: string,
  content: string | ReactNode,

}
export type GroupPermissionProps = {
  values: any;
};
const GroupPermission: React.FC<GroupPermissionProps> = (props) => {
  const menuRef = useRef();
  const operateRef = useRef();


  const formMapRef = useRef<React.MutableRefObject<ProFormInstance<any> | undefined>[]>([]);

  return (<>
    <StepsForm
      formMapRef={formMapRef}
      onFinish={(values) => {
        console.log(values);
        return Promise.resolve(true);
      }}
    >
      <StepsForm.StepForm name="menu" title="菜单权限">
        <MenuPrivilege values={props.values} ref={menuRef}/>
      </StepsForm.StepForm>
      <StepsForm.StepForm name="operate" title={'按钮权限'}>
        <OperationPrivilege values={props.values} ref={operateRef}/>
      </StepsForm.StepForm>
    </StepsForm>
  </>);
};

export default React.memo(GroupPermission)
