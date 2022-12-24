import {Checkbox, Col, Divider, Empty, message, Row} from 'antd';
import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {GET, POST} from "@/services/crud";
import type {CheckboxValueType} from "antd/lib/checkbox/Group";

export type OperationCheckedGroup = {
  key: number;
  checkedKeys: CheckboxValueType[];
}

export type RoleItem = {
  id: number | null;
  roleName: string;
  roleCode: string;
  roleDesc?: string;
  dsType: string;
  dsScope?: string;
  tenantId?: number;
  delFlag?: string;
  createTime: string;
  updateTime?: string;
  creator?: string;
  updater?: string;
};

const OperationPrivilege = (props: { values: Partial<RoleItem>; }, ref: React.Ref<unknown> | undefined) => {
    const [operationData, setOperationData] = useState([]);
    const [operationCheckedGroup, setOperationCheckedGroup] = useState<OperationCheckedGroup[]>([]);
    useImperativeHandle(ref, () => ({
      saveCheckedOperations: async () => {
        let checkedKeys: CheckboxValueType[] = [];
        operationCheckedGroup.forEach((value) => {
          checkedKeys = checkedKeys.concat(value.checkedKeys);
        });
        await POST('/syst/role/saveCheckedOperations',
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
      },
    }));

    const getOperationByCheckedMenus = async () => {
      const result = await GET('/syst/role/getOperationByCheckedMenus', {roleId: props.values.id});
      return result?.data;
    }
    useEffect(() => {
      getOperationByCheckedMenus().then(data => {
        const checkedGroups: OperationCheckedGroup[] = [];
        data?.forEach((value:any, index:number, array:any) => {
          checkedGroups.push({
            key: index,
            checkedKeys: value.defaultValue,
          });
        });
        setOperationCheckedGroup(checkedGroups);
        setOperationData(data);
      });
    }, []);

    const onChange = (key: number, checkedValue: CheckboxValueType[]) => {
      operationCheckedGroup[key] = {
        key,
        checkedKeys: checkedValue,
      };
      setOperationCheckedGroup(operationCheckedGroup);
      console.log(checkedValue);

    };

    const renderOperations = () => {
      let operations: any[] = [];
      if (!operationData || operationData.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
      }
      operations = operationData.map((value: any, index: number) =>
        <div key={index}>
          <Divider orientation="left">
            {value.menuName}
          </Divider>
          <Checkbox.Group
            style={{width: '100%', margin: '0 8px'}}
            defaultValue={value.defaultValue}
            onChange={onChange.bind(this, index)}
            key={index}
          >
            <Row>
              {
                value?.operations?.length > 0 && getOperation(value?.operations)
              }
            </Row>
          </Checkbox.Group>
        </div>
      );
      return operations;
    }

    const getOperation = (operations: any[]) => {
      let operations1: any[] = [];
      operations1 = operations.map((operation: any, index: number) =>
        <Col span={4} key={operation.value}>
          <Checkbox value={operation.value}>{operation.name}</Checkbox>
        </Col>
      );
      return operations1;
    }

    return (
      <>
        {renderOperations()}
      </>
    );
  }
;
export default forwardRef(OperationPrivilege);
