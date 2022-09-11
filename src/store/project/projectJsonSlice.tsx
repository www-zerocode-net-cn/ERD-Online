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
import request from "@/utils/request";
import {message} from "antd";

export type IProjectJsonSlice = {}

export interface IProjectJsonDispatchSlice {
  addProject: (project: any) => Promise<any>;
  setProjectJson: (value: any) => void;
  setModules: (value: any) => void;
  setDataTypeDomains: (value: any) => void;
  setProfile: (value: any) => void;
  getGlobalStore: () => State;
  encrypt: (type: string, origin: string) => string;
  decrypt: (type: string, secret: string) => string;
};

const globalState = useGlobalStore.getState();

const ProjectJsonSlice = (set: SetState<ProjectState>, get: GetState<ProjectState>) => ({
  addProject: (project: any) => {
    return request.post('/ncnb/project/add', {
      data: project
    }).then(res => {
      if (res && res.code === 200) {
        message.info('新增成功');
      }
    });
  },
  setProjectJson: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  })),
  setModules: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  })),
  setDataTypeDomains: (value: any) => set(produce(state => {
    state.project.projectJSON = value
  })),
  setProfile: (value: any) => set(produce(state => {
    state.project.projectJSON = value
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
  ...ModulesSlice(set,get),
  ...DataTypeDomainsSlice(set,get),
  ...DatabaseDomainsSlice(set, get),
  ...ProfileSlice(set, get),
  ...ExportSlice(set, get),
});


export default ProjectJsonSlice;
