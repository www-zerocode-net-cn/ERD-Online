import React, {useState} from 'react';
import ProForm, {
  ModalForm,
  ProFormFieldSet,
  ProFormGroup,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText
} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import _ from "lodash";
import {Button as MuiButton, Grid} from "@mui/material";

export type DatabaseSetUpProps = {};


const DatabaseSetUp: React.FC<DatabaseSetUpProps> = (props) => {
  const [position] = useState<'bottom' | 'top'>('bottom');
  return (<>
      <ModalForm
        title={<span>数据库连接配置</span>}
        trigger={
          <Button
            key="db"
            icon="database"
            text="数据库设置"
            minimal={true}
            small={true}
            fill={true}
            alignText={Alignment.LEFT}></Button>
        }
        // 完全自定义整个区域
        submitter={{
          // 完全自定义整个区域
          render: (props, doms) => {
            console.log(props);
            // @ts-ignore
            return _.concat([], [
              <MuiButton variant="outlined" color="warning" key="rest"
                         onClick={() => props.form?.resetFields()}>重置</MuiButton>,
              <MuiButton variant="contained" key="submit" onClick={() => props.form?.submit?.()}> 确定 </MuiButton>,
            ]);
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ProForm
              onFinish={async (values: any) => {
                console.log('Received values of form:', values);
              }}
              submitter={false}
            >
              <ProFormList
                name="users"
                label={<span>当前数据库版本使用的数据库为【】</span>}
                creatorButtonProps={{
                  position,
                  creatorButtonText:"新增一个数据库"
                }}
                creatorRecord={{
                  name: 'test',
                }}
                initialValue={[
                  {
                    name: '1111',
                    nickName: '1111',
                    age: 111,
                    birth: '2021-02-18',
                    sex: 'man',
                    addr: ["true", "123", "chapter"],
                  },
                ]}
                copyIconProps={false}
              >
                <ProFormGroup>
                  <ProFormFieldSet
                    name="addr"
                    transform={(value: any) => ({radio: value[0], name: value[1], select: value[2]})}
                  >
                    <ProFormRadio name="radio"/>
                    <ProFormSelect
                      options={[
                        {
                          value: 'chapter',
                          label: '盖章',
                        },
                      ]}
                      name="select"
                    />
                    <ProFormText
                      name="name"
                      fieldProps={{
                        size: "small",
                      }}
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    />

                  </ProFormFieldSet>
                </ProFormGroup>
              </ProFormList>
            </ProForm>
          </Grid>
          <Grid item xs={6}>
            <ProFormText
              width="md"
              name="driver_class_name"
              label="driver_class_name"
              placeholder="driver_class_name"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                  {
                    max: 200,
                    message: '不能大于 200 个字符',
                  },
                ],
              }}
            />
            <ProFormText
              width="md"
              name="url"
              label="url"
              placeholder="请输入url"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                  {
                    max: 100,
                    message: '不能大于 100 个字符',
                  },
                ],
              }}
            />
            <ProFormText
              width="md"
              name="username"
              label="username"
              placeholder="请输入username"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                  {
                    max: 100,
                    message: '不能大于 100 个字符',
                  },
                ],
              }}
            />
            <ProFormText
              width="md"
              name="password"
              label="password"
              placeholder="请输入password"
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                  {
                    max: 100,
                    message: '不能大于 100 个字符',
                  },
                ],
              }}
            />
          </Grid>
        </Grid>
      </ModalForm>


    </>
  );
};

export default React.memo(DatabaseSetUp)
