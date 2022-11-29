import React, {useEffect, useState} from "react";
import {FooterToolbar, ProForm} from '@ant-design/pro-components';
import {CheckboxValueType} from "antd/lib/checkbox/Group";
import {get, post} from "@/services/crud";
import {Checkbox, Col, Divider, Empty, List, message, Row} from "antd";
import _ from "lodash";
import {CONSTANT} from "@/utils/constant";
import {useSearchParams} from "@@/exports";
import {useAccess} from "@@/plugin-access";

export type PermissionGroup = {
  defaultValue: CheckboxValueType[];
  menuId: string;
  menuName: string;
  operations: [];
}

export type OperationCheckedGroup = {
  key: number;
  checkedKeys: CheckboxValueType[];
}
export type SecondCheckedGroup = {
  indeterminate: boolean;//是否半选状态，true为是
  checked: boolean;
  disabled?: boolean;
}

export type GroupPermissionProps = {
  defaultRole: number;
  values: any;
  isAdmin: boolean;
};
const GroupPermission: React.FC<GroupPermissionProps> = (props) => {
  const access = useAccess();
  const [loginRole, setLoginRole] = useState<number>(3);
  const [operationData, setOperationData] = useState<PermissionGroup[]>([]);
  const [indeterminate, setIndeterminate] = useState<SecondCheckedGroup[]>([]);
  const [allIndeterminate, setAllIndeterminate] = useState<SecondCheckedGroup>({
    indeterminate: false,
    checked: false,
  });
  //各菜单选中的的元素集合
  const [operationCheckedGroup, setOperationCheckedGroup] = useState<OperationCheckedGroup[]>([]);
  const [searchParams] = useSearchParams();


  const getOperationByCheckedMenus = async () => {
    return await get('/ncnb/project/group/role/permission', {
      roleId: props.values?.id,
      projectId: searchParams.get(CONSTANT.PROJECT_ID),
    });
  }

  function firstAllConfig(data: any, tmpAllIndeterminate: SecondCheckedGroup, tmpLoginRole: number) {
    console.log(44, data);
    //有部分选中
    const someChecked = _.find(data, function (value) {
      return value?.defaultValue?.length > 0;
    });
    //全选中
    const allChecked = _.filter(data, function (value) {
      return value?.defaultValue?.length === value?.operations?.length;
    });

    if (allChecked.length === data.length) {
      console.log(54, '全选中')
      tmpAllIndeterminate = {
        indeterminate: false,
        checked: true,
        disabled: tmpLoginRole === 0 ? false : (tmpLoginRole > props.defaultRole || false)
      }
    } else if (someChecked) {
      console.log(60, '有部分选中')
      tmpAllIndeterminate = {
        indeterminate: true,
        checked: true,
        disabled: tmpLoginRole === 0 ? false : (tmpLoginRole > props.defaultRole || true)
      }
    } else {
      console.log(66, '全取消')
      tmpAllIndeterminate = {
        indeterminate: false,
        checked: false,
        disabled: tmpLoginRole === 0 ? false : (tmpLoginRole > props.defaultRole || false)
      }
    }
    setAllIndeterminate(tmpAllIndeterminate);
  }

  function firstCheckConfig(data: any, tmpAllIndeterminate: SecondCheckedGroup) {
    console.log(44, data);
    //有部分选中
    const someChecked = _.find(data, function (value) {
      return value?.defaultValue?.length > 0;
    });
    //全选中
    const allChecked = _.filter(data, function (value) {
      return value?.defaultValue?.length === value?.operations?.length;
    });

    if (allChecked.length === data.length) {
      console.log(54, '全选中')
      tmpAllIndeterminate = {
        ...allIndeterminate,
        indeterminate: false,
        checked: true,
      }
    } else if (someChecked) {
      console.log(60, '有部分选中')
      tmpAllIndeterminate = {
        ...allIndeterminate,
        indeterminate: true,
        checked: true,
      }
    } else {
      console.log(66, '全取消')
      tmpAllIndeterminate = {
        ...allIndeterminate,
        indeterminate: false,
        checked: false,
      }
    }
    setAllIndeterminate(tmpAllIndeterminate);
  }


  useEffect(() => {
    getOperationByCheckedMenus().then(r => {
      if (!r || r.code !== 200) {
        message.error('获取权限列表失败');
        return;
      }
      const data = r?.data?.checkboxes;
      const tmpLoginRole = r?.data?.loginRole;
      setLoginRole(tmpLoginRole);
      const checkedGroups: OperationCheckedGroup[] = [];
      const secondCheckedGroups: SecondCheckedGroup[] = [];
      let tmpAllIndeterminate: SecondCheckedGroup = {
        indeterminate: false,
        checked: false
      }
      data?.forEach((value: any, index: number, array: any) => {
        checkedGroups.push({
          key: index,
          checkedKeys: value.defaultValue,
        });
        const checked = value?.defaultValue?.length > 0;
        const indeterminateSecond = checked && value?.defaultValue?.length != value.operations?.length;
        secondCheckedGroups.push({
          indeterminate: indeterminateSecond,
          checked: checked,
          disabled: tmpLoginRole === 0 ? false//超级管理员不控制（全亮）
            : (tmpLoginRole > props.defaultRole ? true//小角色不控制大角色权限（置灰）
              : (indeterminateSecond || value?.defaultValue?.length === 0))//半选或者全不选置灰
        });
      });
      console.log(43, secondCheckedGroups);
      setIndeterminate(_.omit(secondCheckedGroups));
      setOperationCheckedGroup(checkedGroups);
      setOperationData(data);
      firstAllConfig(data, tmpAllIndeterminate, tmpLoginRole);
    });
  }, []);

  /**
   * 全部选中按钮点击事件
   */
  const onFirstChange = (e: any) => {
    operationData.forEach((item, index) => {
      onSecondChange(index, e);
    });
    if (e.target.checked) {
      //全选中
      setAllIndeterminate({
        ...allIndeterminate,
        indeterminate: false,
        checked: true
      });
    } else {
      //全取消
      setAllIndeterminate({
        ...allIndeterminate,
        indeterminate: false,
        checked: false
      });
    }
    // firstCheckConfig(operationData, _.omit(allIndeterminate));
  }

  /**
   * 二级菜单选中点击事件
   * @param key
   * @param e
   */
  const onSecondChange = (key: number, e: any) => {
    console.log(59, key, e);
    if (e.target.checked) {
      console.log(68, '全部选中二级')
      //全选二级菜单
      indeterminate[key] = {
        ...indeterminate[key],
        indeterminate: false,
        checked: true
      };
      setIndeterminate(_.omit(indeterminate));
      const checkedKeys = _.map(operationData[key].operations || [], 'value');
      operationCheckedGroup[key] = {
        key,
        checkedKeys,
      };
      setOperationCheckedGroup(operationCheckedGroup);
    } else {
      console.log(68, '全部取消二级')
      //取消全部二级菜单
      operationCheckedGroup[key] = {
        key,
        checkedKeys: [],
      };
      setOperationCheckedGroup(operationCheckedGroup);
      indeterminate[key] = {
        ...indeterminate[key],
        indeterminate: false,
        checked: false
      };
      setIndeterminate(_.omit(indeterminate));
    }

  }

  const onChange = (key: number, checkedValue: CheckboxValueType[]) => {
    operationCheckedGroup[key] = {
      key,
      checkedKeys: checkedValue,
    };
    setOperationCheckedGroup(operationCheckedGroup);
    indeterminate[key] = {
      ...indeterminate[key],
      indeterminate: operationCheckedGroup[key].checkedKeys?.length > 0 && operationCheckedGroup[key]?.checkedKeys?.length != operationData[key]?.operations?.length,
      checked: operationCheckedGroup[key].checkedKeys?.length > 0
    };
    setIndeterminate(_.omit(indeterminate));
    console.log(44, checkedValue);
    console.log(45, operationCheckedGroup[key]?.checkedKeys?.length);
    firstCheckConfig(operationData, _.omit(allIndeterminate));
  };

  const getOperation = (operations: any[], parentIndex: number) => {
    console.log(200, loginRole, props.defaultRole);
    let operations1: any[] = [];
    operations1 = operations.map((operation: any, index: number) =>
      <>
        <Col span={6} key={operation.value}>
          <Checkbox key={operation.value} value={operation.value}
                    disabled={loginRole === 0 ? false : (!(loginRole <= props.defaultRole
                      && operationData[parentIndex]?.defaultValue.indexOf(operation.value) > -1))}>
            {operation.name}
          </Checkbox>
        </Col>
      </>
    );
    return operations1;
  }

  return (<>
    <ProForm
      submitter={{
        render: (_, dom) => access.canErdProjectRolePermissionEdit ? <FooterToolbar>{dom}</FooterToolbar> : <></>,
      }}
      onFinish={async (values) => {
        console.log(269, values, operationCheckedGroup);

        let checkedKeys: CheckboxValueType[] = [];
        operationCheckedGroup.forEach((value) => {
          checkedKeys = checkedKeys.concat(value.checkedKeys);
        });
        if (access.canErdProjectRolePermissionEdit) {
          await post('/ncnb/project/group/saveCheckedOperations',
            {
              checkedKeys,
              roleId: props.values.id
            }
          ).then((result) => {
            if (result.code === 200) {
              message.success("保存成功");
            } else {
              message.error(result.msg);
            }
          });
        }else {
          message.warning('无权操作权限功能');
        }

      }}
    >
      {operationData && operationData.length > 0 ?
        <List
          header={<div>
            <Checkbox
              indeterminate={allIndeterminate.indeterminate}
              checked={allIndeterminate.checked}
              disabled={allIndeterminate.disabled}
              onChange={onFirstChange.bind(this)}
            >全选
            </Checkbox>
          </div>}
          dataSource={operationData}
          renderItem={(item: any, index: number) => (
            <>
              {index > 0 ? <Divider/> : <></>}
              <Row align="middle">
                <Col span={6}>
                  <Checkbox key={index}
                            indeterminate={indeterminate[index].indeterminate}
                            checked={indeterminate[index].checked}
                            disabled={indeterminate[index].disabled}
                            onChange={onSecondChange.bind(this, index)}>
                    {item.menuName}
                  </Checkbox>
                </Col>
                <Col span={18}>
                  <Checkbox.Group
                    style={{width: '100%', margin: '0 8px'}}
                    defaultValue={item?.defaultValue}
                    value={operationCheckedGroup[index]?.checkedKeys}
                    onChange={onChange.bind(this, index)}
                    key={index}
                  >
                    <Row>
                      {
                        item?.operations?.length > 0 && getOperation(item?.operations, index)
                      }
                    </Row>
                  </Checkbox.Group>
                </Col>
              </Row>

            </>
          )}
        />
        : <Empty image="/empty.svg"
                 imageStyle={{
                   height: 200,
                 }}
        />
      }
    </ProForm>
  </>);
};

export default React.memo(GroupPermission)
