import create from "zustand";
import {DataNode} from "antd/lib/tree";
import {tree} from "@/services/crud";
import produce from "immer";
import _ from "lodash";
import useTabStore, {QUERY_MODULE, TabGroup} from "@/store/tab/useTabStore";

// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。

type actions = {
  onSelectNode(selectedKeys: import("rc-tree/lib/interface").Key[], info: { event: "select"; selected: boolean; node: import("rc-tree/lib/interface").EventDataNode<DataNode>; selectedNodes: DataNode[]; nativeEvent: MouseEvent; }): void;
  fetchTreeData: () => void,
  setQuerySearchKey: (searchKey: string) => void

}

export type QueryState = {
  querySearchKey: string;
  treeData: DataNode[];
  dispatch: actions
};


const useQueryStore = create<QueryState>(
  (set, get) => ({
    querySearchKey: '',
    treeData: [],
    dispatch: {
      fetchTreeData: () => {
        const title = get().querySearchKey;
        let params = {};
        if (title) {
          _.set(params, 'title', title);
        }
        tree('/ncnb/queryInfo/tree', params).then(r => {
          if (r?.code === 200) {
            set({
              treeData: r?.data || []
            })
          }
        });
      },
      setQuerySearchKey: (querySearchKey: string) => set(produce(state => {
        state.querySearchKey = querySearchKey;
      })),
      onSelectNode: (selectedKeys, info) => set(produce(state => {
        console.log(49, selectedKeys, info);
        const tabDispatch = useTabStore.getState().dispatch;
        tabDispatch.addTab({group: TabGroup.QUERY, module: QUERY_MODULE, entity: info.node.title + ''});
      })),
    }

  })
);

export default useQueryStore;
