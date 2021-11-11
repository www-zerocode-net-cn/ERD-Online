import create from "zustand";

import type {IProjectJsonDispatchSlice, IProjectJsonSlice} from "./projectJsonSlice";
import ProjectJsonSlice from "./projectJsonSlice";
import type {IConfigJsonDispatchSlice, IConfigJsonSlice} from "./configJsonSlice";
import ConfigJsonSlice from "./configJsonSlice";
import produce from "immer";
import type {IModulesDispatchSlice, IModulesSlice} from "@/store/project/modulesSlice";
import type {IDataTypeDomainsDispatchSlice, IDataTypeDomainsSlice} from "@/store/project/dataTypeDomainsSlice";
import type {IProfileDispatchSlice, IProfileSlice} from "@/store/project/profileSlice";
import type {IEntitiesDispatchSlice, IEntitiesSlice} from "@/store/project/entitiesSlice";
import type {IDatabaseDomainsDispatchSlice, IDatabaseDomainsSlice} from "@/store/project/databaseDomainsSlice";
import _ from "lodash";
import request from "@/utils/request";
import * as cache from "@/utils/cache";


// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。


export type ProjectState =
  {
    project: any,
    saved: boolean;
    fetch: () => Promise<void>;
    dispatch: IProjectJsonDispatchSlice & IConfigJsonDispatchSlice & IModulesDispatchSlice & IDataTypeDomainsDispatchSlice & IDatabaseDomainsDispatchSlice & IProfileDispatchSlice & IEntitiesDispatchSlice
  }
  & IProjectJsonSlice
  & IConfigJsonSlice
  & IModulesSlice
  & IDataTypeDomainsSlice
  & IDatabaseDomainsSlice
  & IProfileSlice
  & IEntitiesSlice;


const useProjectStore = create<ProjectState>(
  (set) => ({
    project: {},
    saved: true,
    fetch: async () => {
      // const projectId = cache.getItem('projectId');
      // await request.get(`/ncnb/project/info/${projectId}`).then((res) => {
      //   console.log(45, res);
      //   const datatype = res.data.projectJSON.dataTypeDomains.datatype || [];
      //   const database = res.data.projectJSON.dataTypeDomains.database || [];
      //   const defaultDatabaseCode = _.find(database, {"defaultDatabase": true}).code || database[0].code;
      //   console.log(45, defaultDatabaseCode);
      //   res.data.projectJSON?.modules?.forEach((m: any) => {
      //     m?.entities?.forEach((e: any) => {
      //       e?.fields?.forEach((f: any) => {
      //         const d = _.find(datatype, {'code': f.type});
      //         _.assign(f, {"typeName": d.name});
      //         const path = `apply.${defaultDatabaseCode}.type`;
      //         _.assign(f, {"dataType": _.get(d, path)});
      //       });
      //     });
      //   });
      //   set({project: res.data});
      // });
      await fetch('http://localhost:8000/project.json')
        .then(res => res.json()).then(data => {
          const datatype = data.projectJSON.dataTypeDomains.datatype || [];
          const database = data.projectJSON.dataTypeDomains.database || [];
          const defaultDatabaseCode = _.find(database, {"defaultDatabase": true}).code || database[0].code;
          console.log(45, defaultDatabaseCode);
          data.projectJSON?.modules?.forEach((m: any) => {
            m?.entities?.forEach((e: any) => {
              e?.fields?.forEach((f: any) => {
                const d = _.find(datatype, {'code': f.type});
                _.assign(f, {"typeName": d.name});
                const path = `apply.${defaultDatabaseCode}.type`;
                _.assign(f, {"dataType": _.get(d, path)});
              });
            });
          });
          set({project: data});
        })
    },
    dispatch: {
      updateProjectName: (payload: any) => set(produce(state => {
        state.project.projectName = payload;
      })),
      ...ProjectJsonSlice(set),
      ...ConfigJsonSlice(set),
    }
  })
);

export default useProjectStore;
