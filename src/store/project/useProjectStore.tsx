import create from "zustand";

import ProjectJsonSlice, {IProjectJsonSlice} from "./projectJsonSlice";
import ConfigJsonSlice, {IConfigJsonSlice} from "./configJsonSlice";

// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。


export type ProjectState = {
  project: any,
  fetch: () => Promise<void>;
} & IProjectJsonSlice & IConfigJsonSlice;

const useProjectStore = create<ProjectState>(
  (set) => ({
    project: {},
    fetch: async () => {
      await fetch('http://localhost:8000/project.json')
        .then(res => res.json()).then(data => {
          set({project: data})
        })
    },
    ...ProjectJsonSlice(set),
    ...ConfigJsonSlice(set)
  })
);

export default useProjectStore;
