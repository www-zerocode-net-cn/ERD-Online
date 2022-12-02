import {message, Tree} from 'antd';
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";

import {GET, POST} from "@/services/crud";
import {RoleItem} from "@/pages/project/group/component/OperationPrivilege";



const MenuPrivilege = (props: { values: Partial<RoleItem>; }, ref: React.Ref<unknown> | undefined) => {
    const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
    const [treeData, setTreeData] = useState([]);
    const [defaultExpandAll] = useState(true);
    useImperativeHandle(ref, () => ({
      saveCheckedMenus: async () => {
        await POST('/syst/role/saveCheckedMenus',
          {checkedKeys: checkedKeys, roleId: props.values.id}
        ).then((result) => {
          console.log(result)
          if (result.code === 200) {
            message.success("123");
          } else {
            message.error(result.msg);
          }
        });
      },
    }));


    const fetchMenu = async () => {
      const result = await GET('/syst/role/getAllMenuByRole', {id: props.values.id});
      return result?.data;
    }
    useEffect(() => {
      fetchMenu().then(data => {
        setTreeData(data?.treeData);
        setCheckedKeys(data?.defaultSelectedKeys);
      });
    }, []);

    // @ts-ignore
    const onCheck = (checkedKeysValue) => {
      console.log('onCheck', checkedKeysValue);
      setCheckedKeys(checkedKeysValue);
    };

    return (
      <Tree
        checkable
        checkStrictly
        defaultExpandAll={defaultExpandAll}
        onCheck={onCheck}
        key={props.values.id}
        checkedKeys={checkedKeys}
        treeData={treeData}
      >
      </Tree>
    );
  }
;
export default forwardRef(MenuPrivilege);
