import {GetState, SetState} from "zustand";
import {ProjectState} from "@/store/project/useProjectStore";
import produce from "immer";
import ModulesSlice from "@/store/project/modulesSlice";
import DataTypeDomainsSlice from "@/store/project/dataTypeDomainsSlice";
import ProfileSlice from "@/store/project/profileSlice";
import DatabaseDomainsSlice from "@/store/project/databaseDomainsSlice";
import useGlobalStore from "@/store/global/globalStore";
import {State} from "zustand/vanilla";
import ExportSlice from "@/store/project/exportSlice";
import * as CryptoJS from 'crypto-js';
import _ from "lodash";
import {uuid} from "@/utils/uuid";
import {jsondiffpatch} from "@/store/project/jsondiffpatch";

export type IProjectJsonSlice = {}

export interface IProjectJsonDispatchSlice {
  fixProject: (project: any) => void;
  fixModules: (modules: any, datatype: any, database: any) => any;
  getProject: () => void;
  setProjectJson: (value: any) => void;
  setModules: (value: any) => void;
  setDataTypeDomains: (value: any) => void;
  setProfile: (value: any) => void;
  addProjectTableTitle: (title: string) => void;
  getGlobalStore: () => State;
  encrypt: (type: string, origin: string) => string;
  decrypt: (type: string, secret: string) => string;
  diff: (previousProject: any, project: any) => any;
  patch: (r: any) => void;
  setSyncing: (sync: any) => void;
  setTimestamp: () => void;
};

const globalState = useGlobalStore.getState();

const ProjectJsonSlice = (set: SetState<ProjectState>, get: GetState<ProjectState>) => ({
  fixProject: (project: any) => set(produce(state => {
    const database = get().project?.projectJSON?.dataTypeDomains?.database || [];
    const defaultDatabaseCode = _.find(database, {"defaultDatabase": true})?.code || database[0]?.code;
    console.log(45, defaultDatabaseCode);
    const modules = project?.projectJSON?.modules;
    console.log(38, 'fixProject', modules);
    const tmpModules = get().dispatch.fixModules(modules, null, null);
    console.log(73, 'modules', modules);
    if (tmpModules) {
      state.project.projectJSON.modules = tmpModules;
    }


    const dbs = project?.projectJSON?.profile?.dbs;
    if (dbs) {
      //解决导入dbs没有key的问题
      const modify_dbs = dbs?.map((d: any) => {
        if (d && !d.key) {
          return {
            ...d,
            key: uuid()
          }
        } else {
          return d;
        }
      });
      state.project.projectJSON.profile.dbs = modify_dbs;
    }
  })),
  getProject: () => set(produce(state => {
    return state.project;
  })),
  fixModules: (data: any, datatype: any, database: any) => {
    datatype = datatype || get().project?.projectJSON?.dataTypeDomains?.datatype || [];
    database = database || get().project?.projectJSON?.dataTypeDomains?.database || [];
    const defaultDatabaseCode = _.find(database, {"defaultDatabase": true})?.code || database[0]?.code;
    console.log(75,'defaultDatabaseCode', defaultDatabaseCode);
    if(!defaultDatabaseCode){
      console.log(75,'defaultDatabaseCode不存在', defaultDatabaseCode);
      return data;
    }
    return data?.map((m: any) => {
      return {
        ...m,
        entities: m?.entities?.map((e: any) => {
          return {
            ...e,
            fields: e?.fields?.map((f: any) => {
              let tmpField = f;
              const d = _.find(datatype, {'code': f?.type});
              const path = `apply.${defaultDatabaseCode}.type`;
              const type = _.get(d, path);

              if (!f.typeName && d?.name) {
                tmpField = {
                  ...tmpField,
                  typeName: d?.name
                };
              }
              if (!f.datatype && type) {
                tmpField = {
                  ...tmpField,
                  datatype: type
                };
              }
              if (!f.type && type) {
                tmpField = {
                  ...tmpField,
                  type: type
                };
              }
              return tmpField;
            })
          };
        })
      }
    });
  },
  setProjectJson: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  })),
  setModules: (value: any) => set(produce(state => {
    state.project.projectJSON.modules = value
  })),
  setDataTypeDomains: (value: any) => set(produce(state => {
    state.project.projectJSON.dataTypeDomains = value
  })),
  setProfile: (value: any) => set(produce(state => {
    state.project.projectJSON.profile = value
  })),
  addProjectTableTitle: (title: string) => set(produce(state => {
    state.tables.push(title);
  })),
  getGlobalStore: () => {
    return globalState;
  },
  encrypt: (type: string, origin: string) => {
    const erdPassword = get().project?.projectJSON?.profile?.erdPassword || 'ERDOnline';
    const secretKey = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(erdPassword).toString());
    const iv = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(secretKey).toString().substr(0, 16));
    if (type === 'AES') {
      const src = CryptoJS.enc.Utf8.parse(origin);
      const result = CryptoJS.AES.encrypt(src, secretKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return result.toString();
    }
    return "";
  },
  decrypt: (type: string, secret: string) => {
    if (type === 'AES') {
      const erdPassword = get().project?.projectJSON?.profile?.erdPassword || 'ERDOnline';
      const secretKey = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(erdPassword).toString());
      const iv = CryptoJS.enc.Utf8.parse(CryptoJS.MD5(secretKey).toString().substr(0, 16));
      const decrypted = CryptoJS.AES.decrypt(secret, secretKey, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      return CryptoJS.enc.Utf8.stringify(decrypted);
    }
    return "";
  },
  diff: (previousProject: any, project: any) => set(produce(state => {
    const delta = jsondiffpatch.diff(previousProject, project);
    return delta;
  })),
  patch: (r: any) => set(produce(state => {
    console.log(148, JSON.parse(JSON.stringify(get().project)));
    console.log(148, r.delta);
    const patchedProject = jsondiffpatch.patch(JSON.parse(JSON.stringify(get().project)), r.delta);
    patchedProject.timestamp = r.timestamp;
    console.log(148, patchedProject);
    state.project = patchedProject;
    state.syncing = true;
  })),
  setSyncing: (syncing: any) => set(produce(state => {
    state.syncing = syncing;
  })),
  setTimestamp: () => set(produce(state => {
    state.project.timestamp = Date.now();
  })),
  ...ModulesSlice(set, get),
  ...DataTypeDomainsSlice(set, get),
  ...DatabaseDomainsSlice(set, get),
  ...ProfileSlice(set, get),
  ...ExportSlice(set, get),
});


export default ProjectJsonSlice;
