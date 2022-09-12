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


  console.log('dbs', 37, dbs);
  console.log('versions', 38, versions);
  console.log('changes', 48, changes);
  // fetch();
  //获取全部历史版本
  useEffect(() => {
    fetch(null);
  }, []);

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
      {/*      <div className="model-template-tool">
        <h5 className="bp4-heading head">历史版本</h5>
        {changes.length > 0 ?
          <span title={"当前内容与上一版本的内容有变化，但未保存同步版本！"}><ReportIcon color={"warning"}/></span>
          :
          <span title={"当前内容与上一版本内容无变化"}><AssignmentTurnedInIcon/></span>
        }
      </div>
      <Divider/>
      <DatabaseSelect
        onItemSelect={handleItemSelect}
        // @ts-ignore
        items={dbs}
        filterable={false}
        itemRenderer={renderDb}
        fill={true}
        noResults={<MenuItem disabled={true} text="未配置数据源"/>}
      >
        <Button
          icon="database"
          rightIcon="caret-down"
          fill={true}
          text={currentDB !== '' ? currentDB : "(请选择数据源)"}
        />
      </DatabaseSelect>
      <div className="version-list">
        <Top size="90%" scrollable={true}>
          <Timeline position="left">
            {versions && versions.length > 0 ?
              versions.map((v: any, index: number) => {
                return <TimelineItem key={v.version}>
                  <TimelineOppositeContent sx={{m: 'auto 0'}}
                                           variant="body2">
                    {v.versionDate}
                  </TimelineOppositeContent>
                  <TimelineSeparator>
                    <TimelineConnector/>
                    {
                      // eslint-disable-next-line no-nested-ternary
                      compareStringVersion(v.version, dbVersion) <= 0 ?
                        <TimelineDot color="info" title="已同步"><CloudSyncIcon/></TimelineDot>
                        :
                        synchronous[v.version] ?
                          <TimelineDot color="secondary" title="正在同步"><SyncAltIcon/></TimelineDot> :
                          <TimelineDot color="error" title="未同步"><SyncDisabledIcon/></TimelineDot>

                    }
                    <TimelineConnector/>
                  </TimelineSeparator>
                  <TimelineContent sx={{py: '12px', px: 2}}>
                    <Typography variant="h6" component="span">
                      <Popover2
                        autoFocus={false}
                        enforceFocus={false}
                        hasBackdrop={true}
                        content={<VersionHandle/>}
                        placement={"bottom-start"}
                      >
                        <a onMouseOver={() => {
                          versionDispatch.setCurrentVersion(v, index)
                        }}>
                          {v.version}
                          {
                            compareStringVersion(v.version, dbVersion) === 0 ?
                              <span title={`当前数据源最新同步版本[${v.version}]`}><BookmarkBorderIcon/></span> : ''
                          }
                        </a>
                      </Popover2>
                    </Typography>
                    <Typography variant="body2">{v.versionDesc}</Typography>
                  </TimelineContent>
                </TimelineItem>
              }) :
              <Empty
                image="/empty.svg"
                imageStyle={{
                  height: 60,
                }}
                description={
                  <span>未创建版本</span>
                }
              >
              </Empty>

            }
          </Timeline>
        </Top>
      </div>*/}

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
              <RenameVersion/>,
              <RemoveVersion/>,
              <SyncVersion/>

            ],
          },
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
            <AddVersion trigger="bp"/>,
            <SyncConfig/>,
            <InitVersion/>,
            <RebuildVersion/>,

          ],
        }}
      />
    </div>
  );
}

export default React.memo(Version)
