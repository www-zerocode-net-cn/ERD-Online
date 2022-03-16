import create, {GetState, SetState} from "zustand";
import {StoreApiWithSubscribeWithSelector, subscribeWithSelector} from 'zustand/middleware';


import type {IProjectJsonDispatchSlice, IProjectJsonSlice} from "./projectJsonSlice";
import ProjectJsonSlice from "./projectJsonSlice";
import type {IConfigJsonDispatchSlice, IConfigJsonSlice} from "./configJsonSlice";
import ConfigJsonSlice from "./configJsonSlice";
import type {IModulesDispatchSlice, IModulesSlice} from "@/store/project/modulesSlice";
import type {IDataTypeDomainsDispatchSlice, IDataTypeDomainsSlice} from "@/store/project/dataTypeDomainsSlice";
import type {IProfileDispatchSlice, IProfileSlice} from "@/store/project/profileSlice";
import type {IEntitiesDispatchSlice, IEntitiesSlice} from "@/store/project/entitiesSlice";
import type {IDatabaseDomainsDispatchSlice, IDatabaseDomainsSlice} from "@/store/project/databaseDomainsSlice";
import _ from "lodash";
import * as cache from "@/utils/cache";
import request from "@/utils/request";
import {uuid} from '@/utils/uuid';
import * as Save from '@/utils/save';
import useGlobalStore from "@/store/global/globalStore";
import produce from "immer";
import {IExportDispatchSlice, IExportSlice} from "@/store/project/exportSlice";
import {message} from "antd";


// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。


export type ProjectState =
  {
    project: any,
    fetch: () => Promise<void>;
    dispatch: IProjectJsonDispatchSlice & IConfigJsonDispatchSlice & IModulesDispatchSlice
      & IDataTypeDomainsDispatchSlice & IDatabaseDomainsDispatchSlice & IProfileDispatchSlice
      & IEntitiesDispatchSlice & IExportDispatchSlice
  }
  & IProjectJsonSlice
  & IConfigJsonSlice
  & IModulesSlice
  & IDataTypeDomainsSlice
  & IDatabaseDomainsSlice
  & IProfileSlice
  & IExportSlice
  & IEntitiesSlice;

// Turn the set method into an immer proxy
// @ts-ignore
export const immer = config => (set, get, api) => config((partial, replace) => {
  console.log(51, "partial", partial)
  console.log(52, "replace", replace)
  const nextState = typeof partial === 'function'
    ? produce(partial)
    : partial;
  return set(nextState, replace);
}, get, api)

const useProjectStore = create<ProjectState, SetState<ProjectState>, GetState<ProjectState>, StoreApiWithSubscribeWithSelector<ProjectState>>(
  subscribeWithSelector(
    immer(
      (set: SetState<ProjectState>, get: GetState<ProjectState>) => ({
        project: {},
        fetch: async () => {
          const projectId = cache.getItem('projectId');
          await request.get(`/ncnb/project/info/${projectId}`).then((res: any) => {
            console.log(45, res);
            const data = res?.data;
            if (data) {
              const datatype = data?.projectJSON?.dataTypeDomains?.datatype || [];
              const database = data?.projectJSON?.dataTypeDomains?.database || [];
              const defaultDatabaseCode = _.find(database, {"defaultDatabase": true})?.code || database[0]?.code;
              console.log(45, defaultDatabaseCode);
              data?.projectJSON?.modules?.forEach((m: any) => {
                m?.entities?.forEach((e: any) => {
                  e?.fields?.forEach((f: any) => {
                    const d = _.find(datatype, {'code': f?.type});
                    _.assign(f, {"typeName": d?.name});
                    const path = `apply.${defaultDatabaseCode}.type`;
                    _.assign(f, {"dataType": _.get(d, path)});
                  });
                });
              });

              //解决导入dbs没有key的问题
              data?.projectJSON?.profile?.dbs?.forEach((d: any) => {
                if (d && !d.key) {
                  _.assign(d, {"key": uuid()});

                }
              });
              set({project: data});
            }else {
              message.error('获取项目信息失败');
            }
          });
        },
        dispatch: {
          updateProjectName: (payload: any) => set((state: any) => {
            // @ts-ignore
            state.project.projectName = payload;
          }),
          ...ProjectJsonSlice(set, get),
          ...ConfigJsonSlice(set, get),
        }
      })
    )
  )
);

const globalState = useGlobalStore.getState();
// @ts-ignore
useProjectStore.subscribe(state => state.project, (project, previousProject) => {
  console.log(109, project);
  console.log(110, previousProject);
  globalState.dispatch.setSaved(false);
  Save.saveProject(project);
  globalState.dispatch.setSaved(true);
});
export default useProjectStore;
