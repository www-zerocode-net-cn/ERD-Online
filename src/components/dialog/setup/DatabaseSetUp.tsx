import React, {useEffect, useRef, useState} from 'react';
import {
  ModalForm,
  ProFormGroup,
  ProFormInstance,
  ProFormList,
  ProFormRadio,
  ProFormSelect,
  ProFormText
} from "@ant-design/pro-form";
import {Alignment, Button} from "@blueprintjs/core";
import _ from "lodash";
import {Button as MuiButton, Grid} from "@mui/material";
import useProjectStore from "@/store/project/useProjectStore";
import shallow from "zustand/shallow";
import {uuid} from '@/utils/uuid';
import {DeleteOutlined, PlusOutlined} from '@ant-design/icons';
import {Button as AntButton, message, Popconfirm} from 'antd';
import * as Save from '@/utils/save';

export type DatabaseSetUpProps = {};


const DatabaseSetUp: React.FC<DatabaseSetUpProps> = (props) => {
  const {projectDispatch, currentDbKey, tempDBs, database} = useProjectStore(state => ({
    projectDispatch: state.dispatch,
    currentDbKey: state.currentDbKey,
    tempDBs: state.project.projectJSON?.profile?.dbs || [],
    database: state.project.projectJSON?.dataTypeDomains?.database || [],
  }), shallow);


  console.log(36, 'tempDBs', tempDBs);


  const url = {
    mysql: {
      url: 'jdbc:mysql://IP地址:端口号/数据库名?characterEncoding=UTF-8&useSSL=false&useUnicode=true&serverTimezone=UTC',
      driver_class_name: 'com.mysql.jdbc.Driver',
    },
    oracle: {
      url: 'jdbc:oracle:thin:@IP地址:端口号/数据库名',
      driver_class_name: 'oracle.jdbc.driver.OracleDriver',
    },
    sqlserver: {
      url: 'jdbc:sqlserver://IP地址:端口号;DatabaseName=数据库名',
      driver_class_name: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    },
    postgresql: {
      url: 'jdbc:postgresql://IP地址:端口号/数据库名',
      driver_class_name: 'org.postgresql.Driver',
    },
  };

  const defaultDatabase = _.find(database, {"defaultDatabase": true})?.code || database[0]?.code || 'MYSQL';

  const dbName = defaultDatabase.toLocaleLowerCase();
  const defaultDBData = url[dbName] || {};

  const getDefaultDbs = (db: any) => {
    db = db ? db : tempDBs;
    return db.filter((d: any) => d.defaultDB)[0];
  }

  const defaultDbs = getDefaultDbs(null);
  console.log(57, defaultDbs);
  const defaultData = defaultDbs || tempDBs[0];
  console.log(60, defaultData);

  console.log(60, defaultDatabase);

  const [state, setState] = useState({
    loading: false
  });

  const connectJDBC = () => {
    const newVar = formRef && formRef.current?.validateFields();
    console.log(78, newVar);
    newVar?.then(() => {
      const {properties} = defaultData;
      console.log(78, 'properties', properties);
      setState({
        loading: true,
      });
      Save.ping({
        ...properties
      }).then((res: any) => {
        if (res.code !== 200) {
          message.error('连接失败:' + res.msg);
        } else {
          message.success('连接成功');
        }
      }).catch((err) => {
        message.error('连接失败！');
      }).finally(() => {
        setState({
          loading: false,
        });
      });
    });

  };

  // Ant Form 有个臭毛病，form只会加载一次，state变化不会重新加载，用此解决
  const formRef = useRef<ProFormInstance<any>>();
  useEffect(() => {
    console.log('清除form');
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    formRef && formRef.current?.resetFields();
  }, [currentDbKey, tempDBs]);


  const getData = () => {
    return tempDBs.filter((d: any) => d.defaultDB)[0];
  };

  const defaultDB = getData();

  const databaseSelect = database.map((d: any) => {
    return {
      label: d.code,
      value: d.code,
    }
  });


  return (<>
      <ModalForm
        formRef={formRef}
        title={<span>数据源连接配置</span>}
        trigger={
          <Button
            key="db"
            icon="database"
            text="数据源设置"
            minimal={true}
            small={true}
            fill={true}
            alignText={Alignment.LEFT}></Button>
        }
        initialValues={{
          ...defaultDbs?.properties,
          dbs: tempDBs
        }}
        // 完全自定义整个区域
        submitter={{
          // 完全自定义整个区域
          render: (props, doms) => {
            console.log(props);
            // @ts-ignore
            return _.concat([], [
              <MuiButton disabled={!defaultData} variant="outlined" color="warning" key="rest"
                         onClick={() => connectJDBC()}>{state.loading ? "正在连接" : "测试"}</MuiButton>,
              <MuiButton variant="contained" key="submit" onClick={() => {
                message.success("保存成功！");
              }}> 确定 </MuiButton>,
            ]);
          },
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <ProFormList
              name="dbs"
              creatorButtonProps={false}
              label={
                <span>{defaultDB ? ` 当前使用的数据源为「${defaultDB.name}」` : tempDBs.length > 0 ? ' 当前未选择默认数据源' : '当前未创建数据源'}</span>}
              itemRender={
                ({listDom, action}, {record}) => {
                  console.log(147, 'record', record);
                  return (
                    <ProFormGroup size={8}>
                      <ProFormRadio
                        name="defaultDB"
                        fieldProps={{
                          onChange: () => {
                            projectDispatch.setDefaultDb(record.key)
                          }
                        }}/>
                      <ProFormSelect
                        options={databaseSelect || []}
                        name="select"
                        fieldProps={{
                          disabled: !record.defaultDB,
                          onChange: (value: any, option: any) => {
                            console.log(166, value, option);
                            projectDispatch.updateDbs('select', value);
                            projectDispatch.updateDbs('properties', {
                              driver_class_name: url[value.toLowerCase()].driver_class_name,
                              url: url[value.toLowerCase()].url,
                              username: '',
                              password: ''
                            });
                          }
                        }}
                      />
                      <ProFormText
                        name="name"
                        fieldProps={{
                          size: "small",
                          disabled: !record.defaultDB,
                          onBlur: (e) => {
                            console.log(182, e.target.value);
                            projectDispatch.updateDbs('name', e.target.value);
                          }
                        }}
                        rules={[
                          {
                            required: true,
                          },
                        ]}
                      />
                      <Popconfirm
                        title={record.defaultDB ? "是否要删除默认数据源，删除之后，系统将不存在默认数据源" : "是否删除该数据源"}
                        onConfirm={() => projectDispatch.removeDbs(record.key)}
                        okText="是"
                        cancelText="否"
                      >
                        <a><DeleteOutlined title={"删除"}/></a>
                      </Popconfirm>
                    </ProFormGroup>
                  );
                }
              }
              copyIconProps={false}
            >
              <></>
            </ProFormList>
            <AntButton type="dashed" block icon={<PlusOutlined/>}
                       onClick={() => {
                         projectDispatch.addDbs({
                           name: '',
                           select: defaultDatabase,
                           key: uuid(),
                           defaultDB: tempDBs.findIndex((db: any) => db.defaultDB) === -1,
                           properties: {
                             driver_class_name: defaultDBData.driver_class_name,
                             url: defaultDBData.url,
                             password: '',
                             username: ''
                           }
                         });
                       }}>新增数据源</AntButton>

          </Grid>
          <Grid item xs={6}>
            <ProFormText
              width="md"
              name="driver_class_name"
              label="driver_class_name"
              placeholder="driver_class_name"
              fieldProps={{
                onBlur: (e) => {
                  console.log(225, e.target.value);
                  projectDispatch.updateDbs('properties', {
                    ...defaultDbs.properties,
                    driver_class_name: e.target.value
                  });
                }
              }}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                  {
                    max: 300,
                    message: '不能大于 300 个字符',
                  },
                ],

              }}
            />
            <ProFormText
              width="md"
              name="url"
              label="url"
              placeholder="请输入url"
              fieldProps={{
                onBlur: (e) => {
                  console.log(254, e.target.value);
                  projectDispatch.updateDbs('properties', {
                    ...defaultDbs.properties,
                    url: e.target.value
                  });
                }
              }}
              formItemProps={{
                rules: [
                  {
                    required: true,
                    message: '不能为空',
                  },
                  {
                    max: 300,
                    message: '不能大于 300 个字符',
                  },
                ],
              }}
            />
            <ProFormText
              width="md"
              name="username"
              label="username"
              placeholder="请输入username"
              fieldProps={{
                onBlur: (e) => {
                  console.log(281, e.target.value);
                  projectDispatch.updateDbs('properties', {
                    ...defaultDbs.properties,
                    username: e.target.value
                  });
                }
              }}
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
              fieldProps={{
                onBlur: (e) => {
                  console.log(308, e.target.value);
                  projectDispatch.updateDbs('properties', {
                    ...defaultDbs.properties,
                    password: e.target.value
                  });
                }
              }}
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
