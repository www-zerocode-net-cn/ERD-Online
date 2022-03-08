import {GetState, SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import _ from "lodash";
import * as Save from '@/utils/save';
import {message} from "antd";

export type IProfileSlice = {
  currentDbKey?: string;
  profileSliceState?: any;
}

export interface IProfileDispatchSlice {
  addDefaultFields: (defaultFieldsIndex: number, payload: any) => void;
  removeDefaultFields: (defaultFieldsIndex: number) => void;
  updateDefaultFields: (defaultFieldsIndex: number, payload: any) => void;

  updateDefaultFieldsType: (payload: any) => void;
  updateSqlConfig: (payload: any) => void;

  addDbs: (payload: any) => void;
  removeDbs: (key: string) => void;
  updateDbs: (key: string, payload: any) => void;
  updateAllDbs: (payload: any) => void;
  setCurrentDbKey: (payload: string) => void;
  setDefaultDb: (payload: string) => void;

  updateWordTemplateConfig: (payload: any) => void;

  getCurrentDBName: () => any;
  getCurrentDBData: () => any;
  setProfileSliceState: (profileSlice: any) => void;
  dbReverseParse: (db: any, dataFormat: string) => void;
  checkField: (data: any) => any;
  getAllTable: (dataSource: any) => any;
}


const ProfileSlice = (set: SetState<ProjectState>, get: GetState<ProjectState>) => ({
  addDefaultFields: (defaultFieldsIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.defaultFields[defaultFieldsIndex].push(payload);
  })),
  removeDefaultFields: (defaultFieldsIndex: number) => set(produce(state => {
    delete state.project.projectJSON.profile.defaultFields[defaultFieldsIndex];
  })),
  updateDefaultFields: (defaultFieldsIndex: number, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.defaultFields[defaultFieldsIndex] = payload;
  })),

  updateDefaultFieldsType: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.defaultFieldsType = payload;
  })),
  updateSqlConfig: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.sqlConfig = payload;
  })),

  addDbs: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs.push(payload);
  })),
  removeDbs: (key: string) => set(produce(state => {
    Save.checkdbversion(key).then((res: any) => {
      if (res && res.code === 200) {
        if (res.data === 0) {
          state.project.projectJSON.profile.dbs = state.project.projectJSON?.profile?.dbs?.filter((db: any) => db.key !== key);
          console.log(56, state.project.projectJSON?.profile?.dbs);
          message.success('删除成功');
        } else {
          message.warn("当前数据源存在已同步版本，不允许删除！")
        }
      } else {
        message.error('删除失败');
      }
    }).catch(() => {
      message.error('删除失败');
    });
  })),
  updateDbs: (key: string, payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs = state.project.projectJSON?.profile?.dbs?.map((db: any) => {
      console.log(54, key, payload)
      console.log(55, state.currentDbKey)
      if (db.defaultDB) {
        return {
          ...db,
          [key]: payload
        };
      } else {
        return db;
      }
    });
    console.log(64, state.project.projectJSON?.profile?.dbs);

  })),
  updateAllDbs: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.dbs = payload;
  })),
  setCurrentDbKey: (payload: string) => set(produce(state => {
    state.currentDbKey = payload;
  })),
  setDefaultDb: (payload: string) => set(produce(state => {
    console.log(74, 'defaultDbIndex', payload);
    state.project.projectJSON.profile.dbs = state.project.projectJSON?.profile?.dbs?.map((db: any) => {
      console.log(76, 'db.key', db.key)
      if (db.key === payload) {
        state.currentDbKey = db.key;
        return {
          ...db,
          defaultDB: true
        };
      } else {
        return {
          ...db,
          defaultDB: false
        };
      }
    });
    console.log(70, state.project.projectJSON?.profile?.dbs);
  })),

  updateWordTemplateConfig: (payload: any) => set(produce(state => {
    state.project.projectJSON.profile.wordTemplateConfig = payload;
  })),
  getCurrentDBName: () => {
    const db = get().dispatch.getCurrentDBData();
    console.log(118, 'db', db);
    if (db) {
      return db.name;
    }
    return '';
  },
  getCurrentDBData: () => {
    console.log(125, get().project.projectJSON?.profile?.dbs?.filter((d: any) => d.defaultDB));
    return get().project.projectJSON?.profile?.dbs?.filter((d: any) => d.defaultDB)[0];
  },

  setProfileSliceState: (profileSlice: any) => set(produce(state => {
    state.profileSliceState = profileSlice;
  })),
  dbReverseParse: (db: any, dataFormat: string) => set(produce(state => {
    if (!dataFormat) {
      dataFormat = 'DEFAULT';
    }
    if (!db) {
      message.error('未选中或配置数据源');
      return;
    }
    get().dispatch.setProfileSliceState({
      loading: true,
      flag: true,
      status: true,
      data: {},
      exists: [],
      keys: [],
    });
    const dbConfig = _.omit(db.properties, ['driver_class_name']);
    Save.dbReverseParse({
      ...dbConfig,
      driverClassName: db.properties['driver_class_name'], // eslint-disable-line
      flag: dataFormat,
    }).then((res) => {
      if (res && res.code === 200) {
        console.log(153, 'data', res.data);
        get().dispatch.setProfileSliceState({
          ...get().profileSliceState,
          data: res.data || res,
          exists: get().dispatch.checkField(res.data || res),
          status: 'SUCCESS',
          flag: false,
        });
      } else {
        get().dispatch.setProfileSliceState({
          ...get().profileSliceState,
          status: 'FAILED'
        });
        message.error('数据库解析失败:' + res || res.msg);
      }
    }).catch((err) => {
      message.error('数据库解析失败:' + err.message);
    }).finally(() => {
      get().dispatch.setProfileSliceState({
        ...get().profileSliceState,
        flag: false,
        loading: false
      });
    });
  })),
  checkField: (data: any) => {
    let tempExists: any[];
    tempExists = [];
    const dataSource = get().project?.projectJSON;
    console.log(167, 'dataSource', dataSource);
    // 当前模型中已经拥有的数据表
    const allTable = get().dispatch.getAllTable(dataSource);
    // 从数据库解析中获取到的数据表
    const entities = _.get(data, 'module.entities', []).map((d: any) => d.title);
    entities.forEach((e: any) => {
      if (allTable.includes(e)) {
        tempExists.push(e);
      }
    });
    return tempExists;
  },
  getAllTable: (dataSource: any) => {
    return (dataSource.modules || []).reduce((a: any, b: any) => {
      return a.concat((b.entities || []).map((entity: any) => entity.title));
    }, []);
  },
});


export default ProfileSlice;
