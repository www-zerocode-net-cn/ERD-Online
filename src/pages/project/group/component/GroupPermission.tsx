import React, {useEffect, useState} from "react";
import {FooterToolbar, ProForm} from '@ant-design/pro-components';
import {CheckboxValueType} from "antd/lib/checkbox/Group";
import {get, post} from "@/services/crud";
import {Checkbox, Col, Divider, Empty, message, Row} from "antd";
export type OperationCheckedGroup = {
  key: number;
  checkedKeys: CheckboxValueType[];
}

export type GroupPermissionProps = {
  values: any;
};
const GroupPermission: React.FC<GroupPermissionProps> = (props) => {
  const [operationData, setOperationData] = useState([]);
  const [operationCheckedGroup, setOperationCheckedGroup] = useState<OperationCheckedGroup[]>([]);


  const getOperationByCheckedMenus = async () => {
    const result = await get('/ncnb/project/role/permission', {roleId: props.values?.id||'1'});
    return result?.data;
  }
  useEffect(() => {
    getOperationByCheckedMenus().then(data => {
      const checkedGroups: OperationCheckedGroup[] = [];
      data?.forEach((value: any, index: number, array: any) => {
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
      return <Empty image="/empty.svg"
                    imageStyle={{
                      height: 200,
                    }}
      />
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
      {renderOperations()}
    </ProForm>
  </>);
};

export default React.memo(GroupPermission)
