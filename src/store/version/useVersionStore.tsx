import create from "zustand";
import _ from "lodash";
import {message} from "antd";
import {compareStringVersion} from "@/utils/string";
import useProjectStore from "@/store/project/useProjectStore";
import * as Save from '@/utils/save';

export type IVersionSlice = {
  checkBaseVersion: (versions: any) => void;
  getVersionMessage: (versionData: any, only?: boolean) => void;
  getDBVersion: () => void;
  getAllTable: (dataSource: any) => any;
  calcChanges: (data: any) => any;
  compareField: (currentField: any, checkField: any, table: any) => any;
  compareEntity: (currentTable: any, checkTable: any) => any;
  compareIndexs: (currentTable: any, checkTable: any) => any;
  compareIndex: (currentIndex: any, checkIndex: any, table: any) => any;
  compareStringArray: (currentFields: any, checkFields: any, title: any, name: any) => any;

}

export type VersionState =
  {
    init: boolean;
    versionData: boolean;
    versions: any;
    dbVersion: string;
    changes: any,
    synchronous: any;
    fetch: () => Promise<void>;
    dispatch: IVersionSlice;
  }

const projectState = useProjectStore.getState();

const useVersionStore = create<VersionState>(
  (set, get) => ({
    init: true,
    versionData: true,
    versions: [],
    dbVersion: '',
    changes: [],
    synchronous: {},
    fetch: async () => {
      await Save.hisProjectLoad().then(res => {
        if (res) {
          const versions = res.data;
          if (versions) {
            console.log(44, 'versions', res);
            get().dispatch.checkBaseVersion(versions);
            get().dispatch.getVersionMessage(versions);
            get().dispatch.getDBVersion();
            set({
              changes: get().dispatch.calcChanges(versions)
            });
          } else {
            message.error('获取版本信息失败');
          }
        }
      });
    },
    dispatch: {
      compareStringArray: (currentFields, checkFields, title, name) => {
        const changes: any = [];
        currentFields.forEach((f: any) => {
          if (!checkFields.includes(f)) {
            changes.push({
              type: 'index',
              name: `${title}.${name}.fields.${f}`,
              opt: 'update',
              changeData: `addField=>${f}`,
            });
          }
        });
        checkFields.forEach((f: any) => {
          if (!currentFields.includes(f)) {
            changes.push({
              type: 'index',
              name: `${title}.${name}.fields.${f}`,
              opt: 'update',
              changeData: `deleteField=>${f}`,
            });
          }
        });
        return changes;
      },
      compareIndex: (currentIndex, checkIndex, table) => {
        const changes: any = [];
        Object.keys(currentIndex).forEach((name) => {
          if (checkIndex[name] !== currentIndex[name]) {
            changes.push({
              type: 'index',
              name: `${table.title}.${currentIndex.name}.${name}`,
              opt: 'update',
              changeData: `${checkIndex[name]}=>${currentIndex[name]}`,
            });
          }
        });
        return changes;
      },
      compareIndexs: (currentTable, checkTable) => {
        const changes: any = [];
        const currentIndexs = currentTable.indexs || [];
        const checkIndexs = checkTable.indexs || [];
        const checkIndexNames = checkIndexs.map((index: any) => index.name);
        const currentIndexNames = currentIndexs.map((index: any) => index.name);
        currentIndexs.forEach((cIndex: any) => {
          if (!checkIndexNames.includes(cIndex.name)) {
            changes.push({
              type: 'index',
              name: `${currentTable.title}.${cIndex.name}`,
              opt: 'add',
            });
          } else {
            const checkIndex = checkIndexs.filter((c: any) => c.name === cIndex.name)[0] || {};
            changes.push(...get().dispatch.compareIndex(_.omit(cIndex, ['fields']),
              _.omit(checkIndex, ['fields']), currentTable));
            // 比较索引中的属性
            const checkFields = checkIndex.fields || [];
            const currentFields = cIndex.fields || [];
            changes.push(...get().dispatch.compareStringArray(
              currentFields, checkFields, currentTable.title, cIndex.name));
          }
        });
        checkIndexs.forEach((cIndex: any) => {
          if (!currentIndexNames.includes(cIndex.name)) {
            changes.push({
              type: 'index',
              name: `${currentTable.title}.${cIndex.name}`,
              opt: 'delete',
            });
          }
        });
        return changes;
      },
      compareEntity: (currentTable, checkTable) => {
        const changes: any = [];
        Object.keys(currentTable).forEach((name) => {
          if (checkTable[name] !== currentTable[name]) {
            changes.push({
              type: 'entity',
              name: `${currentTable.title}.${name}`,
              opt: 'update',
              changeData: `${checkTable[name]}=>${currentTable[name]}`,
            });
          }
        });
        return changes;
      },
      compareField: (currentField: any, checkField: any, table: any) => {
        const changes: any = [];
        Object.keys(currentField).forEach((name) => {
          if (checkField[name] !== currentField[name]) {
            changes.push({
              type: 'field',
              name: `${table.title}.${currentField.name}.${name}`,
              opt: 'update',
              changeData: `${checkField[name]}=>${currentField[name]}`,
            });
          }
        });
        return changes;
      },
      getAllTable: (dataSource: any) => {
        return (dataSource.modules || []).reduce((a: any, b: any) => {
          return a.concat((b.entities || []));
        }, []);
      },
      calcChanges: (data: any) => {
        const dataSource = projectState.project;
        const changes: any = [];
        const checkVersion = data.sort((a: any, b: any) => compareStringVersion(b.version, a.version))[0];
        if (checkVersion) {
          // 读取当前版本的内容
          const currentDataSource = {...dataSource};
          const checkDataSource = {
            modules: _.get(checkVersion, 'projectJSON.modules', []),
          };
          // 组装需要比较的版本内容
          // 循环比较每个模块下的每张表以及每一个字段的差异
          // 1.获取所有的表
          const currentTables = get().dispatch.getAllTable(currentDataSource);
          const checkTables = get().dispatch.getAllTable(checkDataSource);
          const checkTableNames = checkTables.map((e: any) => e.title);
          const currentTableNames = currentTables.map((e: any) => e.title);
          // 2.将当前的表循环
          currentTables.forEach((table: any) => {
            // 1.1 判断该表是否存在
            if (checkTableNames.includes(table.title)) {
              // 1.2.1 如果该表存在则需要对比字段
              const checkTable = checkTables.filter((t: any) => t.title === table.title)[0] || {};
              // 将两个表的所有的属性循环比较
              const checkFields = (checkTable.fields || []).filter((f: any) => f.name);
              const tableFields = (table.fields || []).filter((f: any) => f.name);
              const checkFieldsName = checkFields.map((f: any) => f.name);
              const tableFieldsName = tableFields.map((f: any) => f.name);
              tableFields.forEach((field: any) => {
                if (!checkFieldsName.includes(field.name)) {
                  changes.push({
                    type: 'field',
                    name: `${table.title}.${field.name}`,
                    opt: 'add',
                  });
                } else {
                  // 比较属性的详细信息
                  const checkField = checkFields.filter((f: any) => f.name === field.name)[0] || {};
                  const result = get().dispatch.compareField(field, checkField, table);
                  changes.push(...result);
                }
              });
              checkFields.forEach((field: any) => {
                if (!tableFieldsName.includes(field.name)) {
                  changes.push({
                    type: 'field',
                    name: `${table.title}.${field.name}`,
                    opt: 'delete',
                  });
                }
              });
              // 1.2.2 其他信息
              const entityResult = get().dispatch.compareEntity(_.omit(table, ['fields', 'indexs', 'headers']),
                _.omit(checkTable, ['fields', 'indexs']));
              changes.push(...entityResult);
              // 1.2.3 对比索引
              const result = get().dispatch.compareIndexs(table, checkTable);
              changes.push(...result);
            } else {
              // 1.3 如果该表不存在则说明当前版本新增了该表
              changes.push({
                type: 'entity',
                name: table.title,
                opt: 'add',
              });
            }
          });
          // 3.将比较的表循环，查找删除的表
          checkTables.forEach((table: any) => {
            // 1.1 判断该表是否存在
            if (!currentTableNames.includes(table.title)) {
              // 1.2 如果该表不存在则说明当前版本删除了该表
              changes.push({
                type: 'entity',
                name: table.title,
                opt: 'delete',
              });
            }
          });
          return changes;
        }
        return [];
      },
      getDBVersion: () => {
        // 模拟返回1.0.1
        set({
          versionData: true,
        });
        const dbData = _.get(projectState.project, 'projectJSON.profile.dbs')?.filter((d: any) => d.defaultDB)[0];
        if (!dbData) {
          set({
            dbVersion: '',
          });
          message.warn('获取数据库版本信息失败,无法获取到数据库信息,请切换尝试数据库！',5);
          set({
            versionData: false,
          });
        } else {
          const dbConfig = _.omit(dbData.properties, ['driver_class_name']);
          Save.dbversion({
            ...dbConfig,
            driverClassName: dbData.properties['driver_class_name'], // eslint-disable-line
          }).then((res: any) => {
            if (res && res.code === 200) {
              message.success('数据库版本信息获取成功');
            } else {
              message.error('数据库版本信息获取失败');
            }
            set({
              dbVersion: res.code !== 200 ? '' : res.data,
            });
          }).catch(() => {
            message.error('数据库版本信息获取失败');
          }).finally(() => {
            set({
              versionData: false,
            });
          });
        }
      },
      checkBaseVersion: (data: any) => {
        // 判断基线版本文件是否存在
        if (data.some((d: any) => d.baseVersion)) {
          set({
            init: false,
          });
        } else {
          message.warn('当前项目不存在基线版本，请先初始化基线',5);
          set({
            init: true,
          });
        }
      },
      getVersionMessage: (versionData: any, only?: boolean) => {
        const {versions = []} = get();
        let tempVersions = [];
        if (Array.isArray(versionData)) {
          tempVersions = versionData;
        } else if (versionData) {
          tempVersions = only ? [].concat(versionData) : versions.concat(versionData);
        }
        set({
          versions: tempVersions.map((data: any) => _.pick(data,
            ['id', 'version', 'versionDesc', 'changes', 'versionDate', 'projectJSON', 'baseVersion']))
            .sort((a: any, b: any) => compareStringVersion(b.version, a.version)),
        });
      }
    }
  })
);

export default useVersionStore;
