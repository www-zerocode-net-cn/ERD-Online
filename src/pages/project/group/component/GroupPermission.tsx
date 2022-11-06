import React, {useEffect, useState} from "react";
import {FooterToolbar, ProForm} from '@ant-design/pro-components';
import {CheckboxValueType} from "antd/lib/checkbox/Group";
import {get, post} from "@/services/crud";
import {Checkbox, Col, Divider, Empty, List, message, Row} from "antd";
import _ from "lodash";

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
}

export type GroupPermissionProps = {
  values: any;
};
const GroupPermission: React.FC<GroupPermissionProps> = (props) => {
  const [operationData, setOperationData] = useState<PermissionGroup[]>([]);
  const [indeterminate, setIndeterminate] = useState<SecondCheckedGroup[]>([]);
  const [allIndeterminate, setAllIndeterminate] = useState<SecondCheckedGroup>({
    indeterminate: false,
    checked: false
  });
  //各菜单选中的的元素集合
  const [operationCheckedGroup, setOperationCheckedGroup] = useState<OperationCheckedGroup[]>([]);


  const getOperationByCheckedMenus = async () => {
    const result = await get('/ncnb/project/role/permission', {roleId: props.values?.id || '1'});
    return result?.data;
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
        indeterminate: false,
        checked: true
      }
    } else if (someChecked) {
      console.log(60, '有部分选中')
      tmpAllIndeterminate = {
        indeterminate: true,
        checked: true
      }
    } else {
      console.log(66, '全取消')
      tmpAllIndeterminate = {
        indeterminate: false,
        checked: false
      }
    }
    setAllIndeterminate(tmpAllIndeterminate);
  }

  useEffect(() => {
    getOperationByCheckedMenus().then(data => {
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
        secondCheckedGroups.push({
          indeterminate: checked && value?.defaultValue?.length != value.operations?.length,
          checked: checked
        });
      });
      console.log(43, secondCheckedGroups);
      setIndeterminate(_.omit(secondCheckedGroups));
      setOperationCheckedGroup(_.omit(checkedGroups));
      setOperationData(data);
      firstCheckConfig(data, tmpAllIndeterminate);
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
        indeterminate: false,
        checked: true
      });
    } else {
      //全取消
      setAllIndeterminate({
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
        indeterminate: false,
        checked: true
      };
      setIndeterminate(_.omit(indeterminate));
      const checkedKeys = _.map(operationData[key].operations || [], 'value');
      operationCheckedGroup[key] = {
        key,
        checkedKeys,
      };
      setOperationCheckedGroup(_.omit(operationCheckedGroup));
    } else {
      console.log(68, '全部取消二级')
      //取消全部二级菜单
      operationCheckedGroup[key] = {
        key,
        checkedKeys: [],
      };
      setOperationCheckedGroup(_.omit(operationCheckedGroup));
      indeterminate[key] = {
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
    setOperationCheckedGroup(_.omit(operationCheckedGroup));
    indeterminate[key] = {
      indeterminate: operationCheckedGroup[key].checkedKeys?.length > 0 && operationCheckedGroup[key]?.checkedKeys?.length != operationData[key]?.operations?.length,
      checked: operationCheckedGroup[key].checkedKeys?.length > 0
    };
    setIndeterminate(_.omit(indeterminate));
    console.log(44, checkedValue);
    console.log(45, operationCheckedGroup[key]?.checkedKeys?.length);
    console.log(46, operationData[key]?.operations?.length);
    operationData[key] = {
      ...operationData[key],
      defaultValue: checkedValue,
    };
    setOperationData(operationData);
    firstCheckConfig(operationData, _.omit(allIndeterminate));
  };

  const getOperation = (operations: any[]) => {

    let operations1: any[] = [];
    operations1 = operations.map((operation: any, index: number) =>
      <>
        <Col span={6} key={operation.value}>
          <Checkbox value={operation.value}>{operation.name}</Checkbox>
        </Col>
      </>
    );
    return operations1;
  }

  return (<>
    <ProForm
      submitter={{
        render: (_, dom) => <FooterToolbar>{dom}</FooterToolbar>,
      }}
      onFinish={async (values) => {
        console.log(values);

        let checkedKeys: CheckboxValueType[] = [];
        operationCheckedGroup.forEach((value) => {
          checkedKeys = checkedKeys.concat(value.checkedKeys);
        });
        await post('/syst/role/saveCheckedOperations',
          {
            checkedKeys,
            roleId: props.values.id
          }
        ).then((result) => {
          if (result.code === 200) {
            message.success("得到的");
          } else {
            message.error(result.msg);
          }
        });

      }}
    >
      {operationData && operationData.length > 0 ?
        <List
          header={<div>
            <Checkbox
              indeterminate={allIndeterminate.indeterminate}
              checked={allIndeterminate.checked}
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
                        item?.operations?.length > 0 && getOperation(item?.operations)
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
