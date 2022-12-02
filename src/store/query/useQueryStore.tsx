import create from "zustand";
import {DataNode} from "antd/lib/tree";
import {ADD, DEL, EDIT, GET, TREE} from "@/services/crud";
import produce from "immer";
import _ from "lodash";
import useTabStore, {TabGroup} from "@/store/tab/useTabStore";
import {message} from "antd";

// 类型：对象、函数两者都适用，但是 type 可以用于基础类型、联合类型、元祖。
// 同名合并：interface 支持，type 不支持。
// 计算属性：type 支持, interface 不支持。
// 总的来说，公共的用 interface 实现，不能用 interface 实现的再用 type 实现。主要是一个项目最好保持一致。

type actions = {
  renameQuery(id: any, query: { title: any; }): void;
  removeQuery(id: string): void;
  addQuery(query: any): void;
  fetchQueryInfo: (id: string | number) => Promise<COMMON.R>;
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
      renameQuery: (id, query) => {
        EDIT('/ncnb/queryInfo/' + id, query).then(r => {
          if (r?.code === 200) {
            message.success('修改成功');
            get().dispatch.fetchTreeData();
          }
        });
      },
      removeQuery: (id) => {
        DEL('/ncnb/queryInfo/' + id, {}).then(r => {
          if (r?.code === 200) {
            message.success('删除成功');
            get().dispatch.fetchTreeData();
          }
        });
      },
      addQuery: (query) => {
        ADD('/ncnb/queryInfo', query).then(r => {
          if (r?.code === 200) {
            message.success('新增成功');
            get().dispatch.fetchTreeData();
          }
        });
      },
      fetchQueryInfo: (id) => {
        return GET('/ncnb/queryInfo/' + id, {});
      },
      fetchTreeData: () => {
        const title = get().querySearchKey;
        let params = {};
        if (title) {
          _.set(params, 'title', title);
        }
        TREE('/ncnb/queryInfo/tree', params).then(r => {
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
        if (info.node.isLeaf) {
          tabDispatch.addTab({group: TabGroup.QUERY, module: info.node.key + '', entity: info.node.title + ''});
        }
      })),
    }

  })
);

export default useQueryStore;
