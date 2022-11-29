import React, {useEffect, useState} from 'react';
import shallow from "zustand/shallow";
import useVersionStore from "@/store/version/useVersionStore";
import './index.less';
import {compareStringVersion} from "@/utils/string";
import {Select, Space, Tag} from "antd";
import {ProList} from '@ant-design/pro-components';
import AddVersion from "@/components/dialog/version/AddVersion";
import SyncConfig from "@/components/dialog/version/SyncConfig";
import InitVersion from "@/components/dialog/version/InitVersion";
import RebuildVersion from "@/components/dialog/version/RebuildVersion";
import CompareVersion, {CompareVersionType} from "@/components/dialog/version/CompareVersion";
import RenameVersion from "@/components/dialog/version/RenameVersion";
import RemoveVersion from "@/components/dialog/version/RemoveVersion";
import SyncVersion from "@/components/dialog/version/SyncVersion";
import {CheckCircleFilled, WarningFilled} from "@ant-design/icons";
import _ from "lodash";
import {Access, useAccess} from "@@/plugin-access";

const {Option, OptGroup} = Select;


export type VersionProps = {};

export type IDatabase = any;

const Version: React.FC<VersionProps> = (props) => {
  const {dbs, synchronous, dbVersion, changes, versions, fetch, versionDispatch} = useVersionStore(state => ({
    dbs: state.dbs,
    synchronous: state.synchronous,
    dbVersion: state.dbVersion,
    changes: state.changes,
    versions: state.versions,
    fetch: state.fetch,
    versionDispatch: state.dispatch,
  }), shallow);

  const access = useAccess();

  console.log(40, 'access', access);
  console.log('dbs', 37, dbs);
  console.log('versions', 38, versions);
  console.log('changes', 48, changes);


  const [count, setCount] = useState(1);
  console.log(46, 'count',count,dbVersion);

  const refresh=()=>{
    setCount(count + 1);
  }
  // fetch();
  //获取全部历史版本
  useEffect(() => {
    fetch(null);
  }, [dbVersion]);




  const handleItemSelect = React.useCallback((db: IDatabase) => {
    console.log(57, db);
    // versionDispatch.dbChange(db);
  }, []);
  // NOTE: not using Films.itemRenderer here so we can set icons.
  /*  const renderDb: ItemRenderer<IDatabase> = (db: any, {modifiers, handleClick}) => {
      console.log(59, db);
      if (!modifiers.matchesPredicate) {
        return null;
      }
      return (
        <MenuItem
          key={db.key}
          active={db.defaultDB}
          // @ts-ignore
          icon={db.defaultDB ? "tick" : ""}
          label={db?.select}
          onClick={handleClick}
          text={db?.name}
          shouldDismissPopover={false}
        />
      );
    };*/

  const currentDB = versionDispatch.getCurrentDB();

  console.log(98, 'currentDB', currentDB)
  console.log(98, 'dbs  groupDb', _.groupBy(dbs, g => g.select))

  const [activeKey, setActiveKey] = useState<React.Key | undefined>('tab1');


  const groupDb = _.groupBy(dbs, g => g.select);
  return (
    <div>
      <ProList<any>
        rowKey="id"
        dataSource={versions}
        metas={{
          title: {
            dataIndex: 'version',
          },
          description: {
            dataIndex: 'versionDesc',
            render: (_, row) => {
              return (
                <Space>
                  <span>{row.versionDate}</span>
                  <span>{row.versionDesc}</span>
                </Space>
              );
            },
          },
          subTitle: {
            dataIndex: 'labels',
            render: (_, row) => {
              return (
                <Space>
                  {
                    // eslint-disable-next-line no-nested-ternary
                    compareStringVersion(row.version, dbVersion) <= 0 ?
                      <Tag title={"已同步到数据源"} color="blue">已同步</Tag>
                      :
                      synchronous[row.version] ?
                        <Tag title={"正在同步到数据源"} color="lime">正在同步</Tag>
                        :
                        <Tag title={"未同步到数据源"} color="red">未同步</Tag>
                  }
                </Space>
              );
            },
            search: false,
          },
          actions: {
            render: (text, row) => [
              <CompareVersion type={CompareVersionType.DETAIL}/>,
              <CompareVersion type={CompareVersionType.COMPARE}/>,
              <Access
                accessible={access.canErdHisprojectEdit}
                fallback={<></>}
              >
                <RenameVersion/>
              </Access>,
              <Access
                accessible={access.canErdHisprojectDel}
                fallback={<></>}
              >
                <RemoveVersion/>
              </Access>,
              <Access
                accessible={access.canErdConnectorDbsync}
                fallback={<></>}
              >
                <SyncVersion refresh={refresh}  synced={compareStringVersion(row.version, dbVersion) <= 0}/>
              </Access>

            ],
          },
        }}
        onRow={(record: any, index: number) => {
          return {
            onMouseEnter: (event) => {
              versionDispatch.setCurrentVersion(record, index);
              console.log(123)
            }, // 鼠标移入行
          };
        }}
        toolbar={{
          menu: {
            activeKey,
            items: [
              {
                key: 'tab1',
                label:
                  changes.length > 0 ?
                    <span title={"当前内容与上一版本的内容有变化，但未保存同步版本！"}>
                     <Tag color="red">
                      <WarningFilled size={30}/>
                      </Tag>
                    </span>
                    :
                    <span title={"当前内容与上一版本内容无变化"}>
                      <Tag color="blue">
                        <CheckCircleFilled size={30}/>
                      </Tag>
                    </span>
                ,
              },
              {
                key: 'tab2',
                label: /*<ProFormSelect

                  initialValue={{value:currentDB !== '' ? currentDB : ""}}
                  placeholder="未选择数据源"
                  request={async () => dbs.map((m: any) => {
                    return {
                      label: m.name,
                      value: m.name
                    }
                  })}
                  width="xs"
                  name="useMode"
                  label="请选择数据源"
                />,*/
                  <Space>
                    数据源
                    <Select
                      labelInValue
                      value={currentDB ? currentDB : "请选择数据源"}
                      style={{width: 200}}
                      onChange={handleItemSelect}
                    >
                      {
                        Object.keys(groupDb).map(m => {
                          console.log(267, m, groupDb[m]);
                          return <OptGroup key={m} label={m}>
                            {groupDb[m].map(
                              m1 => {
                                return <Option key={m.name} value={m1.name}>{m1.name}</Option>
                              }
                            )}
                          </OptGroup>
                        })

                      }
                    </Select>
                  </Space>

              },
            ],
            onChange(key) {
              setActiveKey(key);
            },
          },
          actions: [
            <Access
              accessible={access.canErdHisprojectAdd}
              fallback={<></>}
            >
              <AddVersion trigger="bp"/>
            </Access>,
            <Access
              accessible={access.canErdHisprojectConfig}
              fallback={<></>}
            >
              <SyncConfig/>
            </Access>,
            <Access
              accessible={access.canErdHisprojectInit}
              fallback={<></>}
            >
              <InitVersion/>
            </Access>,
            <Access
              accessible={access.canErdHisprojectRebuild}
              fallback={<></>}
            >
              <RebuildVersion/>
            </Access>,

          ],
        }}
      />
    </div>
  );
}

export default React.memo(Version)
