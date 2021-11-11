import React from 'react';
import ProForm, {ModalForm, ProFormRadio, ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import _ from "lodash";
import {Button as MuiButton, Grid} from "@mui/material";


export type DatabaseSetUpProps = {};


const DatabaseSetUp: React.FC<DatabaseSetUpProps> = (props) => {

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
            <ProFormRadio.Group
              name="radio-vertical"
              layout="vertical"
              options={[
                {
                  label: <ProForm.Group>
                    <ProFormText
                      width={100}
                      name="name"
                      placeholder="请输入数据库名称"
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
                    /> <ProFormSelect
                    name="db"
                    width={100}
                    rules={[{required: true}]}
                    fieldProps={{
                      labelInValue: true,
                    }}
                    request={async () => [
                      {label: '全大写', value: 'UPPERCASE'},
                      {label: '全小写', value: 'LOWCASE'},
                      {label: '不处理', value: 'DEFAULT'},
                    ]}
                  />
                  </ProForm.Group>,
                  value: 'a',
                },
                {
                  label: 'item 2',
                  value: 'b',
                },
                {
                  label: 'item 3',
                  value: 'c',
                },
              ]}
            />
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